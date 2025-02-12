"use client";

import { useEffect, useState } from "react";

interface EditableCellProps {
  value: unknown;
  onChange: (newValue: string) => void;
  isEdited?: boolean;
}

export const EditableCell = ({
  value,
  onChange,
  isEdited = false,
}: EditableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(String(value ?? ""));

  useEffect(() => {
    setLocalValue(String(value ?? ""));
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== String(value)) {
      onChange(localValue);
    } else {
    }
  };

  return isEditing ? (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleBlur();
        if (e.key === "Escape") {
          setLocalValue(String(value ?? ""));
          setIsEditing(false);
        }
      }}
      autoFocus
      className={` px-2 py-1 border rounded ${isEdited ? "bg-yellow-300" : ""}`}
    />
  ) : (
    <div
      onClick={(e) => {
        e.stopPropagation(); // Prevent parent handlers from blocking the event
        setIsEditing(true);
      }}
      className={`cursor-pointer truncate hover:bg-gray-100 p-1 rounded text-left ${
        isEdited ? "bg-yellow-300" : ""
      }`}
    >
      {String(value ?? "")}
    </div>
  );
};
