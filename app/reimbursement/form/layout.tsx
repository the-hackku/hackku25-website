import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authoptions";
import { prisma } from "@/lib/prisma";

export default async function ReimbursementLayout({}: // children,
{
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 🚀 If the user is not authenticated, redirect to the signin page
  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { travelReimbursement: true, ParticipantInfo: true },
  });

  if (!user?.ParticipantInfo) {
    redirect("/profile");
  }

  if (user.travelReimbursement) {
    redirect("/profile");
  } else {
    redirect("/profile");
  }
}
//   // 🚀 If they haven't applied yet, show the reimbursement form
//   return <div className="mb-10">{children}</div>;
// }
