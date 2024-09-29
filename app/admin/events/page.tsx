import { getEvents } from "@/app/actions/admin";
import { EventForm } from "@/components/forms/eventForm";
import ScheduleGrid from "@/components/ScheduleGrid";

// Define Event type based on the structure returned by `getEvents`
interface Event {
  id: string;
  name: string;
  startDate: string; // Full datetime string
  endDate: string; // Full datetime string
  location: string | null;
}

export default async function EventsPage() {
  // Fetch events data from the backend
  const events = await getEvents();

  // Pre-process the dates to keep them as full datetime strings
  const processedEvents: Event[] = events.map((event) => ({
    id: event.id,
    name: event.name,
    startDate: event.startDate.toISOString(), // Convert to ISO string
    endDate: event.endDate.toISOString(), // Convert to ISO string
    location: event.location,
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <EventForm />
      {/* Render the Schedule Grid */}
      <ScheduleGrid schedule={processedEvents} />
    </div>
  );
}
