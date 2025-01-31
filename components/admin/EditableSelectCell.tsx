// app/components/admin/EditableSelectCell.tsx
"use client";

import { useState, useEffect } from "react";

export const EditableSelectCell = ({
  value,
  options,
  onChange,
  isEdited = false,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (newValue: string) => void;
  isEdited?: boolean;
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <select
      value={localValue}
      onChange={handleChange}
      className={`w-full p-1 rounded border ${
        isEdited ? "bg-yellow-100" : "bg-white"
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
