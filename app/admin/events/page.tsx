import { getEvents } from "@/app/actions/admin";
import TableComponent from "@/components/admin/Table";
import { ColumnDef } from "@tanstack/react-table";
import { EventForm } from "../../../components/forms/eventForm";

// Event type definition
interface Event {
  name: string;
  date: string;
  location: string | null;
}

export default async function EventsPage() {
  const events = await getEvents();

  // Pre-process the dates on the server
  const processedEvents = events.map((event) => ({
    ...event,
    date: new Date(event.date).toLocaleDateString(),
  }));

  const eventColumns: ColumnDef<Event>[] = [
    { header: "Event Name", accessorKey: "name" },
    { header: "Date", accessorKey: "date" },
    { header: "Location", accessorKey: "location" },
  ];

  return (
    <div>
      <h1>Events</h1>
      {/* Render the event table */}
      <TableComponent data={processedEvents} columns={eventColumns} />

      {/* Render the Event Form */}
      <EventForm />
    </div>
  );
}
