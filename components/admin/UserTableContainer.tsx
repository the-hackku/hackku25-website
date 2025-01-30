// components/admin/UserTableContainer.tsx

"use client";

import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";

import { useSearchablePaginatedData } from "@/hooks/useSearchablePaginatedData";
import { useBatchEditing } from "@/hooks/useBatchEditing";

import { EditableTable } from "./EditableTable";

// Import your server actions
import { getUsers, batchUpdateUsers } from "@/app/actions/admin";

/**
 * Your user interface. Adapt fields to match your actual user model.
 */
import { ROLE } from "@prisma/client";
import { IconLoader } from "@tabler/icons-react";

interface User {
  id: string;
  email: string;
  role: ROLE;
  name?: string | null;
  // ... any other fields
}

const userColumns: ColumnDef<User>[] = [
  {
    id: "email",
    header: "Email",
    accessorFn: (row) => row.email, // Works with all versions
  },
  {
    id: "role",
    header: "Role",
    accessorFn: (row) => row.role,
  },
];

export function UserTableContainer() {
  const {
    data,
    totalPages,
    page,
    searchQuery,
    setPage,
    setSearchQuery,
    loading,
    fetchData, // Capture fetchData
  } = useSearchablePaginatedData<User>({
    fetchFunction: async (page, pageSize, searchQuery) => {
      // Our `getUsers` server action returns `{ data: users, total: totalUsers }`
      const { users, totalUsers } = await getUsers(page, pageSize, searchQuery);
      return { data: users, total: totalUsers };
    },
    pageSize: 10, // or any default
    debounceTime: 250, // or any default
  });

  // Initialize the batch editing hook
  const {
    items,
    edited,
    handleChange,
    revertAll,
    setItems,
    setEdited,
    totalChanges,
  } = useBatchEditing<User>(data);

  // Refs to track previous page and searchQuery
  const prevPageRef = useRef(page);
  const prevSearchQueryRef = useRef(searchQuery);

  // Keep items in sync with newly fetched data only when page or searchQuery changes
  useEffect(() => {
    if (
      page !== prevPageRef.current ||
      searchQuery !== prevSearchQueryRef.current
    ) {
      console.log("Page or searchQuery changed. Updating items.");
      setItems(data);
      setEdited({}); // Clear any residual edits
      prevPageRef.current = page;
      prevSearchQueryRef.current = searchQuery;
    }
  }, [data, page, searchQuery, setItems, setEdited]);

  async function saveAll() {
    if (Object.keys(edited).length === 0) {
      toast.message("No changes to save.");
      return;
    }

    try {
      toast.message("Saving user changes...");
      console.log("Initiating save for edits:", edited);

      // Optimistically assume the save will succeed
      await batchUpdateUsers(edited);

      console.log("Save successful. Clearing edited state.");
      // ✅ Clear edited changes since save was successful
      setEdited({});
      toast.dismiss();
      toast.success("User changes saved.");

      // Refetch data to synchronize with backend
      await fetchData();
      console.log("Data refetched after successful save.");
    } catch (err) {
      console.error("Error saving user changes:", err);
      toast.error("Failed to save user changes.");

      // Revert to the original data if save fails
      revertAll(data);
    }
  }

  // Revert local changes
  function revert() {
    console.log("Reverting all changes.");
    revertAll(data);
  }

  return (
    <div>
      {/* Search */}

      {/* Top Buttons */}
      <div className="flex justify-between gap-2 mb-2">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search users by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <IconLoader className="animate-spin h-5 w-5 " />
            </div>
          )}
        </div>

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

      {/* The editable table */}

      <EditableTable<User>
        data={items}
        columns={userColumns}
        onCellChange={(rowId, field, newValue) => {
          handleChange(rowId, field, newValue);
          console.log(
            `Cell changed: Row ${rowId}, Field ${field}, New Value ${newValue}`
          );
        }}
        edited={edited} // Pass edited state
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
