import { redirect } from "next/navigation";
import { isAdmin } from "@/middlewares/isAdmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Check if the user is an admin
    await isAdmin();
  } catch (error) {
    // Redirect to sign-in page if not authorized
    redirect("/signin");
  }

  // If authorized, render the children
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">{children}</div>
  );
}
