"use server";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import type {
  User,
  TravelReimbursement,
  ReimbursementGroup,
  ReimbursementGroupMember,
  ParticipantInfo, // <-- Import the ParticipantInfo type
} from "@prisma/client";

/**
 * User object including necessary relations.
 */
export type UserWithReimbursement = User & {
  /**
   * Because you include `ParticipantInfo: true` in your Prisma query,
   * we must explicitly add it to this extended type.
   */
  ParticipantInfo?: ParticipantInfo | null;

  travelReimbursement?: TravelReimbursement & {
    reimbursementGroup?: ReimbursementGroup & {
      members: (ReimbursementGroupMember & {
        user: {
          id: string;
          email: string;
          /**
           * Each user in the group can also have ParticipantInfo
           */
          ParticipantInfo?: { firstName: string; lastName: string } | null;
        };
      })[];
    };
  };
  reimbursementGroupMemberships: (ReimbursementGroupMember & {
    group: ReimbursementGroup & {
      creator: { id: string; email: string };
      members: (ReimbursementGroupMember & {
        user: {
          id: string;
          email: string;
          ParticipantInfo?: { firstName: string; lastName: string } | null;
        };
      })[];
      reimbursement?: TravelReimbursement | null;
    };
  })[];
};

/**
 * Checks if the user has ANY valid reimbursement:
 * - Solo (travelReimbursement directly on user)
 * - OR is in a group that has a reimbursement, and their membership is ACCEPTED.
 */
export async function userHasReimbursement(
  user: UserWithReimbursement
): Promise<boolean> {
  if (user.travelReimbursement) return true;

  return user.reimbursementGroupMemberships.some(
    (membership) =>
      membership.status === "ACCEPTED" &&
      membership.group?.reimbursement !== null
  );
}

/**
 * Returns the reimbursement submission date if available:
 * - If solo, return the user's travelReimbursement date.
 * - If group, return the group's reimbursement date.
 * - Otherwise, return null.
 */
export async function getReimbursementDate(
  user: UserWithReimbursement
): Promise<Date | null> {
  if (user.travelReimbursement) {
    return user.travelReimbursement.createdAt;
  }

  const acceptedMembershipWithReimb = user.reimbursementGroupMemberships.find(
    (membership) =>
      membership.status === "ACCEPTED" &&
      membership.group?.reimbursement !== null
  );

  return acceptedMembershipWithReimb?.group.reimbursement?.createdAt ?? null;
}

/**
 * Fetches the user and includes reimbursement details.
 */
export async function getUserWithReimbursement(): Promise<UserWithReimbursement> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      // Because we include ParticipantInfo, we must reflect that in our type
      ParticipantInfo: true,
      travelReimbursement: {
        include: {
          reimbursementGroup: {
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      ParticipantInfo: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      reimbursementGroupMemberships: {
        include: {
          group: {
            include: {
              creator: {
                select: { id: true, email: true },
              },
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      ParticipantInfo: true,
                    },
                  },
                },
              },
              reimbursement: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Cast `user` as our extended type
  return user as UserWithReimbursement;
}

/**
 * Get the user's reimbursement summary.
 * Returns:
 * - Whether they have a reimbursement (`hasReimbursement`).
 * - The date it was submitted (`reimbursementDate`).
 * - Whether they are a leader (`isGroupLeader`) of a group.
 * - Any pending invitations (`pendingInvites`).
 */
export async function getUserReimbursementStatus() {
  const user = await getUserWithReimbursement();

  const hasReimbursement = userHasReimbursement(user);
  const reimbursementDate = getReimbursementDate(user);

  const isGroupLeader =
    user.travelReimbursement?.reimbursementGroup?.creatorId === user.id;

  const pendingInvites = user.reimbursementGroupMemberships.filter(
    (m) => m.status === "PENDING"
  );

  return {
    user,
    hasReimbursement,
    reimbursementDate,
    isGroupLeader,
    pendingInvites,
  };
}
