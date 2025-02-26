"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleGroupInvite } from "@/app/actions/reimbursement";
import { getUserWithReimbursement } from "@/app/actions/hasReimbursement";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { IconLoader, IconCheck, IconX } from "@tabler/icons-react";

/**
 * ✅ Corrected Invite Type - Matches Server Response
 */
interface InviteMembership {
  id: string;
  reimbursementId: string;
  reimbursement: {
    id: string;
    creator?: {
      email: string;
    } | null;
  };
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

export default function InviteListPage() {
  const router = useRouter();
  const [invites, setInvites] = useState<InviteMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ Fetch Pending Group Invites
   */
  useEffect(() => {
    (async () => {
      try {
        const user = await getUserWithReimbursement();
        if (!user) {
          setError("User data could not be loaded.");
          setLoading(false);
          return;
        }

        // ✅ Map reimbursement invites to correct structure
        const pendingInvites: InviteMembership[] =
          user.reimbursementInvites
            ?.filter((invite) => invite.status === "PENDING")
            .map((invite) => ({
              id: invite.id,
              reimbursementId: invite.reimbursement.id,
              reimbursement: {
                id: invite.reimbursement.id,
                creator: invite.reimbursement.creator
                  ? { email: invite.reimbursement.creator.email }
                  : { email: "Unknown" }, // Handle missing creator safely
              },
              status: invite.status,
            })) || [];

        setInvites(pendingInvites);
      } catch (err) {
        console.error("Error fetching invites:", err);
        setError("Failed to fetch invites.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /**
   * ✅ Accept/Decline Group Invite
   */
  async function handleInviteResponse(
    reimbursementId: string,
    accept: boolean
  ) {
    setError(null);
    startTransition(async () => {
      try {
        await handleGroupInvite(reimbursementId, accept);

        // ✅ Refresh user data to update pending invites
        const updatedUser = await getUserWithReimbursement();
        if (!updatedUser) {
          setError("Failed to reload user data.");
          return;
        }

        const updatedInvites: InviteMembership[] =
          updatedUser.reimbursementInvites
            ?.filter((invite) => invite.status === "PENDING")
            .map((invite) => ({
              id: invite.id,
              reimbursementId: invite.reimbursement.id,
              reimbursement: {
                id: invite.reimbursement.id,
                creator: invite.reimbursement.creator
                  ? { email: invite.reimbursement.creator.email }
                  : { email: "Unknown" }, // Handle missing creator safely
              },
              status: invite.status,
            })) || [];

        setInvites(updatedInvites);
        router.push("/profile");
      } catch (err) {
        console.error("Failed to handle invite:", err);
        setError("Failed to process invite.");
      }
    });
  }

  if (loading) return <div className="p-4 text-center">Loading invites...</div>;
  if (error)
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error}
        <Link href="/profile" className="underline block mt-4">
          Return to Profile
        </Link>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Reimbursement Group Invites
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invites.length > 0 ? (
            invites.map((invite) => (
              <div key={invite.id} className="border p-3 rounded mb-4">
                <p>
                  Leader: {invite.reimbursement.creator?.email || "Unknown"}
                </p>
                <div className="flex gap-3 mt-2">
                  <button
                    disabled={isPending}
                    onClick={() =>
                      handleInviteResponse(invite.reimbursement.id, true)
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                  >
                    {isPending ? (
                      <IconLoader className="animate-spin" size={16} />
                    ) : (
                      <IconCheck size={16} />
                    )}
                    Accept
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() =>
                      handleInviteResponse(invite.reimbursement.id, false)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                  >
                    {isPending ? (
                      <IconLoader className="animate-spin" size={16} />
                    ) : (
                      <IconX size={16} />
                    )}
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No pending invites.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
