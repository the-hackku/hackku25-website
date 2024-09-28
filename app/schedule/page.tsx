// app/schedule/page.tsx
import ScheduleGrid from "@/components/ScheduleGrid";
import { prisma } from "@/prisma";
import { Event } from "@prisma/client";

// Server-side function to fetch events data
async function getEvents(): Promise<Event[]> {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
      date: true,
      location: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { date: "asc" },
  });

  return events;
}

export default async function SchedulePage() {
  const events = await getEvents();

  // Convert date to string
  const formattedEvents = events.map((event) => ({
    ...event,
    date: event.date.toISOString(),
  }));

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">Event Schedule</h1>
      <ScheduleGrid schedule={formattedEvents} />
    </div>
  );
}
