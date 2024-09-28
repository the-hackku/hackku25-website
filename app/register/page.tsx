import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma";
import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle } from "lucide-react";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, redirect to the signin page
  if (!session) {
    redirect("/signin");
  }

  // Fetch user details from the database to check if they are already registered
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? undefined },
    include: { ParticipantInfo: true },
  });

  const participant = user?.ParticipantInfo;

  // If the user has already registered, show an alert message using ShadCN's Alert component
  if (participant) {
    return (
      <div className="container mx-auto max-w-md p-6">
        <Alert className="mb-4">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle>You're already registered!</AlertTitle>
          <AlertDescription>
            Thank you for registering for HackKU 2025. You can view your
            application{" "}
            <Link href="/profile" className="underline">
              here
            </Link>
            .
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If not registered, show the registration form
  return <RegistrationForm />;
}
