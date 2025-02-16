"use client";

import React from "react";
import DietaryChart from "./dietaryChart";
import AccessibilityChart from "./accessabilityChart";

export default function CombinedDashboard() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Participant Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DietaryChart />
        <AccessibilityChart />
      </div>
    </div>
  );
}
