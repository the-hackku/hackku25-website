import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authoptions";
import { prisma } from "@/prisma";
import QrCodeComponent from "@/components/UserQRCode";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import constants from "@/constants";
import { formatDate, formatTimeFromDate } from "@/utils/dateUtils";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? undefined },
      include: { ParticipantInfo: true, TravelReimbursement: true },
    });

    const reimbursement = user?.TravelReimbursement;
    const reimbursementDate = reimbursement ? reimbursement.createdAt : null;

    const checkIns = await prisma.checkin.findMany({
      where: { userId: user?.id },
      include: { event: true }, // Include event details
      orderBy: { createdAt: "desc" },
    });

    const qrCodeData = user?.ParticipantInfo
      ? String(user?.id)
      : "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const participant = user?.ParticipantInfo;
    const fullName = participant
      ? `${participant.firstName} ${participant.lastName}`
      : null;

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
                  <TabsTrigger
                    value="applicationInfo"
                    disabled={!participant}
                    className="hidden sm:flex"
                  >
                    <IconFileText size={16} className="mr-2" />
                    Registration
                  </TabsTrigger>
                  <TabsTrigger value="checkins">
                    <IconHistory size={16} className="mr-2" />
                    Check-ins
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Profile Information Tab */}
              <TabsContent value="profileInfo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* QR Code Card */}
                  {/* QR Code Card */}
                  {qrCodeData && (
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
                            <IconLock
                              size={40}
                              className="text-gray-400 mb-4"
                            />
                            <p className="text-center text-gray-600 mb-4">
                              Complete your registration to unlock your
                              HackerPass.
                            </p>
                            <Link href="/register">
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                Register Now
                              </button>
                            </Link>
                          </div>
                        ) : (
                          <>
                            <QrCodeComponent qrCodeData={qrCodeData} />
                            <p className="text-xs text-center text-muted-foreground">
                              Present this code at check-in stations
                            </p>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* User Info */}
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
                        {fullName && (
                          <div className="flex items-center space-x-2">
                            <IconUser className="text-primary" size={20} />
                            <p>{fullName}</p>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <IconMail className="text-primary" size={20} />
                          <p>{session.user.email}</p>
                        </div>

                        <hr className="my-4 border-gray-200" />
                        {user?.ParticipantInfo &&
                          (reimbursementDate ? (
                            <div className="flex items-center space-x-2">
                              <IconCheck className="text-primary" size={20} />
                              <p>
                                Reimbursement Submitted on{" "}
                                {new Date(
                                  reimbursementDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 hover:underline">
                              <IconFileText
                                className="text-primary"
                                size={20}
                              />
                              <p>
                                <Link
                                  href={`/reimbursement`}
                                  className="flex flex-row items-center gap-2"
                                >
                                  Apply for Travel Reimbursement
                                  <IconExternalLink size={16} />
                                </Link>
                              </p>
                            </div>
                          ))}

                        <div className="flex items-center gap-2">
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

              {/* Application Information Tab */}
              <TabsContent value="applicationInfo">
                <div className="space-y-4 pb-4">
                  {participant && (
                    <>
                      <p className="text-sm text-center text-muted-foreground mt-4">
                        If you need to update this information, please contact
                        us at{" "}
                        <Link
                          href={`mailto:${constants.supportEmail}`}
                          className="underline"
                        >
                          {constants.supportEmail}
                        </Link>
                        <hr className="my-4 border-gray-200" />
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(participant)
                          .filter(
                            ([key, value]) =>
                              value &&
                              value !== "N/A" &&
                              key !== "id" &&
                              key !== "userId" &&
                              key !== "updatedAt" &&
                              key !== "agreeHackKUCode" &&
                              key !== "agreeMLHCode" &&
                              key !== "resumeUrl"
                          )
                          .map(([key, value]) => (
                            <InfoItem
                              key={key}
                              label={
                                key === "createdAt"
                                  ? "Registration Date"
                                  : key
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) => str.toUpperCase())
                              }
                              value={
                                key === "createdAt"
                                  ? formatDate(String(value))
                                  : String(value)
                              }
                            />
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Check-Ins Tab */}
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
                              <p className="font-medium">
                                {checkIn.event.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(checkIn.createdAt)} •{" "}
                                {formatTimeFromDate(checkIn.createdAt)}
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
  } catch (error) {
    console.error("Failed to load profile information:", error);
    return (
      <div className="container mx-auto p-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">
              Error: Failed to load profile information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
