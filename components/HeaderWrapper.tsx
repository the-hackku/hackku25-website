// app/components/HeaderWrapper.tsx
import RegisterAlert from "./RegisterAlert";
import Header from "./Header";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authoptions";
import { prisma } from "@/prisma";

// This is a server component
export default async function HeaderWrapper() {
  const session = await getServerSession(authOptions);

  // If no session exists, return the header without any alerts
  if (!session?.user?.email) {
    return (
      <>
        <Header isRegistered={false} />
      </>
    );
  }

  // Fetch user information from the database using Prisma
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { ParticipantInfo: true },
  });

  // Extract user data and check if registration is complete
  const participant = user?.ParticipantInfo;
  const isRegistered = !!participant;

  return (
    <>
      <Header isRegistered={isRegistered} />
      <RegisterAlert isRegistered={isRegistered} />
    </>
  );
}
