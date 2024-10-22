// app/components/QrCodeComponent.tsx
"use client";

import React from "react";
import { Bar } from "@/components/ui/bar"

interface XPBarProps {
  xpDouble: number | null;
  error?: string;
}

const XPBar = ({ xpDouble, error }: XPBarProps) => {
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
        <div className="background-bar">
            <Bar background-color="red"/>
        </div>

  );
};

export default XPBar;