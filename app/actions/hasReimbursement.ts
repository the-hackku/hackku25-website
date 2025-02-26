"use server";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import type {
  User,
  TravelReimbursement,
  ReimbursementInvite,
  ParticipantInfo,
} from "@prisma/client";

/**
 * User object including necessary relations.
 */
export type UserWithReimbursement = User & {
  ParticipantInfo?: ParticipantInfo | null;
  travelReimbursement?:
    | (TravelReimbursement & {
        creator?: { email: string } | null; // ✅ Ensure `creator` is included
      })
    | null;
  reimbursementInvites: (ReimbursementInvite & {
    reimbursement: {
      id: string;
      userId: string;
      creator?: { email: string } | null;
    };
  })[];
  createdReimbursement:
    | (TravelReimbursement & {
        invites: (ReimbursementInvite & {
          user: {
            email: string;
            ParticipantInfo?: { firstName: string; lastName: string } | null;
          };
        })[];
      })
    | null;
};

/**
 * Checks if the user has a valid reimbursement:
 * - Solo reimbursement (user.travelReimbursement)
 * - OR has accepted an invite to a group reimbursement.
 */
export async function userHasReimbursement(
  user: UserWithReimbursement | null
): Promise<boolean> {
  return !!user?.travelReimbursement;
}

/**
 * Fetches the user and includes reimbursement details.
 */
export async function getUserWithReimbursement(): Promise<UserWithReimbursement | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      ParticipantInfo: true,
      travelReimbursement: {
        include: {
          creator: {
            select: { email: true }, // ✅ Fetch the creator's email
          },
        },
      },
      createdReimbursement: {
        // Ensure we fetch the reimbursement the user created
        include: {
          invites: {
            include: {
              user: {
                select: {
                  email: true,
                  ParticipantInfo: {
                    select: { firstName: true, lastName: true },
                  },
                },
              },
            },
          },
        },
      },
      reimbursementInvites: {
        include: {
          reimbursement: {
            select: {
              id: true, // ✅ Ensure we fetch the reimbursement ID
              userId: true, // ✅ Fetch the creator's user ID
              creator: {
                select: { email: true }, // ✅ Fetch the creator's email
              },
            },
          },
        },
      },
    },
  });

  return user;
}

/**
 * Fetch the reimbursement details for the logged-in user.
 */
export async function getReimbursementDetails(): Promise<TravelReimbursement | null> {
  const user = await getUserWithReimbursement();
  if (!user?.travelReimbursement) {
    return null;
  }

  return user.travelReimbursement;
}

/**
 * Get the user's reimbursement summary.
 */
export async function getUserReimbursementStatus() {
  const user = await getUserWithReimbursement();

  // ✅ Handle null user case before calling `userHasReimbursement`
  if (!user) {
    return {
      user: null,
      hasReimbursement: false,
      reimbursementDate: null,
      isGroupLeader: false,
      pendingInvites: [],
    };
  }

  const hasReimbursement = await userHasReimbursement(user);
  const reimbursementDate = user.travelReimbursement?.createdAt ?? null;
  const isGroupLeader = user.travelReimbursement?.userId == user.id;
  const pendingInvites = user.reimbursementInvites.filter(
    (invite) => invite.status === "PENDING"
  );

  return {
    user,
    hasReimbursement,
    reimbursementDate,
    isGroupLeader,
    pendingInvites,
  };
}
