// components/ScheduleGrid.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";

type ScheduleGridProps = {
  schedule: {
    id: string;
    name: string;
    date: string;
    location: string | null;
  }[];
};

// A component to display events in a grid layout
const ScheduleGrid = ({ schedule }: ScheduleGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {schedule.map((event) => (
        <Card
          key={event.id}
          className="flex flex-col justify-between p-4 shadow-lg"
        >
          <div>
            <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
            <p className="text-gray-600">
              {/* Format the date string properly */}
              {new Date(event.date).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">{event.location || "TBA"}</p>
            {event.name.toLowerCase().includes("ceremony") && (
              <Badge className="ml-2" variant="outline">
                Main Event
              </Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ScheduleGrid;
