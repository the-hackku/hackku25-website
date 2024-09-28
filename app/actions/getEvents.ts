"use server";

import { prisma } from "@/prisma";

export async function getEvents() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return events;
}
