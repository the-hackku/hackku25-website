"use client";

import React, { useEffect, useState } from "react";
import { getEventCheckinCounts } from "@/app/actions/admin/getAnalyticsData";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EventCheckinData {
  name: string;
  startTime: string;
  checkins: number;
}

export default function EventCheckinChart() {
  const [data, setData] = useState<EventCheckinData[]>([]);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    async function fetchData() {
      const result = await getEventCheckinCounts();
      const filtered = result
        .filter((event) => event.checkins > 0)
        .map((event) => ({
          ...event,
          startTime: event.startTime.toISOString(),
        }));
      setData(filtered);
      setCountdown(30); // reset countdown after data fetch
    }

    fetchData();

    const pollInterval = setInterval(fetchData, 30000);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const labels = data.map(
    (event) =>
      `${event.name} (${format(new Date(event.startTime), "MMM d h:mm a")})`
  );
  const checkinCounts = data.map((event) => event.checkins);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Check-ins",
        data: checkinCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "Event (Start Time)" },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Check-ins" },
      },
    },
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Event Check-ins</h2>
        <span className="text-sm text-gray-500">Refresh in {countdown}s</span>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
}
