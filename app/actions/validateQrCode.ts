"use server";

import { prisma } from "@/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authoptions";

export async function validateQrCode(scannedCode: string, eventId: string) {
  const session = await getServerSession(authOptions);

  // Verify that the user is an admin
  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "You are not authorized to perform this action.",
    };
  }

  // Fetch admin and user (with ParticipantInfo) in a single transaction
  const [admin, user] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    }),
    prisma.user.findUnique({
      where: { id: scannedCode },
      select: {
        id: true,
        email: true,
        ParticipantInfo: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  if (!admin) {
    return {
      success: false,
      message: "Admin not found.",
    };
  }

  if (!user) {
    return {
      success: false,
      message: "Invalid QR code. No matching user found.",
    };
  }

  // Check if a check-in already exists for the user and event
  const existingCheckin = await prisma.checkin.findFirst({
    where: { userId: scannedCode, eventId },
    include: { Scan: true }, // Include the Scan to check the association
  });

  if (existingCheckin) {
    // Create a new failed scan (not linked to the existing check-in)
    await prisma.scan.create({
      data: {
        user: { connect: { id: scannedCode } },
        admin: { connect: { id: admin.id } },
        event: { connect: { id: eventId } },
        successful: false, // Mark this scan as failed
      },
    });

    const fullName = user.ParticipantInfo
      ? `${user.ParticipantInfo.firstName} ${user.ParticipantInfo.lastName}`
      : "Participant";

    return {
      success: false,
      name: fullName,
      message: "User has already checked in.",
    };
  }

  // Create a new check-in and associate it with a successful scan
  await prisma.checkin.create({
    data: {
      user: { connect: { id: scannedCode } },
      admin: { connect: { id: admin.id } },
      event: { connect: { id: eventId } },
      Scan: {
        create: {
          user: { connect: { id: scannedCode } },
          admin: { connect: { id: admin.id } },
          event: { connect: { id: eventId } },
          successful: true, // Mark this scan as successful
        },
      },
    },
    include: { Scan: true }, // Include the associated scan for confirmation
  });

  const fullName = user.ParticipantInfo
    ? `${user.ParticipantInfo.firstName} ${user.ParticipantInfo.lastName}`
    : "Participant";

  return {
    success: true,
    name: fullName,
    message: "User successfully checked in.",
  };
}
