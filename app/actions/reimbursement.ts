"use server";

import { PrismaClient, ReimbursementGroupStatus } from "@prisma/client";
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
  // Authenticate the user.
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
    // SOLO APPLICATION
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

    await exportReimbursementToGoogleSheet(reimbursement);

    return { success: true, reimbursement };
  } else {
    // GROUP APPLICATION - LEADER CREATES GROUP
    if (!groupMemberEmails || groupMemberEmails.length === 0) {
      throw new Error("At least one group member must be added.");
    }
    if (groupMemberEmails.length > 10) {
      throw new Error("A group can have a maximum of 10 members.");
    }

    // Ensure users are not in another reimbursement group
    const existingMembers = await prisma.user.findMany({
      where: {
        email: { in: [...groupMemberEmails, user.email] },
        reimbursementGroupMemberships: {
          some: { status: ReimbursementGroupStatus.ACCEPTED },
        },
      },
    });

    if (existingMembers.length > 0) {
      throw new Error(
        `Some users are already in an accepted reimbursement group.`
      );
    }

    return await prisma.$transaction(async (prisma) => {
      // Create Reimbursement Group
      const group = await prisma.reimbursementGroup.create({
        data: {
          creatorId: user.id,
        },
      });

      // Fetch invited members
      const members = await prisma.user.findMany({
        where: {
          email: { in: groupMemberEmails },
        },
      });

      // Prepare all members including the leader
      const allMembers = [
        ...members.map((member) => ({
          userId: member.id,
          reimbursementGroupId: group.id,
          status: ReimbursementGroupStatus.PENDING, // Members must accept invite
        })),
        {
          userId: user.id, // Add the leader
          reimbursementGroupId: group.id,
          status: ReimbursementGroupStatus.ACCEPTED, // Leader automatically accepts
        },
      ];

      // Add all members to the reimbursement group
      await prisma.reimbursementGroupMember.createMany({
        data: allMembers,
      });

      // Fetch the group again to ensure members exist before exporting
      const fullGroup = await prisma.reimbursementGroup.findUnique({
        where: { id: group.id },
        include: {
          members: {
            include: {
              user: {
                select: { email: true },
              },
            },
          },
        },
      });

      // Create the reimbursement request for the group
      const reimbursement = await prisma.travelReimbursement.create({
        data: {
          reimbursementGroupId: group.id,
          transportationMethod,
          address,
          distance,
          estimatedCost,
          reason,
        },
      });

      // ✅ Pass full group object to ensure members are included
      await exportReimbursementToGoogleSheet({ ...reimbursement, fullGroup });

      return { success: true, reimbursement, groupId: group.id };
    });
  }
}

/**
 * Handle group invitation responses (ACCEPT or DECLINE).
 */
export async function handleGroupInvite(groupId: string, accept: boolean) {
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

  const membership = await prisma.reimbursementGroupMember.findFirst({
    where: {
      userId: user.id,
      reimbursementGroupId: groupId,
    },
  });

  if (!membership) {
    throw new Error("No pending invite found.");
  }

  await prisma.reimbursementGroupMember.update({
    where: { id: membership.id },
    data: {
      status: accept
        ? ReimbursementGroupStatus.ACCEPTED
        : ReimbursementGroupStatus.DECLINED,
    },
  });

  return { success: true, status: accept ? "ACCEPTED" : "DECLINED" };
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
  // 1. Authenticate user
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // 2. Fetch the reimbursement
  const reimbursement = await prisma.travelReimbursement.findUnique({
    where: { id: reimbursementId },
    include: {
      reimbursementGroup: {
        select: { creatorId: true },
      },
      user: {
        select: { email: true, id: true },
      },
    },
  });
  if (!reimbursement) {
    throw new Error("Reimbursement not found");
  }

  // 3. Ensure user can edit
  //    For a solo request, the user must match reimbursement.userId
  //    For a group request, the user must match reimbursementGroup.creatorId
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const isSolo = !!reimbursement.userId;
  const isGroup = !!reimbursement.reimbursementGroupId;

  let canEdit = false;
  if (isSolo && reimbursement.userId === user.id) {
    canEdit = true;
  } else if (
    isGroup &&
    reimbursement.reimbursementGroup?.creatorId === user.id
  ) {
    // Only group leader can edit
    canEdit = true;
  }
  if (!canEdit) {
    throw new Error("You do not have permission to edit this reimbursement.");
  }

  // 4. Perform the update
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
