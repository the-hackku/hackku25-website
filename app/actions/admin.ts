"use server";

import { prisma } from "@/prisma";
import { isAdmin } from "@/middlewares/isAdmin";
import { Checkin, EventType, User } from "@prisma/client";
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
export async function getUsers(
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = ""
) {
  await isAdmin(); // Ensure only admins can access

  const skip = (page - 1) * pageSize;

  // Fetch filtered users with pagination
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: searchQuery, mode: "insensitive" } },
        { name: { contains: searchQuery, mode: "insensitive" } },
      ],
    },
    include: {
      ParticipantInfo: true,
    },
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" }, // Order by latest users
  });

  // Get total count for pagination
  const totalUsers = await prisma.user.count({
    where: {
      OR: [
        { email: { contains: searchQuery, mode: "insensitive" } },
        { name: { contains: searchQuery, mode: "insensitive" } },
      ],
    },
  });

  return { users, totalUsers };
}

// Fetch all check-ins and return user names, event names, and check-in time
export async function getCheckins(
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = ""
) {
  await isAdmin(); // Ensure only admins can access

  const skip = (page - 1) * pageSize;

  // Fetch filtered check-ins with pagination
  const checkins = await prisma.checkin.findMany({
    include: {
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
    },
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" }, // Order by latest check-ins
  });

  // Get total count for pagination
  const totalCheckins = await prisma.checkin.count({
    where: {
      OR: [
        { user: { name: { contains: searchQuery, mode: "insensitive" } } },
        { user: { email: { contains: searchQuery, mode: "insensitive" } } },
        { event: { name: { contains: searchQuery, mode: "insensitive" } } },
      ],
    },
  });

  // Transform the data to match the Checkin interface
  const transformedCheckins = checkins.map((checkin) => ({
    id: checkin.id,
    userId: checkin.userId,
    eventId: checkin.eventId,
    createdAt: checkin.createdAt,
    user: {
      name: checkin.user.name,
      email: checkin.user.email,
    },
    event: {
      name: checkin.event.name,
    },
  }));

  return { checkins: transformedCheckins, totalCheckins };
}

/**
 * Batch update check-ins
 */
export async function batchUpdateCheckins(
  changes: Record<string, Partial<Checkin>>
) {
  await isAdmin(); // Ensure only admins can access

  const updatePromises = Object.entries(changes).map(([checkinId, fields]) =>
    prisma.checkin.update({
      where: { id: checkinId },
      data: fields,
    })
  );

  const updatedCheckins = await prisma.$transaction(updatePromises);
  return updatedCheckins;
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
      eventType: data.eventType,
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

// Update user field
export async function updateUserField(
  userId: string,
  field: string,
  value: unknown
) {
  await isAdmin(); // Ensure only admins can access
  await prisma.user.update({
    where: { id: userId },
    data: { [field]: value },
  });
}

// Update participant field
export async function updateParticipantField(
  participantId: string,
  field: string,
  value: unknown
) {
  await isAdmin(); // Ensure only admins can access
  await prisma.participantInfo.update({
    where: { id: participantId },
    data: { [field]: value },
  });
}

export async function batchUpdateUsers(changes: Record<string, Partial<User>>) {
  await isAdmin(); // Ensure only admins can access

  const updatePromises = Object.entries(changes).map(([userId, fields]) =>
    prisma.user.update({
      where: { id: userId },
      data: fields,
    })
  );

  const updatedUsers = await prisma.$transaction(updatePromises);
  return updatedUsers;
}

// Batch update participant info
export async function batchUpdateParticipants(
  changes: Record<string, Partial<ParticipantInfo>>
) {
  await isAdmin(); // Ensure only admins can access

  const updatePromises = Object.entries(changes).map(
    ([participantId, fields]) =>
      prisma.participantInfo.update({
        where: { id: participantId },
        data: fields,
      })
  );

  await prisma.$transaction(updatePromises);
}
