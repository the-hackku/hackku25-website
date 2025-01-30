"use client";

import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";

import { useSearchablePaginatedData } from "@/hooks/useSearchablePaginatedData";
import { useBatchEditing } from "@/hooks/useBatchEditing";
import { EditableTable } from "./EditableTable";
import { IconLoader } from "@tabler/icons-react";

interface GenericDataContainerProps<T extends { id: string }> {
  /** A function to fetch data from your server/database, returning { data, total } */
  fetchFunction: (
    page: number,
    pageSize: number,
    searchQuery: string
  ) => Promise<{ data: T[]; total: number }>;

  /** A function to handle batch updates on the backend */
  updateFunction: (
    editedData: Record<string, Partial<T>>
  ) => Promise<T[] | void>;

  /** Column definitions for rendering the table */
  columns: ColumnDef<T>[];

  /** An optional title for display purposes */
  title?: string;

  /** Pagination & query configuration */
  pageSize?: number;
  debounceTime?: number;
}

/**
 * A Generic Data Container Component
 * ----------------------------------
 * Accepts fetch & update functions, columns, and displays + edits data in a table.
 */
export function GenericDataContainer<T extends { id: string }>({
  fetchFunction,
  updateFunction,
  columns,
  title = "Data Manager",
  pageSize = 10,
  debounceTime = 250,
}: GenericDataContainerProps<T>) {
  // Hook to handle pagination, search, and data fetching
  const {
    data,
    totalPages,
    page,
    searchQuery,
    setPage,
    setSearchQuery,
    loading,
    fetchData, // We'll refetch after a successful update
  } = useSearchablePaginatedData<T>({
    fetchFunction,
    pageSize,
    debounceTime,
  });

  // Hook to handle batch editing state
  const {
    items,
    edited,
    handleChange,
    revertAll,
    setItems,
    setEdited,
    totalChanges,
  } = useBatchEditing<T>(data);

  // Track previous page and search state to know when to reset items/edited
  const prevPageRef = useRef(page);
  const prevSearchQueryRef = useRef(searchQuery);

  // Synchronize local items with fetched data ONLY when page or search changes
  useEffect(() => {
    if (
      page !== prevPageRef.current ||
      searchQuery !== prevSearchQueryRef.current
    ) {
      console.log(`${title}: Page or search query changed. Updating items.`);
      setItems(data);
      setEdited({}); // Clear any residual edits
      prevPageRef.current = page;
      prevSearchQueryRef.current = searchQuery;
    }
  }, [data, page, searchQuery, setItems, setEdited, title]);

  /** Handle Save All */
  async function saveAll() {
    if (Object.keys(edited).length === 0) {
      toast.message("No changes to save.");
      return;
    }

    try {
      toast.message(`Saving changes for ${title}...`);
      console.log(`${title}: Initiating save for edits:`, edited);

      // Optimistically assume the save will succeed
      await updateFunction(edited);

      console.log(`${title}: Save successful. Clearing edited state.`);
      // Clear edited changes since save was successful
      setEdited({});
      toast.dismiss();
      toast.success(`${title} changes saved.`);

      // Refetch data to synchronize with backend
      await fetchData();
      console.log(`${title}: Data refetched after successful save.`);
    } catch (err) {
      console.error(`${title}: Error saving changes:`, err);
      toast.error(`Failed to save ${title} changes.`);

      // Revert to original data if save fails
      revertAll(data);
    }
  }

  /** Revert local changes */
  function revert() {
    console.log(`${title}: Reverting all local changes.`);
    revertAll(data);
  }

  // Render
  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {/* Search & Top Buttons */}
      <div className="flex justify-between gap-2 mb-2">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Input
            placeholder={`Search ${title}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <IconLoader className="animate-spin h-5 w-5" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={revert}
            disabled={totalChanges === 0}
          >
            Revert
          </Button>
          <Button
            variant={totalChanges === 0 ? "outline" : "default"}
            color={totalChanges === 0 ? "gray" : "yellow"}
            onClick={saveAll}
            disabled={totalChanges === 0}
          >
            Save All {totalChanges > 0 && `(${totalChanges})`}
          </Button>
        </div>
      </div>

      {/* Editable Table */}
      <EditableTable<T>
        data={items}
        columns={columns}
        edited={edited}
        onCellChange={(rowId, field, newValue) => {
          handleChange(rowId, field, newValue);
          console.log(
            `${title}: Cell changed: Row ${rowId}, Field ${String(
              field
            )}, New Value ${newValue}`
          );
        }}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
