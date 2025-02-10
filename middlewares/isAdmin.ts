import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authoptions";

export async function isAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("You are not authorized to perform this action.");
  }

  return session;
}

export async function isAdminOrVolunteer(){
  const session = await getServerSession(authOptions);
  if(!session || !(session.user.role == "ADMIN" || session.user.role == "VOLUNTEER")) {
    throw new Error("You are not authorized to perform this action.");
  }
}