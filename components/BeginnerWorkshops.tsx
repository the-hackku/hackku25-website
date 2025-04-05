"use client";
import React from "react";
import { EventType } from "@prisma/client";
import {
  IconMapPin,
  IconCalendar,
  IconInfoCircle,
  IconClock,
} from "@tabler/icons-react";
import Link from "next/link";

type ScheduleEvent = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string | null;
  description: string | null;
  eventType: EventType;
};

type BeginnerWorkshopsProps = {
  schedule: ScheduleEvent[];
};

function formatTimeRange(startString: string, endString: string) {
  // Same formatTimeRange function...
  const start = new Date(startString);
  const end = new Date(endString);

  const startTime = start
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(/\s/g, "");

  const endTime = end
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(/\s/g, "");

  const isSamePeriod = startTime.slice(-2) === endTime.slice(-2);
  const formattedStartTime = isSamePeriod ? startTime.slice(0, -2) : startTime;

  return `${formattedStartTime} - ${endTime}`;
}

// Function to generate gradient styles based on position
function getGradientStyle(index: number, total: number) {
  // Calculate position percentage
  const position = total > 1 ? index / (total - 1) : 0;

  // Start with blue, transition to purple
  const startColor = "rgba(59, 130, 246, 0.8)"; // blue-500 with opacity
  const endColor = "rgba(139, 92, 246, 0.8)"; // purple-500 with opacity

  return {
    borderImage: `linear-gradient(to bottom, ${startColor} ${
      position * 100
    }%, ${endColor} ${position * 100}%) 1`,
    background: `linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%)`,
    transition: "transform 0.2s, box-shadow 0.2s",
  };
}

const BeginnerWorkshops: React.FC<BeginnerWorkshopsProps> = ({ schedule }) => {
  // Sort events chronologically
  const sortedEvents = [...schedule].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  if (schedule.length === 0) {
    return (
      <div className="border rounded-md p-4 mt-8">
        <h2 className="text-lg font-bold mb-2">
          Pre-Hackathon Beginner Workshop Series:
        </h2>
        <p className="text-gray-500">
          No beginner events found before this date.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4 mt-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex flex-row justify-between align-middle mb-4">
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          🎓 Pre-Hackathon Beginner Workshop Series:
        </h2>
        <span className="text-gray-700 hover:text-black">
          <Link href="/info?section=resources">View Workshop Recordings</Link>
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
        {sortedEvents.map((ev, index) => {
          const hasPassed = new Date(ev.endDate) < new Date();
          return (
            <div
              key={ev.id}
              className={`p-3 rounded-md ${
                hasPassed
                  ? "opacity-50 grayscale hover:cursor-not-allowed"
                  : "shadow-sm hover:shadow-md hover:transform hover:scale-102"
              }`}
              style={getGradientStyle(index, sortedEvents.length)}
            >
              <div className="flex items-center text-sm text-gray-600">
                <IconCalendar size={18} className="mr-1" />
                {new Date(ev.startDate).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <span className="inline-flex flex-wrap md:flex-row flex-col items-center text-left">
                <p className="text-sm font-bold whitespace-normal break-words mr-1">
                  {ev.name}
                </p>
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <IconClock size={14} className="mr-1" />
                <span> {formatTimeRange(ev.startDate, ev.endDate)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <IconMapPin size={14} className="mr-1" />
                <span>{ev.location || "TBA"}</span>
              </div>
              <div className="flex items-start text-sm text-gray-500">
                <IconInfoCircle
                  size={16}
                  className="mr-1 flex-shrink-0 mt-0.5"
                />
                <span className="overflow-y-scroll max-h-32">
                  {ev.description || "TBA"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BeginnerWorkshops;
