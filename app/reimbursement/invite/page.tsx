// app/reimbursement/invite/page.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleGroupInvite } from "@/app/actions/reimbursement";
import { getUserWithReimbursement } from "@/app/actions/hasReimbursement";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { IconLoader, IconCheck, IconX } from "@tabler/icons-react";

/**
 * The shape of each pending invite membership
 * (You can skip a dedicated type if you prefer `any` or do a broader approach.)
 */
interface InviteMembership {
  id: string;
  reimbursementGroupId: string;
  group: {
    id: string;
    creator: {
      email: string;
    };
  };
  status: string; // Add this line
}

export default function InviteListPage() {
  const router = useRouter();
  const [memberships, setMemberships] = useState<InviteMembership[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition(); // for button loading state
  const [error, setError] = useState<string | null>(null);

  // On mount, fetch user data & filter for pending invites
  useEffect(() => {
    (async () => {
      try {
        const user = await getUserWithReimbursement(); // server action or other approach
        // Filter the user's memberships to those with status="PENDING"
        const pending =
          user.reimbursementGroupMemberships?.filter(
            (m: InviteMembership) => m.status === "PENDING"
          ) ?? [];
        setMemberships(pending);
      } catch (err: unknown) {
        console.error("Error fetching invites:", err);
        setError("Failed to fetch invites");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Accept/Decline logic
  async function handleInviteResponse(groupId: string, accept: boolean) {
    setError(null);
    startTransition(async () => {
      try {
        await handleGroupInvite(groupId, accept);
        // Refresh data or redirect
        const updatedUser = await getUserWithReimbursement();
        const pending =
          updatedUser.reimbursementGroupMemberships?.filter(
            (m: InviteMembership) => m.status === "PENDING"
          ) ?? [];
        setMemberships(pending);
        router.push("/profile");
      } catch (err: unknown) {
        console.error("Failed to handle invite:", err);
        setError("Failed to process invite");
      }
    });
  }

  if (loading) {
    return <div className="p-4 text-center">Loading invites...</div>;
  }
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error}
        <Link href="/profile" className="underline block mt-4">
          Return to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>Reimbursement Group Invites</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {memberships && memberships.length > 0 ? (
            memberships.map((invite) => (
              <div key={invite.id} className="border p-3 rounded mb-4">
                <p>Leader: {invite.group.creator.email}</p>
                <div className="flex gap-3 mt-2">
                  <button
                    disabled={isPending}
                    onClick={() => handleInviteResponse(invite.group.id, true)}
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
                    onClick={() => handleInviteResponse(invite.group.id, false)}
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
