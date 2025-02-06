import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authoptions";

export default async function ReimbursemenrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, redirect to the signin page
  if (!session) {
    redirect("/");
  }

  // If not registered, show the registration form
  return <div className="mb-10">{children}</div>;
}
