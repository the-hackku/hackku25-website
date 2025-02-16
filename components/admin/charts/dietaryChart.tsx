"use client";

import React, { useEffect, useState } from "react";
import { getDietaryData } from "@/app/actions/analytics/getData";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fuzzyMatchWithConfidence } from "@/utils/fuzzyMatching";

ChartJS.register(ArcElement, Tooltip, Legend);

const CONFIDENCE_THRESHOLD = 0.3;

export default function DietaryChart() {
  const [categorizedData, setCategorizedData] = useState<
    Record<string, number>
  >({});
  const [uncertainData, setUncertainData] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await getDietaryData();
        categorizeData(results);
      } catch (error) {
        console.error("Error fetching dietary data:", error);
      }
    }
    fetchData();
  }, []);

  // Predefined dietary categories
  const dietaryCategories = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Halal",
    "Kosher",
    "No Pork",
    "No Beef",
    "Allergies",
    "Only Chicken",
  ];

  // List of words/phrases to filter out
  const ignorePhrases = [
    "none",
    "no restriction",
    "n/a",
    "na",
    "no",
    "nothing",
    "nope",
    "nil",
    "nah",
  ];

  // Categorize data using fuzzy matching in the frontend
  function categorizeData(data: string[]) {
    const counts: Record<string, number> = {};
    const uncertain: string[] = [];

    data.forEach((entry) => {
      // Trim whitespace and convert to lowercase
      const cleanedEntry = entry.trim().toLowerCase();

      // Skip irrelevant or empty entries
      if (
        !cleanedEntry ||
        ignorePhrases.some((phrase) => cleanedEntry === phrase)
      )
        return;

      const { category, confidence } = fuzzyMatchWithConfidence(
        cleanedEntry,
        dietaryCategories
      );

      if (confidence >= CONFIDENCE_THRESHOLD) {
        counts[category] = (counts[category] || 0) + 1;
      } else {
        uncertain.push(entry.trim()); // Store the original entry for review
      }
    });

    setCategorizedData(counts);
    setUncertainData(uncertain);
  }

  if (!Object.keys(categorizedData).length) return <p>Loading...</p>;

  const chartData = {
    labels: Object.keys(categorizedData),
    datasets: [
      {
        label: "Dietary Restrictions",
        data: Object.values(categorizedData),
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">Dietary Restrictions</h3>
      <Pie data={chartData} />

      {/* Display uncertain data */}
      {uncertainData.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">
            Uncategorized Entries (Needs Review)
          </h4>
          <ul className="list-disc ml-6">
            {uncertainData.map((entry, index) => (
              <li key={index} className="text-gray-600">
                {entry}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
