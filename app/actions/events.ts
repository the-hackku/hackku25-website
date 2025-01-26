"use server";

import { prisma } from "@/prisma";

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
