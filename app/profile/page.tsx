/* app/profile/page.tsx */
import { redirect } from "next/navigation";
import LocalDateTime from "@/components/localDateTime";
import QrCodeComponent from "@/components/UserQRCode";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  IconMail,
  IconUser,
  IconLogout,
  IconBraces,
  IconUserFilled,
  IconFileText,
  IconHistory,
  IconCheck,
  IconLock,
  IconExternalLink,
  IconEdit,
} from "@tabler/icons-react";

import { prisma } from "@/prisma";
import {
  getUserWithReimbursement,
  userHasReimbursement,
} from "@/app/actions/hasReimbursement";
import type { UserWithReimbursement } from "@/app/actions/hasReimbursement";

/**
 * Helper: can the user edit the existing reimbursement?
 */
function canEditReimbursement(user: UserWithReimbursement): boolean {
  // ✅ Solo reimbursement check
  if (user.travelReimbursement && user.travelReimbursement.userId === user.id) {
    return true;
  }
  // ✅ Group leader check (creator of reimbursement)
  if (user.createdReimbursement) {
    return true;
  }
  return false;
}

/**
 * Profile Page
 */
export default async function ProfilePage() {
  // 1. Load user with reimbursement
  const userSession = await getUserWithReimbursement().catch((err) => {
    console.error("Error fetching user with reimbursement:", err);
    redirect("/signin");
  });
  if (!userSession) redirect("/signin");

  // 2. Check if user has any reimbursement, and if they can edit
  const hasReimb = await userHasReimbursement(userSession);
  const canEdit = hasReimb && canEditReimbursement(userSession);

  // 3. Grab check-ins
  const checkIns = await prisma.checkin.findMany({
    where: { userId: userSession.id },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  // Participant info
  const participant = userSession.ParticipantInfo;
  const fullName = participant
    ? `${participant.firstName} ${participant.lastName}`
    : null;

  // HackerPass / QR code
  const qrCodeData = participant
    ? userSession.id
    : "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  const pendingInvites = await prisma.reimbursementInvite.findMany({
    where: {
      userId: userSession.id,
      status: "PENDING",
    },
    include: {
      reimbursement: {
        select: {
          userId: true, // Group leader's ID
          creator: { select: { email: true } }, // Group leader's email
        },
      },
    },
  });
  // We'll show accepted members in the GroupReimbursementCard,
  // so no need to handle them here.

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="p-6">
          <CardTitle className="text-3xl font-bold text-center p-0">
            My Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs defaultValue="profileInfo" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList aria-label="Profile sections">
                <TabsTrigger value="profileInfo">
                  <IconUser size={16} className="mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="checkins">
                  <IconHistory size={16} className="mr-2" />
                  Check-ins
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profileInfo">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HackerPass Card */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <IconUserFilled
                          size={20}
                          className="text-primary mr-2"
                        />
                        My HackerPass
                      </CardTitle>
                      {participant && (
                        <p className="text-sm text-primary font-semibold">
                          Active
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Used to check-in to the hackathon and events
                    </p>
                  </CardHeader>

                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    {!participant ? (
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-gray-50">
                        <IconLock size={40} className="text-gray-400 mb-4" />
                        <p className="text-center text-gray-600 mb-4">
                          Complete your registration to unlock your HackerPass.
                        </p>
                        <Link href="/register">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Register Now
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <QrCodeComponent qrCodeData={String(qrCodeData)} />
                        <p className="text-xs text-center text-muted-foreground">
                          Present this code at check-in stations
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* User Info Card */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <IconBraces size={20} className="text-primary mr-2" />
                        My Information
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Name & Email */}
                      {fullName && (
                        <div className="flex items-center space-x-2">
                          <IconUser className="text-primary" size={20} />
                          <p>{fullName}</p>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <IconMail className="text-primary" size={20} />
                        <p>{userSession.email}</p>
                      </div>

                      <div className="flex items-center gap-2 text-red-500">
                        <IconLogout
                          className="text-primary ml-[2px]"
                          size={20}
                        />
                        <Link
                          href="/signout"
                          className="flex flex-row items-center gap-2 hover:underline"
                        >
                          Sign Out
                        </Link>
                      </div>

                      <hr className="my-4 border-gray-200" />

                      {/* If user has Reimbursement */}
                      {participant && hasReimb ? (
                        <div className="flex flex-col space-y-2">
                          {canEdit && (
                            <div className="flex items-center gap-2">
                              <IconEdit
                                className="text-primary ml-[2px]"
                                size={20}
                              />
                              <Link
                                href="/reimbursement/edit"
                                className="flex flex-row items-center gap-2 hover:underline"
                              >
                                View / Edit My Reimbursement
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : (
                        participant && (
                          <div className="flex items-center space-x-2 hover:underline">
                            <IconFileText className="text-primary" size={20} />
                            <p>
                              <Link
                                href="/reimbursement"
                                className="flex flex-row items-center gap-2"
                              >
                                Apply for Travel Reimbursement
                                <IconExternalLink size={16} />
                              </Link>
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    {/* If the user is a group leader, show invite statuses */}
                    {userSession.createdReimbursement && (
                      <div className="p-4 mt-4 border-l-4 border-blue-400 bg-blue-50">
                        <h3 className="text-md font-semibold mb-2">
                          Group Invite Status
                        </h3>
                        {userSession.createdReimbursement.invites.length > 0 ? (
                          <ul>
                            {userSession.createdReimbursement.invites.map(
                              (invite) => (
                                <li key={invite.id} className="mb-2">
                                  {invite.user.ParticipantInfo
                                    ? `${invite.user.ParticipantInfo.firstName} ${invite.user.ParticipantInfo.lastName}`
                                    : invite.user.email}{" "}
                                  -{" "}
                                  <span
                                    className={
                                      invite.status === "ACCEPTED"
                                        ? "text-green-600"
                                        : invite.status === "PENDING"
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {invite.status}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p>No invites sent yet.</p>
                        )}
                      </div>
                    )}

                    {/* [Line B] Show group if the user has an accepted membership with a reimbursement */}
                    {pendingInvites.length > 0 && (
                      <div className="p-4 mt-4 border-l-4 border-yellow-400 bg-yellow-50">
                        <h3 className="text-md font-semibold mb-2">
                          Pending Group Invite
                        </h3>
                        {pendingInvites.map((invite) => (
                          <div key={invite.id} className="mb-3">
                            <p>
                              Group Leader: {invite.reimbursement.creator.email}
                            </p>
                            <Link
                              href="/reimbursement/invite"
                              className="text-blue-600 underline text-sm"
                            >
                              Accept / Decline
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* [NEW] Show reimbursement group if user accepted an invite */}
                    {userSession.travelReimbursement &&
                      !userSession.createdReimbursement && (
                        <div className="p-4 mt-4 border-l-4 border-green-400 bg-green-50">
                          <h3 className="text-md font-semibold mb-2">
                            Reimbursement Group
                          </h3>
                          <p>
                            <span className="font-medium">Group Leader:</span>{" "}
                            {userSession.travelReimbursement.creator?.email ||
                              "Unknown"}
                          </p>
                          <Link
                            href="/reimbursement/edit"
                            className="text-blue-600 underline text-sm mt-2 block"
                          >
                            View Reimbursement Details
                          </Link>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="checkins">
              <div className="space-y-4 pb-4">
                <h3 className="text-lg font-bold mb-4">Recent Check-Ins</h3>
                {checkIns.length > 0 ? (
                  <ul className="space-y-2">
                    {checkIns.map((checkIn) => (
                      <li
                        key={checkIn.id}
                        className="p-3 border rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 text-green-600">
                            <IconCheck size={20} />
                          </div>
                          <div>
                            <p className="font-medium">{checkIn.event.name}</p>
                            <p className="text-sm text-muted-foreground">
                              <LocalDateTime
                                showTime
                                dateString={checkIn.createdAt.toString()}
                              />
                              {checkIn.event.location &&
                                ` ${checkIn.event.location}`}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No check-ins yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
