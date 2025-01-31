// components/admin/EditableTable.tsx
"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EditableCell } from "./EditableCell";
import { EditableSelectCell } from "./EditableSelectCell";
import { TableComponent } from "./Table";

// Add type for select options
export type SelectOption = {
  value: string;
  label: string;
};

// Extend ColumnDef meta type to include select configuration
declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    selectOptions?: SelectOption[];
  }
}

interface EditableTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  onCellChange?: (rowId: string, field: keyof T, newValue: unknown) => void;
  edited?: Record<string, Partial<T>>;
}

export function EditableTable<T extends { id: string }>({
  data,
  columns,
  onCellChange,
  edited = {},
}: EditableTableProps<T>) {
  const enhancedColumns = columns.map((col) => {
    if (col.cell) return col;

    return {
      ...col,
      cell: ({ row }: { row: { original: T } }) => {
        const rowData = row.original;
        const field = col.id as keyof T;
        const value = rowData[field];
        const rowId = rowData.id;
        const isEdited = edited[rowId]?.hasOwnProperty(field) ?? false;
        const selectOptions = col.meta?.selectOptions;

        if (selectOptions) {
          return (
            <EditableSelectCell
              value={value as string}
              options={selectOptions}
              onChange={(newValue) => onCellChange?.(rowId, field, newValue)}
              isEdited={isEdited}
            />
          );
        }

        return (
          <EditableCell
            value={value}
            onChange={(newValue) => onCellChange?.(rowId, field, newValue)}
            isEdited={isEdited}
          />
        );
      },
    };
  });

  return <TableComponent data={data} columns={enhancedColumns} />;
}
