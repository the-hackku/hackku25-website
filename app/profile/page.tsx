// app/profile/page.tsx
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

// 1) Import Prisma
import { prisma } from "@/prisma";

// 2) Reimbursement helpers & types
import {
  getUserWithReimbursement,
  userHasReimbursement,
} from "@/app/actions/hasReimbursement";
import type { UserWithReimbursement } from "@/app/actions/hasReimbursement";

/**
 * Helper function to check if user can edit the existing reimbursement:
 *  - If they have a solo reimbursement ( user.travelReimbursement.userId === user.id )
 *  - Or if they are a group leader ( group.creatorId === user.id ).
 */
function canEditReimbursement(user: UserWithReimbursement): boolean {
  // If user has a solo reimbursement, check userId
  if (user.travelReimbursement && user.travelReimbursement.userId === user.id) {
    return true;
  }

  // Otherwise, check if user is group leader
  const membershipWithGroupReimb = user.reimbursementGroupMemberships.find(
    (m) => m.group?.reimbursement
  );
  if (
    membershipWithGroupReimb &&
    membershipWithGroupReimb.group.creatorId === user.id
  ) {
    return true;
  }

  return false;
}

/**
 * Main Profile Page
 */
export default async function ProfilePage() {
  // 1. Load user with reimbursement logic
  const userSession = await getUserWithReimbursement().catch((err) => {
    console.error("Error fetching user with reimbursement:", err);
    redirect("/signin");
  });

  if (!userSession) {
    redirect("/signin");
  }

  // 2. Single calls for reimbursement logic
  const hasReimb = await userHasReimbursement(userSession);
  const canEdit = hasReimb && canEditReimbursement(userSession);

  // 3. Fetch check-ins (server side)
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
    ? userSession.id // user ID for scanning
    : "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // fallback

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
                {/* <TabsTrigger
                  value="applicationInfo"
                  disabled={!participant}
                  className="hidden sm:flex"
                >
                  <IconFileText size={16} className="mr-2" />
                  Registration
                </TabsTrigger> */}
                <TabsTrigger value="checkins">
                  <IconHistory size={16} className="mr-2" />
                  Check-ins
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Profile Info Tab */}
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
                      {/* Sign Out Link */}
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

                      {/* Reimbursement Info */}
                      {participant && hasReimb ? (
                        <div className="flex flex-col space-y-2">
                          {/* Optional Edit Link if canEdit */}
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
                        // If not applied yet, show link
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

                    {/* If user is group leader or in a group, show group details */}
                    {userSession?.reimbursementGroupMemberships?.some(
                      (m) => m.group?.reimbursement
                    ) && <GroupReimbursementCard user={userSession} />}

                    {/* If user has pending invites (not the group they created) */}
                    {userSession.reimbursementGroupMemberships
                      ?.filter((m) => m.status === "PENDING")
                      .map((membership) => (
                        <div
                          key={membership.id}
                          className="p-4 border rounded-md mt-4"
                        >
                          <h3 className="text-lg font-semibold">
                            Reimbursement Group Invite
                          </h3>
                          <p>
                            Group Leader Email: {membership.group.creator.email}
                          </p>
                          <Link
                            href="/reimbursement/invite"
                            className="text-blue-600 underline"
                          >
                            Accept / Decline Invite
                          </Link>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* <TabsContent value="applicationInfo">
              
            </TabsContent> */}

            {/* Check-ins Tab */}
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

/**
 * A card that shows the group members' statuses
 * and additional info if you're the group leader.
 */
function GroupReimbursementCard({ user }: { user: UserWithReimbursement }) {
  // Find the group membership that has a reimbursement
  const membershipWithGroupReimb = user.reimbursementGroupMemberships.find(
    (m) => m.group?.reimbursement
  );
  if (!membershipWithGroupReimb) return null;

  const group = membershipWithGroupReimb.group;
  // 1. Check if user is the group leader
  const isLeader = group.creatorId === user.id;

  // 2. Count how many have accepted vs. total
  const totalMembers = group.members.length;
  const acceptedCount = group.members.filter(
    (m) => m.status === "ACCEPTED"
  ).length;

  return (
    <div className="p-4 border rounded-md mt-4">
      <h3 className="text-lg font-semibold">My Reimbursement Group</h3>

      {isLeader ? (
        <>
          <p className="text-sm">You are the group leader. </p>
          <p className="text-sm">
            {" "}
            {acceptedCount === totalMembers
              ? "All members have accepted."
              : `Waiting for ${totalMembers - acceptedCount} members to accept.
        `}
          </p>
        </>
      ) : (
        <p className="text-sm text-blue-600">You are a member of this group.</p>
      )}

      <ul className="mt-2 space-y-2">
        {group.members.map((member) => {
          const memberUser = member.user;
          const status = member.status; // 'PENDING' | 'ACCEPTED' | 'DECLINED'
          const name = memberUser.email;

          return (
            <li
              key={member.id}
              className="flex items-center justify-between bg-white p-2 border rounded"
            >
              <span>{name === user.email ? "You" : name}</span>
              <span
                className={
                  status === "ACCEPTED"
                    ? "text-green-600"
                    : status === "PENDING"
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {status}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
