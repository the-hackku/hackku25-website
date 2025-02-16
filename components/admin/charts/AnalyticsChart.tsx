"use client";

import React, { useEffect, useState } from "react";
import { getAnalyticsData } from "@/app/actions/admin/getAnalyticsData";
import { Line, Bar } from "react-chartjs-2";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { format, parseISO, subDays } from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DataPoint {
  date: string;
  registrations: number;
  checkins: number;
}

export default function AnalyticsChart() {
  const [rawData, setRawData] = useState<DataPoint[]>([]);
  const [aggregation, setAggregation] = useState<"hourly" | "daily">("daily"); // ✅ Separate hourly/daily
  const [chartType, setChartType] = useState<"area" | "bar">("bar"); // ✅ Area for cumulative, Bar for raw
  const [daysBack, setDaysBack] = useState(7); // Default: Last 7 days

  const endDate = new Date(); // Always today
  const startDate = subDays(endDate, daysBack); // Calculate based on selection

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await getAnalyticsData(startDate, endDate, aggregation);
        setRawData(results);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    }
    fetchData();
  }, [daysBack, aggregation]); // Refetch when changes

  function transformData(data: DataPoint[]) {
    if (chartType === "area") {
      let runningRegistrations = 0;
      let runningCheckins = 0;
      return data.map((item) => {
        runningRegistrations += item.registrations;
        runningCheckins += item.checkins;
        return {
          date: item.date,
          registrations: runningRegistrations,
          checkins: runningCheckins,
        };
      });
    }
    return data; // Bar chart uses raw data (non-cumulative)
  }

  const displayData = transformData(rawData);

  const labels = displayData.map((item) =>
    format(
      parseISO(item.date),
      aggregation === "hourly" ? "MMM d, h a" : "MMM d"
    )
  );
  const registrationData = displayData.map((item) => item.registrations);
  const checkinData = displayData.map((item) => item.checkins);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Registrations",
        data: registrationData,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.3)",
        fill: chartType === "area",
      },
      {
        label: "Check-ins",
        data: checkinData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.3)",
        fill: chartType === "area",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Date/Hour" } },
      y: { title: { display: true, text: "Count" }, beginAtZero: true },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Analytics</h2>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label className="font-medium">Show Data For:</label>
        <select
          value={daysBack}
          onChange={(e) => setDaysBack(Number(e.target.value))}
          className="border rounded p-1"
        >
          <option value={1}>Last 1 Day</option>
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>

        <label className="font-medium">Aggregation:</label>
        <select
          value={aggregation}
          onChange={(e) => setAggregation(e.target.value as "hourly" | "daily")}
          className="border rounded p-1"
        >
          <option value="daily">Daily</option>
          <option value="hourly">Hourly</option>
        </select>

        <label className="font-medium">Chart Type:</label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as "area" | "bar")}
          className="border rounded p-1"
        >
          <option value="area">Cumulative (Area)</option>
          <option value="bar">Raw (Bar)</option>
        </select>
      </div>

      <div className="w-full">
        {chartType === "area" ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
