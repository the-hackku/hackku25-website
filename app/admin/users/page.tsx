"use client";

import { getUsers } from "@/app/actions/admin"; // Server Action
import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "@/components/admin/Table";
import { User } from "@/types/user"; // Import the User interface

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // ShadCN Tooltip components

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [participantColumns, setParticipantColumns] = useState<
    ColumnDef<any>[]
  >([]);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);

      // Generate dynamic columns for ParticipantInfo
      if (data.length > 0) {
        const allKeys = new Set<string>();

        // Collect keys from ParticipantInfo
        data.forEach((user) => {
          if (user.ParticipantInfo) {
            Object.keys(user.ParticipantInfo).forEach((key) =>
              allKeys.add(key)
            );
          }
        });

        // Add "Email" as a static column
        allKeys.add("email");

        // Create columns dynamically for ParticipantInfo
        const dynamicParticipantColumns: ColumnDef<any>[] = Array.from(
          allKeys
        ).map((key) => ({
          header: key.replace(/([A-Z])/g, " $1"), // Convert camelCase to readable headers
          accessorFn: (row) => {
            const value = row[key];
            if (value === null || value === undefined) return "N/A";
            if (typeof value === "object") return JSON.stringify(value);
            return value;
          },
          cell: ({ row }) => {
            const value = row.original[key];
            const displayValue =
              value === null || value === undefined
                ? "N/A"
                : typeof value === "object"
                ? JSON.stringify(value)
                : value;

            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="truncate block max-w-[150px] overflow-hidden text-ellipsis">
                      {displayValue}
                    </span>
                  </TooltipTrigger>
                  {displayValue !== "N/A" && (
                    <TooltipContent>
                      {typeof displayValue === "string" && displayValue}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          },
        }));

        setParticipantColumns(dynamicParticipantColumns);
      }
    }

    fetchUsers();
  }, []);

  // Define User table columns
  const userColumns: ColumnDef<User>[] = [
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <TableComponent data={users} columns={userColumns} />

      <h1 className="text-2xl font-bold mt-8 mb-4">Participant Info</h1>
      <TableComponent
        data={users
          .map((user) =>
            user.ParticipantInfo
              ? { ...user.ParticipantInfo, email: user.email }
              : null
          )
          .filter(Boolean)}
        columns={participantColumns}
      />
    </div>
  );
}
