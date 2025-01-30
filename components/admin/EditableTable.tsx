// components/admin/EditableTable.tsx

"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { EditableCell } from "./EditableCell"; // Your existing cell component
import { TableComponent } from "./Table";

interface EditableTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  onCellChange?: (rowId: string, field: keyof T, newValue: unknown) => void;
  edited?: Record<string, Partial<T>>; // Add edited state
}

/**
 * Main Reusable Editable Table
 */
export function EditableTable<T extends { id: string }>({
  data,
  columns,
  onCellChange,
  edited = {},
}: EditableTableProps<T>) {
  const enhancedColumns = columns.map((col) => {
    return {
      ...col,
      cell: ({ row }: { row: { original: T } }) => {
        const rowData = row.original;
        const field = col.id as keyof T; // Ensure we're using `id`
        const value = rowData[field];
        const rowId = rowData.id;

        // Determine if the cell is edited
        const isEdited = edited[rowId]?.hasOwnProperty(field) ?? false;

        return (
          <EditableCell
            value={value}
            onChange={(newValue) => {
              if (onCellChange) {
                onCellChange(rowId, field, newValue);
              }
            }}
            isEdited={isEdited}
          />
        );
      },
    };
  });

  return <TableComponent data={data} columns={enhancedColumns} />;
}
