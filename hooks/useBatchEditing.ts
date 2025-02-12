// hooks/useBatchEditing.ts

"use client";

import { useState, useEffect } from "react";

export function useBatchEditing<T extends { id: string }>(originalData: T[]) {
  const [items, setItems] = useState<T[]>(originalData);
  const [edited, setEdited] = useState<Record<string, Partial<T>>>({});

  // Reset items and edited when originalData changes
  useEffect(() => {
    setItems(originalData);
    setEdited({});
  }, [originalData]);

  // Handle cell changes
  const handleChange = (itemId: string, field: keyof T, newValue: unknown) => {
    const originalItem = originalData.find((i) => i.id === itemId);
    const originalValue = originalItem ? originalItem[field] : undefined;

    // If new value is same as original, remove from edited
    if (String(newValue) === String(originalValue)) {
      setEdited((prev) => {
        const updated = { ...prev };
        const changesForItem = { ...updated[itemId] };
        delete changesForItem[field];

        if (Object.keys(changesForItem).length === 0) {
          delete updated[itemId];
        } else {
          updated[itemId] = changesForItem;
        }
        return updated;
      });
    } else {
      // Otherwise mark as edited
      setEdited((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [field]: newValue,
        },
      }));
      console.log(`Marked Row ${itemId}, Field ${String(field)} as edited`);
    }

    // Update the local items array
    setItems((prevItems) =>
      prevItems.map((i) => (i.id === itemId ? { ...i, [field]: newValue } : i))
    );
  };

  // Revert all local changes to the original data
  const revertAll = (originalData: T[]) => {
    setItems(originalData);
    setEdited({});
  };

  // Utility function: count total changes
  const totalChanges = Object.values(edited).reduce(
    (sum, curr) => sum + Object.keys(curr).length,
    0
  );

  return {
    items,
    edited,
    handleChange,
    revertAll,
    setItems,
    setEdited,
    totalChanges,
  };
}
