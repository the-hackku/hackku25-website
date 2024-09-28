import { prisma } from "@/prisma"; // Use your initialized Prisma client
import ReadyForHackKU from "@/pages/ReadyForHackKU";
import SplashPage from "@/pages/SplashPage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation"; // Import the redirect function

// Server component - `async` components are treated as server components
export default async function HomePage() {
  // Get the session to check if the user is authenticated
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, show the SplashPage
  if (!session?.user?.email) {
    return <SplashPage />;
  }

  // Fetch user details to determine registration status
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { ParticipantInfo: true },
  });

  // If user is not found, show an error message
  if (!user) {
    return <p>User not found. Please sign in again.</p>;
  }

  // Check if the user is registered
  const isRegistered = user.ParticipantInfo && user.ParticipantInfo.firstName;
  // If registered, show the ReadyForHackKU page
  return <ReadyForHackKU />;
}
