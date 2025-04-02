// app/reservation/layout.tsx
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authoptions";

/**
 * Layout that checks if the current user already has a reservation.
 * If yes, redirect them to their profile. Otherwise, continue.
 */
export default async function ReservationLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 1) Ensure the user is logged in
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // If not logged in, redirect to sign-in (or wherever you want).
    redirect("/signin");
  }

  // 2) Check if a reservation already exists for this user
  const existingReservation = await prisma.themedRoomReservation.findFirst({
    where: { userId: session.user.id },
  });

  // 3) If found, redirect to their profile (or any other route).
  if (existingReservation) {
    redirect("/profile");
  }

  // 4) Otherwise, render the reservation form (children).
  return <>{children}</>;
}
