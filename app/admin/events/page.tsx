import { fetchEvents } from "@/app/actions/events";
import { EventForm } from "@/components/forms/eventForm";
import ScheduleGrid from "@/components/ScheduleGrid";
import { EventType } from "@prisma/client";
import Link from "next/link";

// Define Event type based on the structure returned by `getEvents`
interface Event {
  id: string;
  name: string;
  startDate: string; // Full datetime string
  endDate: string; // Full datetime string
  location: string | null;
  eventType: EventType;
}

export default async function EventsPage() {
  // Fetch events data from the backend
  const events = await fetchEvents();

  console.log(events);

  // Pre-process the dates to keep them as full datetime strings
  const processedEvents: Event[] = events.map((event) => ({
    id: event.id,
    name: event.name,
    startDate: event.startDate.toISOString(), // Convert to ISO string
    endDate: event.endDate.toISOString(), // Convert to ISO string
    location: event.location,
    eventType: event.eventType, // Add eventType
  }));

  return (
    <>
      <div>
        <Link href="/admin">← Back to Admin Panel</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <EventForm />
      {/* Render the Schedule Grid */}
      <ScheduleGrid schedule={processedEvents} />
    </>
  );
}
