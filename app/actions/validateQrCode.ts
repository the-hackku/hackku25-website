"use server";

import { prisma } from "@/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authoptions";

export async function validateQrCode(scannedCode: string, eventId: string) {
  // Fetch the user's session
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "You are not authorized to perform this action.",
    };
  }

  // Fetch the adminId by looking up the user based on their email in the session
  const admin = await prisma.user.findUnique({
    where: {
      email: session.user.email, // Use the email from the session
    },
    select: {
      id: true, // Only select the id field
    },
  });

  if (!admin) {
    return {
      success: false,
      message: "Admin not found.",
    };
  }

  const adminId = admin.id; // Now we have the adminId

  // First, attempt to find the user by the scanned code
  const user = await prisma.user.findUnique({
    where: {
      id: scannedCode,
    },
    select: {
      email: true,
    },
  });

  // If no user is found, return an error and do not create a scan record
  if (!user) {
    return {
      success: false,
      message: "Invalid QR code. No matching user found.",
    };
  }

  // Check if the user has already checked in for this event
  const checkinExists = await prisma.checkin.findFirst({
    where: {
      userId: scannedCode,
      eventId,
    },
  });

  let scanSuccess = false;
  let message = "User has already checked in."; // Default message

  if (!checkinExists) {
    // If check-in doesn't exist, create a new check-in record
    await prisma.checkin.create({
      data: {
        user: {
          connect: { id: scannedCode }, // Connect existing user
        },
        admin: {
          connect: { id: adminId }, // Connect the admin performing the check-in
        },
        event: {
          connect: { id: eventId }, // Connect the event
        },
      },
    });

    scanSuccess = true; // Mark scan as successful if check-in succeeds
    message = "User successfully checked in."; // Success message
  }

  // Create a scan record, marking it successful only if check-in was successful
  await prisma.scan.create({
    data: {
      user: {
        connect: { id: scannedCode }, // Connect existing user
      },
      admin: {
        connect: { id: adminId }, // Connect the admin performing the scan
      },
      event: {
        connect: { id: eventId }, // Connect the event
      },
      successful: scanSuccess, // Mark scan as successful based on check-in result
    },
  });

  return {
    success: scanSuccess,
    email: scanSuccess ? user.email : null,
    message,
  };
}
