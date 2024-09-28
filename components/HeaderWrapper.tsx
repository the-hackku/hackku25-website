// app/components/HeaderWrapper.tsx
import RegisterAlert from "./RegisterAlert";
import Header from "./Header";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma"; // Import the prisma client

// This is a server component
export default async function HeaderWrapper() {
  const session = await getServerSession(authOptions);

  // If no session exists, return the header without any alerts
  if (!session?.user?.email) {
    return (
      <>
        <Header />
      </>
    );
  }

  // Fetch user information from the database using Prisma
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { ParticipantInfo: true },
  });

  // Extract user data and check if registration is complete
  const participant = user?.ParticipantInfo || null;
  const isRegistered = !!participant; // `isRegistered` is true if `ParticipantInfo` exists

  return (
    <>
      <Header />
      <RegisterAlert isRegistered={isRegistered} />
    </>
  );
}
