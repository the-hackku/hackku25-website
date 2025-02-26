"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { exportReimbursementToGoogleSheet } from "@/scripts/googleSheetsExport";

const prisma = new PrismaClient();

/**
 * Fetch users by email for group leader to add members.
 */
/**
 * Fetch users by email for group leader to add members.
 * Only returns users who have completed registration (have ParticipantInfo).
 */
export async function searchUsersByEmail(emailQuery: string) {
  if (!emailQuery) return [];

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email; // Current user's email

  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: emailQuery,
        mode: "insensitive",
        not: userEmail, // Exclude the current user from search results
      },
      ParticipantInfo: {
        isNot: null, // Ensure the user has completed registration
      },
    },
    include: {
      ParticipantInfo: true, // Include participant details
    },
    take: 10, // Limit results
  });

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    name: `${user.ParticipantInfo?.firstName ?? ""} ${
      user.ParticipantInfo?.lastName ?? ""
    }`,
    school: user.ParticipantInfo?.currentSchool ?? "Unknown",
  }));
}

/**
 * Submit a travel reimbursement request.
 * If applying as a group, only the group leader submits the request.
 */
export async function submitTravelReimbursement({
  transportationMethod,
  address,
  distance,
  estimatedCost,
  reason,
  groupMemberEmails,
  isGroup,
}: {
  transportationMethod: string;
  address: string;
  distance: number;
  estimatedCost: number;
  reason: string;
  groupMemberEmails?: string[];
  isGroup: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!isGroup) {
    // 🚀 **Solo Application**
    const reimbursement = await prisma.travelReimbursement.create({
      data: {
        userId: user.id,
        transportationMethod,
        address,
        distance,
        estimatedCost,
        reason,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { travelReimbursementId: reimbursement.id },
    });

    await exportReimbursementToGoogleSheet(reimbursement);

    return { success: true, reimbursement };
  } else {
    // 🚀 **Group Application**
    if (!groupMemberEmails || groupMemberEmails.length === 0) {
      throw new Error("At least one group member must be added.");
    }
    if (groupMemberEmails.length > 10) {
      throw new Error("A group can have a maximum of 10 members.");
    }

    // **Ensure users are not already linked to a reimbursement**
    const existingMembers = await prisma.user.findMany({
      where: {
        email: { in: [...groupMemberEmails, user.email] },
        travelReimbursementId: { not: null },
      },
    });

    if (existingMembers.length > 0) {
      throw new Error(
        `Some users already have a travel reimbursement assigned.`
      );
    }

    return await prisma.$transaction(async (prisma) => {
      // **Create the reimbursement entry for the group**
      const reimbursement = await prisma.travelReimbursement.create({
        data: {
          userId: user.id, // **Group leader**
          transportationMethod,
          address,
          distance,
          estimatedCost,
          reason,
        },
      });

      // **Assign the leader to this reimbursement immediately**
      await prisma.user.update({
        where: { id: user.id },
        data: { travelReimbursementId: reimbursement.id },
      });

      // **Fetch invited members**
      const members = await prisma.user.findMany({
        where: {
          email: { in: groupMemberEmails },
        },
      });

      // **Create invites for members**
      const invites = members.map((member) => ({
        userId: member.id,
        reimbursementId: reimbursement.id,
      }));

      await prisma.reimbursementInvite.createMany({ data: invites });

      await exportReimbursementToGoogleSheet(reimbursement);

      return { success: true, reimbursement };
    });
  }
}

/**
 * Handle group invitation responses (ACCEPT or DECLINE).
 */
export async function handleGroupInvite(
  reimbursementId: string,
  accept: boolean
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("User not authenticated");
  }

  return await prisma.$transaction(async (prisma) => {
    // Fetch user inside the transaction to prevent stale reads
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, travelReimbursementId: true },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // Fetch the invite within the transaction
    const invite = await prisma.reimbursementInvite.findFirst({
      where: {
        userId: user.id,
        reimbursementId,
        status: "PENDING",
      },
    });

    if (!invite) {
      throw new Error("No pending invite found for this reimbursement.");
    }

    if (accept) {
      // Re-check the latest state of travelReimbursementId to prevent conflicts
      if (
        user.travelReimbursementId &&
        user.travelReimbursementId !== reimbursementId
      ) {
        throw new Error(
          "You are already part of another travel reimbursement. Leave that one first."
        );
      }

      // Assign the reimbursement **only if still null** (after fresh fetch)
      if (!user.travelReimbursementId) {
        await prisma.user.update({
          where: { id: user.id, travelReimbursementId: undefined }, // Ensure idempotency
          data: { travelReimbursementId: reimbursementId },
        });
      }
    }

    // Update invite status
    await prisma.reimbursementInvite.update({
      where: { id: invite.id },
      data: { status: accept ? "ACCEPTED" : "DECLINED" },
    });

    return { success: true, status: accept ? "ACCEPTED" : "DECLINED" };
  });
}

export async function updateTravelReimbursement({
  reimbursementId,
  transportationMethod,
  address,
  distance,
  estimatedCost,
  reason,
}: {
  reimbursementId: string;
  transportationMethod: string;
  address: string;
  distance: number;
  estimatedCost: number;
  reason: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  // **Ensure user is the creator of the reimbursement**
  const reimbursement = await prisma.travelReimbursement.findUnique({
    where: { id: reimbursementId },
  });

  if (!reimbursement || reimbursement.userId !== user.id) {
    throw new Error("You do not have permission to edit this reimbursement.");
  }

  // **Perform the update**
  const updated = await prisma.travelReimbursement.update({
    where: { id: reimbursementId },
    data: {
      transportationMethod,
      address,
      distance,
      estimatedCost,
      reason,
    },
  });

  return { success: true, reimbursement: updated };
}

export async function getReimbursementDetails() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      travelReimbursement: true,
    },
  });

  if (!user?.travelReimbursement) {
    return null;
  }

  return user.travelReimbursement;
}
