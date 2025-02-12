import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authoptions";
import { prisma } from "@/prisma";

export default async function ReimbursemenrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, redirect to the signin page
  if (!session) {
    redirect("/signin");
  }

  // Fetch user details from the database to check if they are already registered
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? undefined },
    include: { TravelReimbursement: true },
  });

  const reimbursement = user?.TravelReimbursement;
  const reimbursementDate = reimbursement ? reimbursement.createdAt : null;

  if (reimbursementDate) {
    redirect("/profile");
  }

  // If not registered, show the registration form
  return <div className="mb-10">{children}</div>;
}
