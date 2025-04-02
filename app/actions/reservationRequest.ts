"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";

// 1) Import your Google Sheets export function
import { exportReservationRequestToGoogleSheet } from "@/scripts/googleSheetsExport";

export async function createReservationRequest(input: {
  teamName: string;
  teamMembers: string; // e.g. "id1, id2, id3"
  memberEmails: string; // e.g. "email1@example.com, email2@example.com"
  outOfState: boolean;
}) {
  try {
    // 1) Get the current user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated! Please sign in first.");
    }

    // 2) Create the reservation request record

    const aggEmails = `${session.user.email}, ${input.memberEmails}`;
    const reservation = await prisma.reservationRequest.create({
      data: {
        userId: session.user.id,
        teamName: input.teamName,
        memberEmails: aggEmails,
        outOfState: input.outOfState,
        // If your schema has a "teamMembers" column, store it as well:
        // teamMembers: input.teamMembers,
      },
    });

    // 3) Immediately export to Google Sheets
    await exportReservationRequestToGoogleSheet(reservation);

    // 4) Return the reservation record
    return reservation;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // e.g., user already has a reservation (unique constraint), or other DB error
      throw new Error(error.message || "Failed to create reservation request.");
    }
    throw new Error("Failed to create reservation request.");
  }
}
