import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma";
import QrCodeComponent from "@/components/UserQRCode";
import XPBar from "@/components/XPBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  IconMail,
  IconUser,
  IconCalendar,
  IconHelpCircle,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AuthButtons from "@/components/AuthButtons";
import { TooltipProvider } from "@radix-ui/react-tooltip";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to be authenticated to view this page.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/signin">Sign in</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? undefined },
      include: { ParticipantInfo: true },
    });

    const qrCodeData = user?.id;
    const participant = user?.ParticipantInfo;
    const fullName = participant
      ? `${participant.firstName} ${participant.lastName}`
      : "N/A";
    const accountCreationDate = user
      ? formatDate(user.createdAt.toString())
      : "N/A";

    return (
      <div className="container mx-auto p-4 max-w-4xl space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="p-6">
            <CardTitle className="text-3xl font-bold text-center p-0">
              Hacker Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <XPBar xpDouble={5} />
            <Tabs defaultValue="profileInfo" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="profileInfo">Profile Info</TabsTrigger>
                  <TabsTrigger value="applicationInfo">
                    Registration Info
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Profile Information Tab */}
              <TabsContent value="profileInfo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* QR Code Card */}
                  {qrCodeData && (
                    <Card className="shadow-sm relative overflow-hidden">
                      {!participant && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
                          <div className="bg-black/60 text-white px-2 py-2 rounded-md">
                            <p className="text-center text-md">
                              <u>
                                <Link href="register">Register</Link>
                              </u>{" "}
                              to view your QR code.
                            </p>
                          </div>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-xl font-semibold">
                            Your QR Code
                          </CardTitle>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <IconHelpCircle
                                  className="text-gray-400 hover:text-primary cursor-pointer"
                                  size={18}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  This QR code is used for checking into the
                                  hackathon and individual events. Please keep
                                  it accessible during the event.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center space-y-2">
                        <div
                          className={`relative ${
                            !participant ? "blur-sm" : ""
                          }`}
                        >
                          <QrCodeComponent qrCodeData={qrCodeData} />
                        </div>
                        <p className="text-xs text-gray-500">
                          <code>{qrCodeData}</code>
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* User Info */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">
                        Hacker Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <IconUser className="text-primary" size={20} />
                          <p>{fullName}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <IconMail className="text-primary" size={20} />
                          <p>{session.user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <IconCalendar className="text-primary" size={20} />
                          <p>Hacker Since: {accountCreationDate}</p>
                        </div>
                        <AuthButtons isAuthenticated />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Application Information Tab */}
              <TabsContent value="applicationInfo">
                <div className="space-y-4 pb-4">
                  {participant ? (
                    <>
                      <p className="text-sm text-center text-muted-foreground mt-4">
                        If you need to update this information, please contact
                        us at <strong>help@hackku.org</strong>
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
                              key !== "agreeMLHCode"
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
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Please complete your application{" "}
                      <u>
                        <Link href="/register">here</Link>
                      </u>
                    </p>
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
