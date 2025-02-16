"use client";

import React, { useEffect, useState } from "react";
import { getAccessibilityData } from "@/app/actions/analytics/getData";

export default function AccessibilityList() {
  const [accommodations, setAccommodations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await getAccessibilityData();
        setAccommodations(results);
      } catch (error) {
        console.error("Error fetching accessibility data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading accessibility requests...</p>;

  if (accommodations.length === 0)
    return <p>No accessibility requests found.</p>;

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">Accessibility Requests</h3>
      <ul className="list-disc ml-6">
        {accommodations.map((entry, index) => (
          <li key={index} className="text-gray-800">
            {entry}
          </li>
        ))}
      </ul>
    </div>
  );
}
