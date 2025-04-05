"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/middlewares/isAdmin";
import { EventType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// app/actions/events.ts

export async function fetchEvents() {
  return await prisma.event.findMany({
    select: {
      id: true,
      name: true,
      startDate: true, // ⬅️ add this
    },
    orderBy: {
      startDate: "asc", // ⬅️ optionally sort here instead of the frontend
    },
  });
}

export async function updateEvent(
  id: string,
  data: {
    name: string;
    description: string;
    location: string;
    eventType: EventType;
    startDate: string; // ISO
    endDate: string; // ISO
  }
) {
  isAdmin();
  await prisma.event.update({
    where: { id },
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });

  revalidatePath("/schedule");
}
