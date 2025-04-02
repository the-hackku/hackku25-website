// app/schedule/page.tsx

import AdminEventEditor from "@/components/admin/EventEditor";
import { EventForm } from "@/components/forms/eventForm";
import ScheduleGrid from "@/components/ScheduleGrid";
import { prisma } from "@/lib/prisma";
import { Event } from "@prisma/client";
import Link from "next/link";

// Server-side function to fetch events data
async function getEvents(): Promise<Event[]> {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
      location: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
      description: true,
      eventType: true,
    },
  });

  return events;
}

export default async function SchedulePage() {
  const events = await getEvents();

  // Convert date to string and include it in the formatted events
  const formattedEvents = events.map((event) => ({
    ...event,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate.toISOString(),
    description: event.description,
  }));

  // Decide how to identify "beginner workshops" vs. "normal" events.
  // For example, let's assume anything before April 4, 2025 is "beginner" content:
  const cutoffDate = new Date("2025-04-04T00:00:00.000Z");

  // Filter out beginner workshops

  // Filter out the rest (main schedule)
  const mainScheduleEvents = formattedEvents.filter(
    (ev) => new Date(ev.startDate) >= cutoffDate
  );

  return (
    <>
      <div>
        <Link href="/admin">← Back to Admin Panel</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <div className="flex flex-col md:flex-row gap-2">
        <EventForm />
        <AdminEventEditor events={events} />
      </div>
      {/* Render the Schedule Grid */}
      <ScheduleGrid schedule={mainScheduleEvents} />
    </>
  );
}
