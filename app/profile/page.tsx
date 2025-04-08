/* app/profile/page.tsx */
import { redirect } from "next/navigation";
// import LocalDateTime from "@/components/localDateTime";
import QrCodeComponent from "@/components/UserQRCode";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Make sure this is at the top
import Link from "next/link";
import {
  IconMail,
  IconUser,
  IconLogout,
  IconUserFilled,
  // IconHistory,
  // IconCheck,
  IconLock,
  // IconEdit,
} from "@tabler/icons-react";

import { prisma } from "@/lib/prisma";
import {
  getUserWithReimbursement,
  // userHasReimbursement,
} from "../actions/reimbursement";
// import type { UserWithReimbursement } from "../actions/reimbursement";

/**
 * Helper: can the user edit the existing reimbursement?
 */
// function canEditReimbursement(user: UserWithReimbursement): boolean {
//   // ✅ Solo reimbursement check
//   if (user.travelReimbursement && user.travelReimbursement.userId === user.id) {
//     return true;
//   }
//   // ✅ Group leader check (creator of reimbursement)
//   if (user.createdReimbursement) {
//     return true;
//   }
//   return false;
// }

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
  // const hasReimb = await userHasReimbursement(userSession);
  // const canEdit = hasReimb && canEditReimbursement(userSession);

  // 3. Grab check-ins
  const checkIns = await prisma.checkin.findMany({
    where: { userId: userSession.id },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  // Get all users' check-in counts
  const allUserCheckins = await prisma.user.findMany({
    select: {
      id: true,
      checkinsAsUser: { select: { id: true } },
    },
  });

  const userCheckinCount = checkIns.length;
  const checkinCounts = allUserCheckins.map((u) => u.checkinsAsUser.length);

  const usersWithFewerCheckins = checkinCounts.filter(
    (count) => count < userCheckinCount
  ).length;

  const totalUsers = checkinCounts.length;
  const checkinPercentile =
    totalUsers > 0
      ? Math.round((usersWithFewerCheckins / totalUsers) * 100)
      : 0;

  const reservationRequest = await prisma.reservationRequest.findUnique({
    where: { userId: userSession.id },
  });

  const themedRoomReservation = await prisma.themedRoomReservation.findUnique({
    where: { userId: userSession.id },
  });

  const themeRoomMap: Record<string, string> = {
    DUNGEONS_AND_DRAGONS: "LEEP2 Room 2324 🐉",
    HOW_TO_TRAIN_YOUR_DRAGON: "LEEP2 Room 2326 🐲",
    DARK_FAIRY: "LEEP2 Room 2328 🧚",
  };

  // Get top 10 users by check-in count
  const topUsers = allUserCheckins
    .map((u) => ({
      id: u.id,
      checkinCount: u.checkinsAsUser.length,
    }))
    .sort((a, b) => b.checkinCount - a.checkinCount)
    .slice(0, 10);

  // Get participant info for those top users
  const topUserDetails = await prisma.user.findMany({
    where: {
      id: { in: topUsers.map((u) => u.id) },
    },
    include: {
      ParticipantInfo: true,
    },
  });

  const leaderboard = topUsers.map((u, index) => {
    const userInfo = topUserDetails.find((info) => info.id === u.id);
    const name = userInfo?.ParticipantInfo
      ? `${userInfo.ParticipantInfo.firstName} ${userInfo.ParticipantInfo.lastName}`
      : userInfo?.email ?? "Anonymous";
    return {
      rank: index + 1,
      name,
      checkins: u.checkinCount,
    };
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
      <Card className="shadow-none md:shadow-sm">
        <CardHeader className="pt-6 pb-2">
          <CardTitle className="text-3xl font-bold text-center p-0">
            My Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="p-2 md:p-4 space-y-4">
          <Tabs defaultValue="profileInfo" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList aria-label="Profile sections">
                <TabsTrigger value="profileInfo">
                  <IconUser size={16} className="mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="checkins">Leaderboard</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profileInfo">
              {/* Check-in Level + Progress */}
              <div className="w-full space-y-2  px-2 text-center gap-0">
                <div>
                  <span className="text-md font-semibold">
                    Level {1 + Math.floor(checkIns.length / 5)} Hacker (
                    {checkinPercentile}
                    {checkinPercentile % 10 === 1 && checkinPercentile !== 11
                      ? "st"
                      : checkinPercentile % 10 === 2 && checkinPercentile !== 12
                      ? "nd"
                      : checkinPercentile % 10 === 3 && checkinPercentile !== 13
                      ? "rd"
                      : "th"}{" "}
                    percentile)
                  </span>
                </div>
                <Progress
                  value={((checkIns.length % 5) / 5) * 100}
                  className="h-2.5"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{checkIns.length} check-ins</span>

                  <span>
                    {Math.floor(checkIns.length / 5) < 10 ? (
                      <>
                        {`${5 - (checkIns.length % 5)} more to `}
                        <strong>{`Level ${
                          Math.floor(checkIns.length / 5) + 2
                        }`}</strong>
                      </>
                    ) : (
                      "Max level"
                    )}
                  </span>
                </div>
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HackerPass Card */}

                <Card className="shadow-none">
                  <CardHeader className="pb-2">
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

                  <CardContent className="flex flex-col items-center space-y-2 p-3">
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
                        <QrCodeComponent
                          qrCodeData={String(qrCodeData)}
                          size={250}
                        />
                        <p className="text-xs text-center text-muted-foreground">
                          Present this code at check-in stations
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* User Info Card */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <IconUserFilled
                          size={20}
                          className="text-primary mr-2"
                        />
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

                      <hr className="my-4 border-gray-200" />

                      {/* If user has Reimbursement */}
                      {/* {participant && hasReimb && (
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
                                View/Edit Travel Reimbursement
                              </Link>
                            </div>
                          )}
                        </div>
                      )} */}
                    </div>

                    {/* If the user is a group leader, show invite statuses */}
                    {userSession.createdReimbursement &&
                      userSession.createdReimbursement.invites.length > 0 && (
                        <div className="p-4 mt-4 border-l-4 border-blue-400 bg-blue-50">
                          <h3 className="text-md font-semibold mb-2">
                            Reimbursement Group Invites:
                          </h3>
                          {userSession.createdReimbursement.invites.length >
                          0 ? (
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
                        <div className="p-4 mt-4 border-l-4 border-green-400 bg-green-50 space-x-2">
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
                    {reservationRequest?.roomAssignment && (
                      <div className="p-4 mt-4 border-l-4 border-indigo-400 bg-indigo-50">
                        <h3 className="text-md font-semibold">
                          Weekend Room Reservation
                        </h3>
                        <p>
                          <span className="font-medium">Room:</span>{" "}
                          {reservationRequest.roomAssignment}
                        </p>

                        <p>
                          <span className="font-medium">Team Name:</span>{" "}
                          {reservationRequest.teamName}
                        </p>
                      </div>
                    )}
                    {themedRoomReservation && (
                      <div className="p-4 mt-4 border-l-4 border-pink-400 bg-pink-50">
                        <h3 className="text-md font-semibold mb-2">
                          Themed Room Reservation
                        </h3>
                        <p>
                          <span className="font-medium">Room:</span>{" "}
                          <span>
                            {themeRoomMap[themedRoomReservation.theme]}
                          </span>
                        </p>

                        <p>
                          <span className="font-medium">Time Slot:</span>{" "}
                          {themedRoomReservation.timeSlot
                            .replace(/_/g, " ")
                            .replace(
                              /(\w+)\s(\d+)\s(\d+)(AM|PM)/,
                              (_, day, start, end, period) =>
                                `${day.charAt(0)}${day
                                  .slice(1)
                                  .toLowerCase()} ${start} - ${end}${period}`
                            )}
                        </p>
                        <p>
                          <span className="font-medium">Team Name:</span>{" "}
                          {themedRoomReservation.teamName}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 space-y-4">
                      <div className="flex items-center gap-2 pt-2">
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
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="checkins">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">
                  🏆 Top 10 Check-In Leaderboard
                </h3>
                <ul className="space-y-2">
                  {leaderboard.map((user) => (
                    <li
                      key={user.rank}
                      className="flex justify-between items-center p-3 border rounded-md bg-white shadow-sm"
                    >
                      <span>
                        #{user.rank} - {user.name}
                      </span>
                      <span className="font-semibold">
                        {user.checkins} check-ins
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
