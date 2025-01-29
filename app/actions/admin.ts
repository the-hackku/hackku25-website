"use server";

import { prisma } from "@/prisma";
import { isAdmin } from "@/middlewares/isAdmin";
import { EventType } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authoptions";

// Type for the Event data used in creating or updating events// Type for the Event data used in creating or updating events

interface EventData {
  startDate: string;
  endDate: string;
  name: string;
  location: string;
  description: string;
  eventType: EventType;
}

type ValidateQrCodeResult =
  | {
      success: true;
      id: string;
      name: string;
      message: string;
      isHighSchoolStudent: boolean;
      chaperoneInfo?: {
        chaperoneName: string;
        chaperoneEmail: string;
        chaperonePhone: string;
      };
    }
  | {
      success: false;
      message: string;
    };

// CRUD operations for the admin dashboard

// Fetch all users and return their names and emails
export async function getUsers() {
  await isAdmin(); // Only allow admins to access this data

  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      ParticipantInfo: true, // Fetch all fields from ParticipantInfo
    },
  });
}

// Fetch all check-ins and return user names, event names, and check-in time
export async function getCheckins() {
  await isAdmin(); // Ensure only admins can access

  return await prisma.checkin.findMany({
    select: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      event: {
        select: {
          name: true,
        },
      },
      createdAt: true,
    },
  });
}

// Create a new event
export async function createEvent(data: EventData) {
  await isAdmin(); // Ensure only admins can access

  return await prisma.event.create({
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      location: data.location || null,
      description: data.description,
      eventType: data.eventType,
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      location: true,
      description: true,
      eventType: true,
    },
  });
}

export async function updateEvent(eventId: string, data: EventData) {
  await isAdmin(); // Ensure only admins can access

  return await prisma.event.update({
    where: { id: eventId },
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      location: data.location || null,
      description: data.description,
      eventType: data.eventType, // Add eventType
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      location: true,
      description: true,
      eventType: true, // Include eventType
    },
  });
}

// Delete an event
export async function deleteEvent(eventId: string) {
  await isAdmin(); // Ensure only admins can access

  return await prisma.event.delete({
    where: { id: eventId },
    select: {
      id: true, // Include id for frontend reference
      name: true, // Return the name of the deleted event
    },
  });
}

export async function validateQrCode(
  scannedCode: string,
  eventId: string
): Promise<ValidateQrCodeResult> {
  const session = await getServerSession(authOptions);

  // Ensure the user is an admin
  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "You are not authorized to perform this action.",
    };
  }

  // Fetch the admin user
  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!admin) {
    return {
      success: false,
      message: "Admin not found.",
    };
  }

  // Fetch the user associated with the scanned QR code
  const user = await prisma.user.findUnique({
    where: { id: scannedCode },
    select: {
      id: true,
      ParticipantInfo: {
        select: {
          firstName: true,
          lastName: true,
          isHighSchoolStudent: true,
          chaperoneFirstName: true,
          chaperoneLastName: true,
          chaperoneEmail: true,
          chaperonePhoneNumber: true,
        },
      },
    },
  });

  // If the user doesn't exist, create a failed scan and return an error
  if (!user) {
    await prisma.scan.create({
      data: {
        userId: scannedCode, // May fail if user doesn't exist, adjust schema if necessary
        adminId: admin.id,
        eventId: eventId,
        successful: false,
      },
    });
    return {
      success: false,
      message: "Invalid QR code. No matching user found.",
    };
  }

  // Check if the user has already checked in for this event
  const existingCheckin = await prisma.checkin.findFirst({
    where: { userId: scannedCode, eventId },
  });

  // If the user has already checked in, create a failed scan and return an error
  if (existingCheckin) {
    await prisma.scan.create({
      data: {
        userId: user.id,
        adminId: admin.id,
        eventId: eventId,
        successful: false,
      },
    });
    return {
      success: false,
      message: "User has already checked in.",
    };
  }

  // If the user exists and hasn't checked in, proceed to create a check-in and a successful scan
  await prisma.$transaction([
    prisma.checkin.create({
      data: {
        userId: user.id,
        adminId: admin.id,
        eventId: eventId,
      },
    }),
    prisma.scan.create({
      data: {
        userId: user.id,
        adminId: admin.id,
        eventId: eventId,
        successful: true,
      },
    }),
  ]);

  // Build the response with user details
  const fullName = user.ParticipantInfo
    ? `${user.ParticipantInfo.firstName} ${user.ParticipantInfo.lastName}`
    : "Participant";

  const isHighSchoolStudent =
    user.ParticipantInfo?.isHighSchoolStudent || false;
  const chaperoneInfo = isHighSchoolStudent
    ? {
        chaperoneName: `${user.ParticipantInfo?.chaperoneFirstName || ""} ${
          user.ParticipantInfo?.chaperoneLastName || ""
        }`.trim(),
        chaperoneEmail: user.ParticipantInfo?.chaperoneEmail || "N/A",
        chaperonePhone: user.ParticipantInfo?.chaperonePhoneNumber || "N/A",
      }
    : undefined;

  return {
    success: true,
    id: user.id,
    name: fullName,
    message: "User successfully checked in.",
    isHighSchoolStudent,
    chaperoneInfo,
  };
}

export async function fetchScanHistory() {
  const history = await prisma.scan.findMany({
    include: {
      user: {
        include: {
          ParticipantInfo: true, // Include ParticipantInfo to access firstName and lastName
        },
      },
      event: true, // Include event details
    },
    orderBy: { createdAt: "desc" }, // Order by most recent
  });

  return history.map((scan) => ({
    id: scan.id,
    name:
      scan.user.ParticipantInfo?.firstName &&
      scan.user.ParticipantInfo?.lastName
        ? `${scan.user.ParticipantInfo.firstName} ${scan.user.ParticipantInfo.lastName}`
        : scan.user.name || "Unknown User", // Ensure `name` is always a string
    eventName: scan.event.name, // Include event name
    successful: scan.successful, // Whether the scan was successful
    timestamp: scan.createdAt.toISOString(), // Ensure the timestamp is in ISO string format
  }));
}
