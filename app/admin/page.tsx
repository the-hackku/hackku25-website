"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GenericDataContainer } from "@/components/admin/GenericDataContainer";
import {
  getUsers,
  batchUpdateUsers,
  getCheckins,
  batchUpdateCheckins,
  getReimbursements,
  batchUpdateReimbursements,
  backupRegistrationScript,
} from "@/app/actions/admin";
import { ColumnDef } from "@tanstack/react-table";
import { ROLE, TravelReimbursement } from "@prisma/client";
import { UserDetailsDialog } from "@/components/admin/UserDetailsDialog";
import { EventDetailsDialog } from "@/components/admin/EventDetailsDialog"; // Import EventDetailsDialog
import Link from "next/link";
import { format } from "date-fns";
import { ParticipantInfo } from "@prisma/client";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import AnalyticsChart from "@/components/admin/charts/AnalyticsChart";
import CombinedDashboard from "@/components/admin/charts/combinedDashboard";
import { exportEmails, exportParticipantEmails } from "@/scripts/emailExporter";

// Extend the User type to include relations or additional fields
interface ExtendedUser extends User {
  ParticipantInfo?: ParticipantInfo | null;
  checkinsAsUser?: Checkin[];
}
interface User {
  id: string;
  email: string;
  role: ROLE;
  name?: string | null;
}

interface ExtendedTravelReimbursement extends TravelReimbursement {
  creator: {
    id: string;
    email: string;
    ParticipantInfo?: {
      firstName: string;
      lastName: string;
    } | null;
  };
  invites: {
    user: {
      email: string;
    };
  }[];
}

interface Checkin {
  id: string;
  userId: string;
  eventId: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
    participantInfo?: {
      firstName: string;
      lastName: string;
    } | null;
  };
  event: {
    name: string;
  };
}

const handleBackup = async () => {
  backupRegistrationScript();
};

const downloadFile = (fileName: string, content: string) => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const handleDownloadUserEmails = async () => {
  const emails = await exportEmails();
  downloadFile("all_emails.txt", emails);
};

const handleDownloadRegistrantEmails = async () => {
  const emails = await exportParticipantEmails();
  downloadFile("participant_emails.txt", emails);
};

export default function AdminTabsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null); // Track event selection

  const userColumns: ColumnDef<ExtendedUser>[] = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center">
            <button
              onClick={() => setSelectedUserId(user.id)}
              className={
                "hover:underline text-left flex flex-row items-center " +
                (user.ParticipantInfo ? "" : "text-red-300")
              }
            >
              {user.ParticipantInfo
                ? `${user.ParticipantInfo.firstName} ${user.ParticipantInfo.lastName}`
                : "Unknown"}
              <IconArrowUpRight size={12} className="ml-1" />
            </button>
          </div>
        );
      },
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => {
        return row.original.email;
      },
    },
    {
      id: "role",
      header: "Role",
      accessorFn: (row) => row.role,
      meta: {
        selectOptions: Object.values(ROLE).map((role) => ({
          value: role,
          label: role,
        })),
      },
    },
  ];

  const reimbursementColumns: ColumnDef<ExtendedTravelReimbursement>[] = [
    {
      id: "user",
      header: "User",
      cell: ({ row }) => {
        const reimbursement = row.original;
        const participantInfo = reimbursement.creator?.ParticipantInfo;
        const userName = participantInfo
          ? `${participantInfo.firstName} ${participantInfo.lastName}`
          : "Unknown";

        return (
          <button
            onClick={() => setSelectedUserId(reimbursement.creator.id)}
            className="hover:underline text-left"
          >
            {userName} ({reimbursement.creator.email})
          </button>
        );
      },
    },
    {
      id: "transportationMethod",
      header: "Transport",
      accessorFn: (row) => row.transportationMethod,
    },
    {
      id: "address",
      header: "Address",
      accessorFn: (row) => row.address,
    },
    {
      id: "distance",
      header: "Distance (miles)",
      accessorFn: (row) => row.distance,
    },
    {
      id: "estimatedCost",
      header: "Estimated Cost ($)",
      accessorFn: (row) => row.estimatedCost,
    },
    {
      id: "reason",
      header: "Reason",
      accessorFn: (row) => row.reason,
    },
  ];

  const checkinColumns: ColumnDef<Checkin>[] = [
    {
      id: "user",
      header: "User",
      cell: ({ row }) => {
        const checkin = row.original;
        const userName = checkin.user.participantInfo
          ? `${checkin.user.participantInfo.firstName} ${checkin.user.participantInfo.lastName}`
          : checkin.user.name || "Unknown";

        return (
          <button
            onClick={() => setSelectedUserId(checkin.userId)} // Show user details dialog
            className="hover:underline text-left"
          >
            {userName}
          </button>
        );
      },
    },
    {
      id: "event",
      header: "Event",
      cell: ({ row }) => {
        const checkin = row.original;
        return (
          <button
            onClick={() => setSelectedEventId(checkin.eventId)} // Show event details dialog
            className="hover:underline text-left"
          >
            {checkin.event.name}
          </button>
        );
      },
    },
    {
      id: "timestamp",
      header: "Time",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return format(date, "MMMM d, yyyy, h:mm a");
      },
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      {/* User Details Dialog */}
      <UserDetailsDialog
        userId={selectedUserId}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
      />

      {/* Event Details Dialog */}
      <EventDetailsDialog
        eventId={selectedEventId}
        onOpenChange={(open) => !open && setSelectedEventId(null)} // Reset event ID when closed
      />

      <Tabs defaultValue="analytics">
        <TabsList className="mb-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="checkins">Check-ins</TabsTrigger>
        </TabsList>
        <TabsList className="mb-4">
          <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="actions">Admin Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <GenericDataContainer<User>
            title="Users"
            fetchFunction={async (page, pageSize, searchQuery) => {
              const { users, totalUsers } = await getUsers(
                page,
                pageSize,
                searchQuery
              );
              return { data: users, total: totalUsers };
            }}
            updateFunction={async (editedData) => {
              await batchUpdateUsers(editedData);
            }}
            columns={userColumns}
            pageSize={20}
            debounceTime={250}
          />
        </TabsContent>
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
            debounceTime={250}
          />
        </TabsContent>
        <TabsContent value="reimbursements">
          <GenericDataContainer<ExtendedTravelReimbursement>
            title="Reimbursements"
            fetchFunction={async (page, pageSize, searchQuery) => {
              const { reimbursements, totalReimbursements } =
                await getReimbursements(page, pageSize, searchQuery);

              // ✅ Ensure `creator` is included correctly
              const formattedReimbursements: ExtendedTravelReimbursement[] =
                reimbursements.map((reimbursement) => ({
                  ...reimbursement,
                  creator: {
                    id: reimbursement.creator.id,
                    email: reimbursement.creator.email,
                    ParticipantInfo: reimbursement.creator.ParticipantInfo
                      ? {
                          firstName:
                            reimbursement.creator.ParticipantInfo.firstName,
                          lastName:
                            reimbursement.creator.ParticipantInfo.lastName,
                        }
                      : null,
                  },
                  invites: reimbursement.invites.map((invite) => ({
                    user: {
                      email: invite.user.email,
                    },
                  })),
                }));

              return {
                data: formattedReimbursements,
                total: totalReimbursements,
              };
            }}
            updateFunction={async (editedData) => {
              await batchUpdateReimbursements(editedData);
            }}
            columns={reimbursementColumns}
            debounceTime={250}
          />
        </TabsContent>
        ; ; ;
        <TabsContent value="events">
          <div className="flex flex-col items-start space-y-2">
            <p className="text-sm text-muted-foreground">
              Manage your events in a separate page:
            </p>
            <Link href="/admin/events" className="underline text-blue-600">
              Go to Manage Events
            </Link>
          </div>
        </TabsContent>
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
        <TabsContent value="actions">
          <div className="flex flex-col items-start space-y-2">
            <Button onClick={handleBackup}>
              Batch Backup Registration Data
            </Button>
            <Button onClick={handleDownloadUserEmails}>
              Download User Emails
            </Button>
            <Button onClick={handleDownloadRegistrantEmails}>
              Download Registrant Emails
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsChart />
          <CombinedDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
