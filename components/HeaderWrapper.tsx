import RegisterAlert from "./RegisterAlert";
import Header from "./Header";
import { prisma } from "@/prisma";
import { authOptions } from "@/lib/authoptions";
import { getServerSession } from "next-auth";

export default async function HeaderWrapper() {
  // 1. Try to get the session; null if not logged in
  const session = await getServerSession(authOptions);

  if (!session) {
    // 2. If user is NOT logged in, no alert, just the basic Header
    return <Header isAdmin={false} />;
  }

  // 3. If user is logged in, find them in the DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { ParticipantInfo: true },
  });

  // 4. Determine if they’re an admin & if they’re registered
  const isAdminUser = user?.role === "ADMIN";
  const isRegistered = Boolean(user?.ParticipantInfo);

  // 5. Show alert if they’re logged in but not registered
  return (
    <>
      {!isRegistered && !isAdminUser && <RegisterAlert />}
      <Header isAdmin={isAdminUser} />
    </>
  );
}
