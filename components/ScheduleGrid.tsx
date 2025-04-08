"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconFilter,
  IconMapPin,
  IconInfoCircle,
  IconTag,
  IconChevronRight,
  IconChevronLeft,
  IconX,
} from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "./ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { EventType } from "@prisma/client";
import { Input } from "./ui/input";

type ScheduleEvent = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string | null;
  description: string | null;
  eventType: EventType;
};

type ScheduleGridProps = {
  schedule: ScheduleEvent[];
};

// Helper function to map an eventType to a specific color
const eventTypeColors: Record<EventType, string> = {
  FOOD: "bg-orange-400",
  REQUIRED: "bg-red-400",
  WORKSHOPS: "bg-green-500",
  SPONSOR: "bg-blue-400",
  ACTIVITIES: "bg-purple-400",
};

const eventTypeDarkerColors: Record<EventType, string> = {
  FOOD: "#f97316", // darker than bg-orange-400
  REQUIRED: "#ef4444", // darker than bg-red-400
  WORKSHOPS: "#16a34a", // darker than bg-green-500
  SPONSOR: "#3b82f6", // darker than bg-blue-400
  ACTIVITIES: "#8b5cf6", // darker than bg-purple-400
};

// Helper function to map slot index to a readable time format (e.g., "7:00 AM", "7:30 AM", etc.)
const formatTime = (
  index: number,
  baseHour: number,
  timezone: "local" | "central"
) => {
  const hour = Math.floor(index / 2) + baseHour;
  const minutes = index % 2 === 0 ? 0 : 30;
  const date = new Date();
  date.setHours(hour, minutes, 0, 0);

  return date
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone === "central" ? "America/Chicago" : undefined,
    })
    .toLowerCase();
};

const getRowIndex = (dateString: string, baseHour: number) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  // If the hour is less than the base, assume the time is past midnight.
  if (hours < baseHour) {
    hours += 24;
  }
  return (hours - baseHour) * 2 + (minutes >= 30 ? 1 : 0);
};

const formatTimeForSlot = (
  startString: string,
  endString: string,
  timezone: "local" | "central"
) => {
  const start = new Date(startString);
  const end = new Date(endString);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone === "central" ? "America/Chicago" : undefined,
  };

  const startTime = start
    .toLocaleTimeString(undefined, options)
    .toLowerCase()
    .replace(/\s/g, "");
  const endTime = end
    .toLocaleTimeString(undefined, options)
    .toLowerCase()
    .replace(/\s/g, "");

  const isSamePeriod = startTime.slice(-2) === endTime.slice(-2);
  const formattedStartTime = isSamePeriod ? startTime.slice(0, -2) : startTime;

  return `${formattedStartTime} - ${endTime}`;
};

// Helper function to check if two events overlap
const doEventsOverlap = (a: ScheduleEvent, b: ScheduleEvent) => {
  const startA = new Date(a.startDate).getTime(); // Convert to milliseconds
  const endA = new Date(a.endDate).getTime();
  const startB = new Date(b.startDate).getTime();
  const endB = new Date(b.endDate).getTime();

  // Check if the two events overlap
  return startA < endB && startB < endA; // No overlap if one ends before the other starts
};

// Function to group overlapping events
const groupOverlappingEvents = (events: ScheduleEvent[]): ScheduleEvent[][] => {
  const parent: Record<string, string> = {};

  const find = (x: string): string => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };

  const union = (a: string, b: string) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      parent[rootB] = rootA;
    }
  };

  // Initialize disjoint sets
  for (const event of events) {
    parent[event.id] = event.id;
  }

  // Merge overlapping sets
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      if (doEventsOverlap(events[i], events[j])) {
        union(events[i].id, events[j].id);
      }
    }
  }

  // Group by root parent
  const groups: Record<string, ScheduleEvent[]> = {};
  for (const event of events) {
    const root = find(event.id);
    if (!groups[root]) {
      groups[root] = [];
    }
    groups[root].push(event);
  }

  return Object.values(groups);
};

type OverlapInfo = {
  groupIndex: number;
  eventIndex: number;
  groupSize: number;
};

function buildOverlapMap(events: ScheduleEvent[]): Map<string, OverlapInfo> {
  const overlapMap = new Map<string, OverlapInfo>();
  const groups = groupOverlappingEvents(events);

  groups.forEach((group, groupIndex) => {
    const sortedGroup = group.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const columns: ScheduleEvent[][] = [];

    for (const event of sortedGroup) {
      let placed = false;

      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const col = columns[colIndex];
        const lastInCol = col[col.length - 1];

        if (
          new Date(event.startDate).getTime() >=
          new Date(lastInCol.endDate).getTime()
        ) {
          col.push(event);
          overlapMap.set(event.id, {
            groupIndex,
            eventIndex: colIndex,
            groupSize: 0, // we'll fix this later
          });
          placed = true;
          break;
        }
      }

      if (!placed) {
        columns.push([event]);
        overlapMap.set(event.id, {
          groupIndex,
          eventIndex: columns.length - 1,
          groupSize: 0, // will fix later
        });
      }
    }

    // Fix groupSize now that we know total columns
    const totalColumns = columns.length;
    for (const col of columns) {
      for (const ev of col) {
        const info = overlapMap.get(ev.id);
        if (info) {
          info.groupSize = totalColumns;
        }
      }
    }
  });

  return overlapMap;
}

// Updated getOverlapStyle function
function getOverlapStyle(
  eventIndex: number,
  groupSize: number
): React.CSSProperties {
  const widthPercent = 100 / groupSize;
  const leftPercent = widthPercent * eventIndex;

  return {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`,
    zIndex: 10,
  };
}

// Calculate the number of rows to span based on event duration
const getRowSpan = (
  startString: string,
  endString: string
): { span: number; duration: number } => {
  const start = new Date(startString);
  const end = new Date(endString);
  const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  return {
    span: Math.max(1, durationInMinutes / 30),
    duration: durationInMinutes,
  };
};

// Format event time range as "Day, StartTime - EndTime"
const formatEventTimeRange = (
  startString: string,
  endString: string,
  timezone: "local" | "central"
) => {
  const start = new Date(startString);
  const end = new Date(endString);

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: timezone === "central" ? "America/Chicago" : undefined,
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone === "central" ? "America/Chicago" : undefined,
  };

  const day = start.toLocaleDateString(undefined, dateOptions);
  const startTime = start
    .toLocaleTimeString(undefined, timeOptions)
    .toLowerCase()
    .replace(/\s/g, "");
  const endTime = end
    .toLocaleTimeString(undefined, timeOptions)
    .toLowerCase()
    .replace(/\s/g, "");

  const isSamePeriod = startTime.slice(-2) === endTime.slice(-2);
  const formattedStartTime = isSamePeriod ? startTime.slice(0, -2) : startTime;

  return `${day}, ${formattedStartTime} - ${endTime}`;
};

const MobileEventDrawer = ({
  event,
  onClose,
  timezoneMode,
}: {
  event: ScheduleEvent | null;
  onClose: () => void;
  timezoneMode: "local" | "central";
}) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.2 }}
        className="fixed rounded-md inset-x-0 bottom-0 z-50 h-[40vh] overflow-hidden shadow-2xl p-5 bg-gray-200"
        style={{
          boxShadow: `inset 0 0 0 2px ${
            eventTypeDarkerColors[event.eventType]
          }`,
        }}
      >
        <div
          className="fixed rounded-md inset-x-0 bottom-0 z-50 h-[40vh] overflow-hidden shadow-2xl p-5 bg-gray-200"
          style={{
            boxShadow: `inset 0 0 0 2px ${
              eventTypeDarkerColors[event.eventType]
            }`,
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">{event.name}</h2>
            <button onClick={onClose}>
              <IconX />
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            {formatEventTimeRange(event.startDate, event.endDate, timezoneMode)}
          </p>

          {event.eventType && (
            <div className="flex items-center mb-2">
              <IconTag size={16} className="text-gray-400 mr-2" />
              <span className="text-sm capitalize">
                {event.eventType.toLowerCase()}
              </span>
            </div>
          )}

          {event.location && (
            <div className="flex items-start mb-2">
              <IconMapPin size={14} className="text-gray-400 mr-2 mt-0.5" />
              <span className="text-sm">{event.location}</span>
            </div>
          )}

          {event.description && (
            <div className="flex items-start">
              <IconInfoCircle size={14} className="text-gray-400 mr-2 mt-0.5" />
              <p className="text-sm whitespace-pre-wrap overflow-y-scroll">
                {event.description}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const ScheduleGrid = ({ schedule }: ScheduleGridProps) => {
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null
  );
  const [favorites] = useState<Record<string, boolean>>({});
  const [showFavoritesOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([
    "FOOD",
    "REQUIRED",
    "WORKSHOPS",
    "SPONSOR",
    "ACTIVITIES",
  ]);
  const [collapsed, setCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timezoneMode, setTimezoneMode] = useState<"local" | "central">(
    "central"
  );

  const scheduleGridRef = useRef<HTMLDivElement | null>(null);

  // Group events by date
  const groupedEvents = schedule.reduce((acc, event) => {
    // Format the event start date as a local date string
    const eventDate = new Date(event.startDate).toLocaleDateString("en-US"); // Use local time zone by default
    if (!acc[eventDate]) acc[eventDate] = [];
    acc[eventDate].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

  const days = Object.keys(groupedEvents).sort();

  const [selectedDay, setSelectedDay] = useState<string>(
    "All" // Default to "All"
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper function to get the next event based on the current event
  const getNextEvent = (currentEvent: ScheduleEvent | null) => {
    if (!currentEvent) return null;
    const currentIndex = filteredEvents.findIndex(
      (event) => event.id === currentEvent.id
    );
    return currentIndex >= 0 && currentIndex < filteredEvents.length - 1
      ? filteredEvents[currentIndex + 1]
      : null;
  };

  // Helper function to get the previous event based on the current event
  const getPreviousEvent = (currentEvent: ScheduleEvent | null) => {
    if (!currentEvent) return null;
    const currentIndex = filteredEvents.findIndex(
      (event) => event.id === currentEvent.id
    );
    return currentIndex > 0 ? filteredEvents[currentIndex - 1] : null;
  };

  // Handle changing day tabs
  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    if (day !== "All") {
      setSelectedEvent(null);
    }
  };

  /**
   * FILTERING LOGIC
   * 1) Get all events across all days.
   * 2) If showFavoritesOnly is true, keep only favorites.
   * 3) If selectedEventTypes is non-empty, keep only matching event types.
   */
  const allEvents = days.flatMap((day) => groupedEvents[day]);

  // Filter by type
  const filteredEvents = React.useMemo(() => {
    const typedEvents =
      selectedEventTypes.length === 0
        ? [] // Show no events if no types are selected
        : allEvents.filter(
            (ev) =>
              ev.eventType &&
              selectedEventTypes.includes(ev.eventType as EventType)
          );

    const favoriteFiltered = showFavoritesOnly
      ? typedEvents.filter((ev) => favorites[ev.id])
      : typedEvents;

    return favoriteFiltered.filter((event) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        event.name.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower)
      );
    });
  }, [
    showFavoritesOnly,
    selectedEventTypes,
    allEvents,
    favorites,
    searchQuery,
  ]);

  // Regroup after filtering
  const filteredGroupedEvents = filteredEvents.reduce((acc, event) => {
    const eventDate = new Date(event.startDate).toLocaleDateString("en-US"); // Use local time
    if (!acc[eventDate]) acc[eventDate] = [];
    acc[eventDate].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

  // Build an overlapMap for each day after we've filtered
  const overlapMaps = React.useMemo(() => {
    const maps: Record<string, Map<string, OverlapInfo>> = {};
    for (const day of Object.keys(filteredGroupedEvents)) {
      maps[day] = buildOverlapMap(filteredGroupedEvents[day]);
    }
    return maps;
  }, [filteredGroupedEvents]);

  // Determine earliest event index based on selected day
  const dayEvents =
    selectedDay === "All"
      ? filteredEvents
      : filteredGroupedEvents[selectedDay] || [];

  // Determine base hour (earliest event start hour)
  const baseHour = dayEvents.length
    ? Math.min(
        ...dayEvents.map((event) => new Date(event.startDate).getHours())
      )
    : 6;

  // Define timezone-aware end-of-day
  const getEndOfDaySlot = (events: ScheduleEvent[]) => {
    const date = new Date(events[0]?.startDate || Date.now());
    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // 11:59 PM

    const base = new Date(date);
    base.setHours(baseHour, 0, 0, 0);

    const diffMinutes = (end.getTime() - base.getTime()) / (1000 * 60);
    return Math.ceil(diffMinutes / 30) + 1; // Add one more slot to include final half-hour
  };

  const numberOfSlots = getEndOfDaySlot(dayEvents);
  const slots = Array.from({ length: numberOfSlots }, (_, i) => i);
  // Handle multi-select of event types
  const handleEventTypeChange = (type: EventType, checked: boolean) => {
    setSelectedEventTypes((prev) => {
      if (checked) {
        // Add type
        return [...prev, type];
      } else {
        // Remove type
        return prev.filter((t) => t !== type);
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row sm:gap-1 md:gap-3 p-2 h-[calc(100vh-6rem)]">
      <div
        ref={scheduleGridRef}
        className="flex-1 flex-col gap-2 md:mb-0 h-[calc(100vh-10rem)] md:h-full md:overflow-y-hidden"
        style={{
          flex: collapsed ? "1 1 100%" : "0 0 75%",
        }}
      >
        <div className="flex justify-between items-center space-x-4 pb-2 bg-white sticky top-0 z-40">
          <div className="flex justify-start w-full gap-2">
            <Tabs value={selectedDay} onValueChange={handleDayChange}>
              <TabsList>
                {!isMobile && <TabsTrigger value="All">Show All</TabsTrigger>}
                {days.map((date) => (
                  <TabsTrigger key={date} value={date}>
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {!isMobile && (
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 border text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IconX size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Popover for Filters */}
            <Popover>
              <PopoverTrigger>
                <div className="border p-2 rounded-md cursor-pointer">
                  <IconFilter size={18} />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-4 bg-white shadow-lg rounded-md w-fit">
                {/* Display count of filtered events */}
                <div className="text-sm text-gray-500 mb-2">
                  {filteredEvents.length} event
                  {filteredEvents.length !== 1 ? "s" : ""} found
                </div>

                {/* Event Type Filters (Multi-Select) */}
                <div className="border-t pt-2">
                  <div className="flex items-center mb-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedEventTypes.length === 5}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Select All
                          setSelectedEventTypes([
                            "FOOD",
                            "REQUIRED",
                            "WORKSHOPS",
                            "SPONSOR",
                            "ACTIVITIES",
                          ] as EventType[]);
                        } else {
                          // Deselect All
                          setSelectedEventTypes([]);
                        }
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm cursor-pointer"
                    >
                      {selectedEventTypes.length === 5
                        ? "Deselect All"
                        : "Select All"}
                    </label>
                  </div>

                  {(
                    [
                      "FOOD",
                      "REQUIRED",
                      "WORKSHOPS",
                      "SPONSOR",
                      "ACTIVITIES",
                    ] as EventType[]
                  ).map((type) => (
                    <div key={type} className="flex items-center mb-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedEventTypes.includes(type)}
                        onCheckedChange={(checked) =>
                          handleEventTypeChange(type, checked === true)
                        }
                        className="mr-2"
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className={`text-sm cursor-pointer ${
                          eventTypeColors[type] // Dynamically apply the background color class
                        } text-white rounded-md px-2 py-1`}
                      >
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).toLowerCase()}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {!isMobile && (
              <div
                className="flex items-center gap-2 text-xs border px-2 py-1 rounded-md hover:cursor-pointer"
                onClick={() =>
                  setTimezoneMode(
                    timezoneMode === "local" ? "central" : "local"
                  )
                }
              >
                <span className="font-medium w-[60px] text-center">
                  🕒 {timezoneMode === "local" ? "Local" : "Central"}
                </span>
              </div>
            )}
          </div>

          {!isMobile && (
            <span
              onClick={() => setCollapsed(!collapsed)}
              className="ml-4 cursor-pointer"
            >
              {collapsed ? (
                <IconChevronLeft size={24} />
              ) : (
                <IconChevronRight size={24} />
              )}
            </span>
          )}
        </div>
        {/* LEFT SECTION: Schedule Grid */}
        <motion.div
          ref={scheduleGridRef}
          // Animate width on desktop, height on mobile
          animate={
            selectedEvent
              ? isMobile
                ? { height: "66%" }
                : {}
              : isMobile
              ? { height: "100%" }
              : {}
          }
          transition={{ duration: 0.2 }}
          className="overflow-y-scroll relative h-full"
          style={
            !isMobile
              ? {
                  flex: collapsed ? "1 1 100%" : "0 0 75%", // Full width when collapsed
                }
              : {}
          }
        >
          {/* Container for Tabs and Filter */}

          {/* Schedule Grid Table */}

          <table className="table-fixed w-full border-collapse h-full">
            <thead className="sticky top-0 bg-gray-100 z-50 border-b">
              <tr>
                <th className="w-16"></th>
                {selectedDay === "All" ? (
                  days.map((date) => (
                    <th key={date} className="p-2 text-center">
                      {new Date(date).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </th>
                  ))
                ) : (
                  <th className="p-2 text-center">
                    {new Date(selectedDay).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </th>
                )}
              </tr>
            </thead>

            <tbody onClick={() => setSelectedEvent(null)}>
              {slots.map((slotIndex) => (
                <tr key={slotIndex} className="h-12">
                  <td
                    className={`relative border-r border-gray-300 overflow-visible text-xs ${
                      slotIndex % 2 === 0 ? "" : "border-b border-solid"
                    }`}
                  >
                    {slotIndex % 2 === 0
                      ? formatTime(slotIndex, baseHour, timezoneMode)
                      : ""}
                  </td>
                  {(selectedDay === "All" ? days : [selectedDay]).map((day) => {
                    const dayOverlapMap = overlapMaps[day]; // get the overlap map for this day

                    return (
                      <td
                        key={day}
                        className={`relative border-r border-gray-300 overflow-visible ${
                          slotIndex % 2 === 0 ? "" : "border-b border-solid"
                        }`}
                        style={{
                          borderRightStyle: "dashed",
                        }}
                      >
                        {filteredGroupedEvents[day]
                          ?.filter(
                            (event) =>
                              getRowIndex(event.startDate, baseHour) ===
                              slotIndex
                          )
                          .map((event) => {
                            const { span: rowSpan, duration } = getRowSpan(
                              event.startDate,
                              event.endDate
                            );
                            const descriptionLineClamp = Math.floor(
                              duration / 30
                            ); // 1 line per 10 minutes

                            const isSelected = selectedEvent?.id === event.id;
                            const colorClass = event.eventType
                              ? eventTypeColors[event.eventType]
                              : "bg-gray-400";

                            // Look up this event's overlap info
                            const overlapInfo = dayOverlapMap?.get(event.id);
                            let overlapStyle: React.CSSProperties = {};

                            if (overlapInfo) {
                              overlapStyle = getOverlapStyle(
                                overlapInfo.eventIndex,
                                overlapInfo.groupSize
                              );
                            } else {
                              // Default if not found in map
                              overlapStyle = { left: "0%", width: "100%" };
                            }

                            return (
                              <div
                                key={event.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(isSelected ? null : event);
                                }}
                                className={`absolute inset-0 z-10 rounded-md p-1 overflow-hidden cursor-pointer text-white
                                ${colorClass}
                                ${
                                  isSelected
                                    ? "ring-2 ring-white/80 shadow-xl after:absolute after:inset-0 after:bg-black after:opacity-5"
                                    : ""
                                }
                                
                              `}
                                style={{
                                  gridRow: `span ${rowSpan}`,
                                  height: `${rowSpan * 3}rem`, // for h-12
                                  position: "absolute",
                                  ...overlapStyle,
                                  boxShadow: isSelected
                                    ? `inset 0 0 0 2px ${
                                        eventTypeDarkerColors[
                                          event.eventType
                                        ] || "black"
                                      }`
                                    : `inset 0 0 0 0.5px ${
                                        eventTypeDarkerColors[
                                          event.eventType
                                        ] || "black"
                                      }`,
                                }}
                              >
                                {/* Event content */}
                                <span
                                  className={`inline-flex flex-wrap items-start text-left ${
                                    (isMobile || selectedDay === "All") &&
                                    overlapInfo &&
                                    overlapInfo.groupSize > 1
                                      ? "flex-col"
                                      : "flex-row items-center"
                                  }`}
                                >
                                  <p className="text-sm font-bold whitespace-normal break-words mr-1">
                                    {event.name}
                                  </p>
                                  <div className="text-xs text-white/90 whitespace-nowrap">
                                    {formatTimeForSlot(
                                      event.startDate,
                                      event.endDate,
                                      timezoneMode
                                    )}
                                  </div>
                                </span>

                                <div className="text-xs flex items-start">
                                  <IconMapPin
                                    size={12}
                                    className="mr-1 flex-shrink-0 mt-0.5"
                                  />
                                  <span className="truncate">
                                    {event.location || "TBA"}
                                  </span>
                                </div>
                                {duration > 30 && event.description && (
                                  <div className="text-xs flex items-start">
                                    <IconInfoCircle
                                      size={12}
                                      className="mr-1 flex-shrink-0 mt-0.5"
                                    />
                                    <span
                                      className="overflow-hidden text-ellipsis"
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: descriptionLineClamp,
                                        WebkitBoxOrient: "vertical",
                                      }}
                                    >
                                      <em>{event.description}</em>
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
      {/* Draggable Divider */}
      {!isMobile && !collapsed && (
        <div
          className="bg-gray-300 w-1 cursor-col-resize transition-all duration-100 
             hover:bg-gray-400"
          style={{
            flexShrink: 0, // Prevent shrinking
            flexGrow: 0, // Prevent growing
          }}
          onMouseDown={(e) => {
            e.preventDefault();

            const startX = e.clientX;
            const parentWidth =
              scheduleGridRef.current?.parentElement?.getBoundingClientRect()
                .width || 0;
            const startLeftWidth =
              scheduleGridRef.current?.getBoundingClientRect().width || 0;

            const handleMouseMove = (e: MouseEvent) => {
              const delta = e.clientX - startX;
              const newLeftWidth = Math.max(
                parentWidth * 0.4,
                Math.min(parentWidth * 0.75, startLeftWidth + delta)
              );

              if (scheduleGridRef.current) {
                scheduleGridRef.current.style.flex = `0 0 ${newLeftWidth}px`;
              }
            };

            const handleMouseUp = () => {
              window.removeEventListener("mousemove", handleMouseMove);
              window.removeEventListener("mouseup", handleMouseUp);
            };

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
          }}
        ></div>
      )}

      {/* RIGHT SECTION: Event Details */}
      {isMobile ? (
        <MobileEventDrawer
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          timezoneMode={timezoneMode}
        />
      ) : (
        <motion.div
          className={`relative w-full ${
            isMobile
              ? " overflow-visible  inset-x-0 absolute bottom-0"
              : collapsed
              ? "hidden"
              : "block"
          }`}
          animate={isMobile ? { height: selectedEvent ? "65vh" : "0vh" } : {}}
          initial={isMobile ? { height: "0%", opacity: 0 } : {}}
          transition={{ duration: 0.3 }}
        >
          {selectedEvent && (
            <div
              className="p-4 w-full rounded-lg shadow-sm border md:h-full flex flex-col justify-between"
              style={{
                borderColor: selectedEvent.eventType
                  ? eventTypeDarkerColors[selectedEvent.eventType]
                  : "#e5e7eb",
                borderWidth: "2px",
                backgroundColor: selectedEvent.eventType
                  ? `${eventTypeDarkerColors[selectedEvent.eventType]}1A` // 1A = 10% alpha in hex
                  : "white",
              }}
            >
              {/* Top Section: Event Details */}
              <div>
                <h2 className="text-xl font-bold flex justify-between">
                  {selectedEvent.name}
                  <span className="flex items-center gap-2">
                    {isMobile && (
                      <span
                        onClick={() => setSelectedEvent(null)}
                        className="cursor-pointer"
                      >
                        <IconX />
                      </span>
                    )}
                    {/* Close Button */}
                  </span>
                </h2>

                <p className="text-sm text-gray-500">
                  {formatEventTimeRange(
                    selectedEvent.startDate,
                    selectedEvent.endDate,
                    timezoneMode
                  )}
                </p>

                {/* Display Event Type */}
                {selectedEvent.eventType && (
                  <div className="flex items-center mt-2">
                    <IconTag size={20} className="text-gray-400 mr-2" />
                    <span>
                      {selectedEvent.eventType.charAt(0).toUpperCase() +
                        selectedEvent.eventType.slice(1).toLowerCase()}
                    </span>
                  </div>
                )}

                <hr
                  className="my-2 border-t opacity-40"
                  style={{
                    borderColor: selectedEvent.eventType
                      ? eventTypeDarkerColors[selectedEvent.eventType]
                      : "#e5e7eb", // fallback border color
                  }}
                />

                <div className="flex items-center mt-2">
                  <IconMapPin
                    size={20}
                    className="text-gray-400 mr-2 flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm overflow-hidden text-ellipsis break-words">
                    {selectedEvent.location || "TBA"}
                  </span>
                </div>
                {selectedEvent.description && (
                  <div className="flex items-start mt-2">
                    <IconInfoCircle
                      size={20}
                      className="text-gray-400 mr-2 flex-shrink-0 mt-0.5"
                    />
                    <div
                      className="text-sm overflow-y-scroll pr-1"
                      style={{
                        maxHeight: isMobile ? "40px" : "40vh", // Adjust as needed
                      }}
                    >
                      {selectedEvent.description}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Section: Previous/Next Buttons */}
              {!isMobile && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <button
                    onClick={() => {
                      if (getPreviousEvent(selectedEvent)) {
                        setSelectedEvent(getPreviousEvent(selectedEvent));
                      }
                    }}
                    className={`${
                      !getPreviousEvent(selectedEvent)
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:text-gray-900 focus:outline-none"
                    } `}
                    disabled={!getPreviousEvent(selectedEvent)}
                  >
                    &larr; Previous
                  </button>
                  <button
                    onClick={() => {
                      if (getNextEvent(selectedEvent)) {
                        setSelectedEvent(getNextEvent(selectedEvent));
                      }
                    }}
                    className={`${
                      !getNextEvent(selectedEvent)
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:text-gray-900 focus:outline-none"
                    } `}
                    disabled={!getNextEvent(selectedEvent)}
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {
            // Show placeholder if no event is selected
            !selectedEvent && !isMobile && (
              <div className="text-center text-gray-500 p-4">
                Select an event to view more details
              </div>
            )
          }
        </motion.div>
      )}
    </div>
  );
};

export default ScheduleGrid;
