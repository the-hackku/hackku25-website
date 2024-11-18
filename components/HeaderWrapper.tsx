import RegisterAlert from "./RegisterAlert";
import Header from "./Header";
import { isAdmin } from "@/middlewares/isAdmin";
import { prisma } from "@/prisma";

// This is a server component
export default async function HeaderWrapper() {
  try {
    const session = await isAdmin(); // Get the session; throws an error if the user is not logged in
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { ParticipantInfo: true },
    });

    const isAdminUser = user?.role === "ADMIN";
    const isRegistered = Boolean(user?.ParticipantInfo);

    return (
      <>
        {!isRegistered && <RegisterAlert />}
        <Header isAdmin={isAdminUser} />
      </>
    );
  } catch {
    // If not logged in, render the header without the alert
    return <Header isAdmin={false} />;
  }
}
