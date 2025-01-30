"use client";

import React from "react";
import Link from "next/link";

// shadcn/ui tabs components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Your generic data container
import { GenericDataContainer } from "@/components/admin/GenericDataContainer";

// Column definitions & server actions for Users
import { getUsers, batchUpdateUsers, getCheckins } from "@/app/actions/admin";
import { ColumnDef } from "@tanstack/react-table";
import { ROLE } from "@prisma/client";

/** Example user interface */
interface User {
  id: string;
  email: string;
  role: ROLE;
  name?: string | null;
}

/** Example columns for users */
const userColumns: ColumnDef<User>[] = [
  {
    id: "email",
    header: "Email",
    accessorFn: (row) => row.email,
  },
  {
    id: "role",
    header: "Role",
    accessorFn: (row) => row.role,
  },
];

/**
 * Example Checkin interface + columns
 * If you have a checkins model:
 */
interface Checkin {
  id: string;
  userId: string;
  eventId: string;
  createdAt: Date; // Use `createdAt` instead of `timestamp`
  user: {
    name: string | null;
    email: string;
  };
  event: {
    name: string;
  };
}
const checkinColumns: ColumnDef<Checkin>[] = [
  {
    id: "userId",
    header: "User ID",
    accessorFn: (row) => row.userId,
  },
  {
    id: "eventId",
    header: "Event ID",
    accessorFn: (row) => row.eventId,
  },
  {
    id: "timestamp",
    header: "Timestamp",
    accessorFn: (row) => row.createdAt.toISOString(),
  },
];

/**
 * Main Admin Tabs Page:
 * Shows four tabs:
 * 1) Users - Renders GenericDataContainer for users
 * 2) Check-ins - Renders GenericDataContainer for checkins
 * 3) Events - Link to /admin/events
 * 4) Scanner - Link to /admin/scanner
 */
export default function AdminTabsPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      <Tabs defaultValue="users">
        {/* --- Tabs Navigation --- */}
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="checkins">Check-ins</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
        </TabsList>

        {/* --- Tab: Users --- */}
        <TabsContent value="users">
          <GenericDataContainer<User>
            title="Users"
            fetchFunction={async (page, pageSize, searchQuery) => {
              // Our getUsers server action returns { users, totalUsers }
              const { users, totalUsers } = await getUsers(
                page,
                pageSize,
                searchQuery
              );
              return { data: users, total: totalUsers };
            }}
            updateFunction={async (editedData) => {
              // We expect batchUpdateUsers to handle changes
              await batchUpdateUsers(editedData);
            }}
            columns={userColumns}
            pageSize={10}
            debounceTime={250}
          />
        </TabsContent>

        {/* --- Tab: Check-ins --- */}
        <TabsContent value="checkins">
          <GenericDataContainer<Checkin>
            title="Check-ins"
            fetchFunction={async (page, pageSize, searchQuery) => {
              const { checkins, totalCheckins } = await getCheckins(
                page,
                pageSize,
                searchQuery
              );
              return { data: checkins, total: totalCheckins };
            }}
            updateFunction={async (editedData) => {
              await batchUpdateCheckins(editedData);
            }}
            columns={checkinColumns}
            pageSize={10}
            debounceTime={250}
          />
        </TabsContent>

        {/* --- Tab: Events --- */}
        <TabsContent value="events">
          {/* 
            Option A: Link directly to a dedicated AdminEvents page (which might 
            also be a GenericDataContainer but with different columns and fetch/update logic).
          */}
          <div className="flex flex-col items-start space-y-2">
            <p className="text-sm text-muted-foreground">
              Manage your events in a separate page:
            </p>
            <Link href="/admin/events" className="underline text-blue-600">
              Go to Manage Events
            </Link>
          </div>
        </TabsContent>

        {/* --- Tab: Scanner --- */}
        <TabsContent value="scanner">
          <div className="flex flex-col items-start space-y-2">
            <p className="text-sm text-muted-foreground">
              Use our QR Code scanner to check participants in:
            </p>
            <Link href="/admin/scanner" className="underline text-blue-600">
              Go to Scanner
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** Example placeholder batchUpdateCheckins function */
async function batchUpdateCheckins(
  editedData: Record<string, Partial<Checkin>>
) {
  console.log("batchUpdateCheckins called with:", editedData);
  // Put your actual logic here or call your server action
  // e.g. await prisma.checkin.updateMany(...)
}
