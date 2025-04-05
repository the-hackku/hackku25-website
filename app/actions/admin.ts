"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin, isAdminOrVolunteer } from "@/middlewares/isAdmin";
import {
  Checkin,
  EventType,
  ParticipantInfo,
  Prisma,
  TravelReimbursement,
  User,
} from "@prisma/client";
import { batchBackupRegistration } from "@/scripts/googleSheetsExport";

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
// app/actions/admin.ts
export async function getUsers(
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = ""
) {
  await isAdmin();

  const skip = (page - 1) * pageSize;

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: searchQuery, mode: "insensitive" } },
        {
          ParticipantInfo: {
            OR: [
              { firstName: { contains: searchQuery, mode: "insensitive" } },
              { lastName: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
        },
      ],
    },
    include: {
      ParticipantInfo: true,
      _count: {
        select: { checkinsAsUser: true },
      },
    },
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  const totalUsers = await prisma.user.count({
    where: {
      OR: [
        { email: { contains: searchQuery, mode: "insensitive" } },
        { name: { contains: searchQuery, mode: "insensitive" } },
        {
          ParticipantInfo: {
            OR: [
              { firstName: { contains: searchQuery, mode: "insensitive" } },
              { lastName: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
        },
      ],
    },
  });

  return { users, totalUsers };
}

// Fetch all check-ins and return user names, event names, and check-in time
export async function getCheckins(
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = ""
) {
  await isAdmin();

  const skip = (page - 1) * pageSize;

  const checkins = await prisma.checkin.findMany({
    include: {
      user: {
        include: {
          ParticipantInfo: true,
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
    orderBy: { createdAt: "desc" },
  });

  const totalCheckins = await prisma.checkin.count({
    where: {
      OR: [
        { user: { name: { contains: searchQuery, mode: "insensitive" } } },
        { user: { email: { contains: searchQuery, mode: "insensitive" } } },
        { event: { name: { contains: searchQuery, mode: "insensitive" } } },
      ],
    },
  });

  const transformedCheckins = checkins.map((checkin) => ({
    id: checkin.id,
    userId: checkin.userId,
    eventId: checkin.eventId,
    createdAt: checkin.createdAt,
    user: {
      name: checkin.user.name,
      email: checkin.user.email,
      participantInfo: checkin.user.ParticipantInfo
        ? {
            firstName: checkin.user.ParticipantInfo.firstName,
            lastName: checkin.user.ParticipantInfo.lastName,
          }
        : null,
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
  // Ensure the user is an admin or volunteer
  const session = await isAdminOrVolunteer();

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

  /*************************************************************
   *   IF NO USER, JUST RETURN A FAILURE (NO 'Scan' INSERT).   *
   *************************************************************/
  if (!user) {
    // We skip prisma.scan.create({ userId: scannedCode, ... })
    // because that would reference a non-existent user and violate FK constraints.
    return {
      success: false,
      message: "Invalid QR code. No matching user found.",
    };
  }

  // Check if the user has already checked in for this event
  const existingCheckin = await prisma.checkin.findFirst({
    where: { userId: user.id, eventId },
  });

  if (existingCheckin) {
    // Create a 'failed' Scan record if you still want to log the attempt with the real user.id
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

  // If user exists and hasn't checked in, create a check-in + successful scan
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

  const fullName = user.ParticipantInfo
    ? `${user.ParticipantInfo.firstName} ${user.ParticipantInfo.lastName}`
    : "Participant";

  const isHighSchoolStudent = !!user.ParticipantInfo?.isHighSchoolStudent;
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

// app/actions/admin.ts

/**
 * Manually check in a user by userId and eventId.
 */
export async function manualCheckIn(
  userId: string,
  eventId: string
): Promise<{
  success: boolean;
  message: string;
  isHighSchoolStudent?: boolean;
  name?: string;
  chaperoneInfo?: {
    chaperoneName: string;
    chaperoneEmail: string;
    chaperonePhone: string;
  };
}> {
  // Ensure the user performing this action is either admin or volunteer
  const session = await isAdminOrVolunteer();

  // Find the admin user (the staff or volunteer performing the check)
  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!admin) {
    return {
      success: false,
      message: "Admin/Volunteer not found.",
    };
  }

  // Fetch the user by userId
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

  if (!user) {
    // Could optionally create a failed 'scan' record or 'manualCheckIn' record
    return {
      success: false,
      message: "No matching user found for the given userId.",
    };
  }

  // Check if the user is already checked in for this event
  const existingCheckin = await prisma.checkin.findFirst({
    where: { userId: user.id, eventId },
  });

  if (existingCheckin) {
    return {
      success: false,
      message: "User has already been checked in for this event.",
    };
  }

  // If not checked in yet, proceed with a check-in
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

  const fullName = user.ParticipantInfo
    ? `${user.ParticipantInfo.firstName} ${user.ParticipantInfo.lastName}`.trim()
    : "Participant";

  const isHighSchoolStudent =
    user.ParticipantInfo?.isHighSchoolStudent || false;

  let chaperoneInfo;
  if (isHighSchoolStudent) {
    chaperoneInfo = {
      chaperoneName: `${user.ParticipantInfo?.chaperoneFirstName ?? ""} ${
        user.ParticipantInfo?.chaperoneLastName ?? ""
      }`.trim(),
      chaperoneEmail: user.ParticipantInfo?.chaperoneEmail ?? "N/A",
      chaperonePhone: user.ParticipantInfo?.chaperonePhoneNumber ?? "N/A",
    };
  }

  return {
    success: true,
    message: `Successfully checked in ${fullName}`,
    name: fullName,
    isHighSchoolStudent,
    chaperoneInfo,
  };
}

export async function fetchScanHistory() {
  isAdmin(); // Ensure only admins can access
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

// app/actions/admin.ts
export async function getEventById(eventId: string) {
  isAdmin(); // Ensure only admins can access
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
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

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    throw new Error("Failed to fetch event details");
  }
}

export async function getUserById(userId: string) {
  isAdmin(); // Ensure only admins can access
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ParticipantInfo: true,
        checkinsAsUser: {
          include: {
            event: true,
          },
          orderBy: { createdAt: "desc" },
        },
        travelReimbursement: true, // Include reimbursements
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user details");
  }
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

export async function getReimbursements(
  page: number = 1,
  pageSize: number = 20,
  searchQuery: string = ""
) {
  await isAdmin();

  const skip = (page - 1) * pageSize;

  const reimbursements = await prisma.travelReimbursement.findMany({
    where: {
      OR: [
        {
          transportationMethod: { contains: searchQuery, mode: "insensitive" },
        },
        { address: { contains: searchQuery, mode: "insensitive" } },
        {
          creator: {
            ParticipantInfo: {
              OR: [
                { firstName: { contains: searchQuery, mode: "insensitive" } },
                { lastName: { contains: searchQuery, mode: "insensitive" } },
              ],
            },
          },
        },
      ],
    },
    include: {
      creator: {
        include: {
          ParticipantInfo: true,
        },
      },
      invites: {
        include: {
          user: {
            select: { email: true, travelReimbursementId: true },
          },
        },
      },
    },
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  const totalReimbursements = await prisma.travelReimbursement.count({
    where: {
      OR: [
        {
          transportationMethod: { contains: searchQuery, mode: "insensitive" },
        },
        { address: { contains: searchQuery, mode: "insensitive" } },
        {
          creator: {
            ParticipantInfo: {
              OR: [
                { firstName: { contains: searchQuery, mode: "insensitive" } },
                { lastName: { contains: searchQuery, mode: "insensitive" } },
              ],
            },
          },
        },
      ],
    },
  });

  return { reimbursements, totalReimbursements };
}

export async function batchUpdateReimbursements(
  changes: Record<string, Partial<TravelReimbursement>>
) {
  await isAdmin();

  const updatePromises = Object.entries(changes).map(
    ([reimbursementId, fields]) =>
      prisma.travelReimbursement.update({
        where: { id: reimbursementId },
        data: fields,
      })
  );

  const updatedReimbursements = await prisma.$transaction(updatePromises);
  return updatedReimbursements;
}

export async function backupRegistrationScript() {
  isAdmin();
  try {
    await batchBackupRegistration();
    return { success: true, message: "Backup completed successfully!" };
  } catch (error) {
    console.error("Backup failed:", error);
    return { success: false, message: "Backup failed!" };
  }
}

export async function getTotalRegistrationNumber() {
  isAdmin();
  const totalRegistrations = await prisma.participantInfo.count();
  return totalRegistrations;
}
export async function getHackathonCheckinCount(eventId: string) {
  await isAdmin();

  const count = await prisma.checkin.count({
    where: { eventId },
  });

  return count;
}

export async function searchUsers(searchQuery: string) {
  await isAdminOrVolunteer();
  const trimmed = searchQuery.trim();

  // Basic conditions for email and individual name fields.
  const conditions: Prisma.UserWhereInput[] = [
    { email: { contains: trimmed, mode: "insensitive" } },
    {
      ParticipantInfo: {
        firstName: { contains: trimmed, mode: "insensitive" },
      },
    },
    {
      ParticipantInfo: { lastName: { contains: trimmed, mode: "insensitive" } },
    },
  ];

  // If query contains a space, assume it's "firstName lastName" and add an AND condition.
  if (trimmed.includes(" ")) {
    const [first, last] = trimmed.split(" ", 2);
    conditions.push({
      ParticipantInfo: {
        AND: [
          { firstName: { contains: first, mode: "insensitive" } },
          { lastName: { contains: last, mode: "insensitive" } },
        ],
      },
    });
  }

  const users = await prisma.user.findMany({
    where: { OR: conditions },
    include: { ParticipantInfo: true },
    take: 50,
  });

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    firstName: user.ParticipantInfo?.firstName ?? "",
    lastName: user.ParticipantInfo?.lastName ?? "",
  }));
}
