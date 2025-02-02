import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authoptions";
import { prisma } from "@/prisma";
import { ReimbursementForm } from "@/components/forms/ReimbursementForm";

export default async function RegisterPage() {

  // If not registered, show the registration form
  return (
    <div className="mb-10">
      <ReimbursementForm />
    </div>
  );
}