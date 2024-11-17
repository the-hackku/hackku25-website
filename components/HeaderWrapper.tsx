import RegisterAlert from "./RegisterAlert";
import Header from "./Header";
import { isAdmin } from "@/middlewares/isAdmin";
import { prisma } from "@/prisma";

// This is a server component
export default async function HeaderWrapper() {
  let isAdminUser = false;
  let isRegistered = false;

  try {
    // Use the isAdmin function to check admin status
    const session = await isAdmin(); // This will throw an error if the user is not logged in

    // Fetch user information from the database using Prisma
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { ParticipantInfo: true },
    });

    // Extract admin status and registration information
    isAdminUser = user?.role === "ADMIN";
    isRegistered = !!user?.ParticipantInfo;
  } catch (error) {
    // If the user is not logged in or an error occurs, default values are used
    console.error("Error in HeaderWrapper:");
  }

  return (
    <>
      <RegisterAlert isRegistered={isRegistered} />
      <Header isAdmin={isAdminUser} />
    </>
  );
}
