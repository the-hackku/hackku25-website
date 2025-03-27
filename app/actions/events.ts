"use server";

import { prisma } from "@/lib/prisma";

export async function fetchEvents() {
  return await prisma.event.findMany({
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      location: true,
      eventType: true,
    },
  });
}
