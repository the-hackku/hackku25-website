"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconFilter,
  IconHeart,
  IconHeartFilled,
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
import { motion } from "framer-motion";
import { EventType } from "@prisma/client";

type ScheduleEvent = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string | null;
  description?: string;
  eventType: EventType;
};

type ScheduleGridProps = {
  schedule: ScheduleEvent[];
};

// Helper function to map an eventType to a specific color
const eventTypeColors: Record<EventType, string> = {
  FOOD: "bg-orange-400",
  REQUIRED: "bg-red-400",
  WORKSHOPS: "bg-green-400",
  SPONSOR: "bg-blue-400",
  ACTIVITIES: "bg-purple-400",
};

// Helper function to map slot index to a readable time format (e.g., "7:00 AM", "7:30 AM", etc.)
const formatTime = (index: number) => {
  const hour = Math.floor(index / 2) + 6; // Start from 7 AM
  const minutes = index % 2 === 0 ? "00" : "30";

  // Use a Date object to ensure consistent local time formatting
  const date = new Date();
  date.setHours(hour, parseInt(minutes), 0, 0); // Set local hours and minutes

  return date
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

const formatTimeForSlot = (startString: string, endString: string) => {
  const start = new Date(startString);
  const end = new Date(endString);

  const startTime = start
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(/\s/g, ""); // Remove any spaces
  const endTime = end
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(/\s/g, ""); // Remove any spaces

  // Remove the first "am" or "pm" if both times are the same period
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
  const sortedEvents = events.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const groups: ScheduleEvent[][] = [];

  for (const event of sortedEvents) {
    let placed = false;

    for (const group of groups) {
      // Check if the event overlaps with any event in the group
      if (group.some((e) => doEventsOverlap(e, event))) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      groups.push([event]); // Create a new group
    }
  }

  return groups;
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
    group.forEach((ev, eventIndex) => {
      overlapMap.set(ev.id, {
        groupIndex,
        eventIndex,
        groupSize: group.length,
      });
    });
  });

  return overlapMap;
}

// Updated getOverlapStyle function
function getOverlapStyle(
  eventIndex: number,
  groupSize: number
): React.CSSProperties {
  // Single event in the group
  if (groupSize === 1) {
    return {
      left: "0%",
      width: "100%",
    };
  }

  // Exactly two events in the group
  if (groupSize === 2) {
    if (eventIndex === 0) {
      // Bottommost event
      return {
        left: "0%",
        width: "80%",
      };
    } else {
      // Topmost event
      return {
        left: "50%",
        width: "45%",
      };
    }
  }

  // Exactly three events in the group
  if (groupSize === 3) {
    switch (eventIndex) {
      case 0:
        // Bottommost event
        return {
          left: "0%",
          width: "50%",
        };
      case 1:
        // Middle event
        return {
          left: "30%",
          width: "60%",
        };
      case 2:
        // Topmost event
        return {
          left: "60%",
          width: "35%",
        };
      default:
        // Fallback for unexpected indices
        return {
          left: "0%",
          width: "100%",
        };
    }
  }

  // For groups with more than three events, distribute them evenly
  const widthPercent = 100 / groupSize;
  const leftPercent = widthPercent * eventIndex;
  return {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`,
  };
}

// ... [Rest of the component code]

// Calculate the start row for the event based on its start time
const getRowIndex = (dateString: string) => {
  const date = new Date(dateString); // Ensure this parses as local time
  const hours = date.getHours(); // Local hours
  const minutes = date.getMinutes(); // Local minutes

  // Adjust for the grid start time (7 AM local time)
  return (hours - 6) * 2 + (minutes >= 30 ? 1 : 0);
};

// Calculate the number of rows to span based on event duration
const getRowSpan = (startString: string, endString: string) => {
  const start = new Date(startString);
  const end = new Date(endString);
  const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  // Each slot is 30 minutes
  return Math.max(1, durationInMinutes / 30);
};

// Format event time range as "Day, StartTime - EndTime"
const formatEventTimeRange = (startString: string, endString: string) => {
  const start = new Date(startString);
  const end = new Date(endString);

  const day = start.toLocaleDateString(undefined, { weekday: "long" });
  const startTime = start
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(/\s/g, ""); // Remove any spaces
  const endTime = end
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(/\s/g, ""); // Remove any spaces

  // Remove the first "am" or "pm" if both times are the same period
  const isSamePeriod = startTime.slice(-2) === endTime.slice(-2);
  const formattedStartTime = isSamePeriod ? startTime.slice(0, -2) : startTime;

  return `${day}, ${formattedStartTime} - ${endTime}`;
};

const ScheduleGrid = ({ schedule }: ScheduleGridProps) => {
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null
  );

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showFavoritesOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([
    "FOOD",
    "REQUIRED",
    "WORKSHOPS",
    "SPONSOR",
    "ACTIVITIES",
  ]);
  const [collapsed, setCollapsed] = useState(false);

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
    days.length > 0 ? days[0] : "" // Use the first day if available
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

  // Toggle favorite status for an event
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /**
   * FILTERING LOGIC
   * 1) Get all events across all days.
   * 2) If showFavoritesOnly is true, keep only favorites.
   * 3) If selectedEventTypes is non-empty, keep only matching event types.
   */
  const allEvents = days.flatMap((day) => groupedEvents[day]);

  // Filter by type
  const typedEvents =
    selectedEventTypes.length === 0
      ? [] // Show no events if no types are selected
      : allEvents.filter(
          (ev) =>
            ev.eventType &&
            selectedEventTypes.includes(ev.eventType as EventType)
        );

  // Filter by favorites
  const filteredEvents = showFavoritesOnly
    ? typedEvents.filter((ev) => favorites[ev.id])
    : typedEvents;

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

  const earliestEventIndex = dayEvents.length
    ? Math.min(...dayEvents.map((event) => getRowIndex(event.startDate)))
    : 0;

  const firstEventSlotIndex = Math.max(0, earliestEventIndex - 2);

  const slots = Array.from(
    { length: 38 - firstEventSlotIndex },
    (_, i) => i + firstEventSlotIndex
  );

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
    <div className="flex flex-col md:flex-row sm:gap-1 md:gap-3 p-4 h-screen md:max-h-[calc(100vh-4rem)]">
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
        className="overflow-y-scroll relative"
        style={
          !isMobile
            ? {
                flex: collapsed ? "1 1 100%" : "0 0 70%", // Full width when collapsed
              }
            : {}
        }
      >
        {/* Container for Tabs and Filter */}
        <div className="flex justify-between items-center space-x-4 bg-white sticky top-0 z-40 pb-2">
          <div className="flex justify-start w-full gap-2">
            <Tabs value={selectedDay} onValueChange={handleDayChange}>
              <TabsList>
                {!isMobile && <TabsTrigger value="All">Show All</TabsTrigger>}
                {days.map((date) => (
                  <TabsTrigger key={date} value={date}>
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "long",
                    })}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Popover for Filters */}
            <Popover>
              <PopoverTrigger>
                <div className="flex items-center relative cursor-pointer p-2 border rounded-lg shadow-sm">
                  <IconFilter size={18} />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-4 bg-white shadow-lg rounded-md w-fit">
                <h3 className="text-lg font-bold mb-3">Filter Options</h3>

                {/* Display count of filtered events */}
                <div className="text-sm text-gray-500 mb-2">
                  {filteredEvents.length} event
                  {filteredEvents.length !== 1 ? "s" : ""} found
                </div>

                {/* Event Type Filters (Multi-Select) */}
                <div className="border-t pt-2">
                  <div className="flex items-center mb-2">
                    <Checkbox
                      id="select-all-none"
                      checked={selectedEventTypes.length === 5} // Assume 5 is the total number of event types
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
                          // Select None
                          setSelectedEventTypes([]);
                        }
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor="select-all-none"
                      className="text-sm cursor-pointer"
                    >
                      Toggle All
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

        {/* Schedule Grid Table */}

        <table className="table-fixed w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
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
              <tr key={slotIndex} className="h-8">
                <td
                  className={`relative border-r border-gray-300 overflow-visible text-xs ${
                    slotIndex % 2 === 0 ? "" : "border-b border-solid"
                  }`}
                >
                  {slotIndex % 2 === 0 ? formatTime(slotIndex) : ""}
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
                          (event) => getRowIndex(event.startDate) === slotIndex
                        )
                        .map((event) => {
                          const rowSpan = getRowSpan(
                            event.startDate,
                            event.endDate
                          );
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
                              className={`absolute inset-0 rounded-md p-1 overflow-hidden cursor-pointer text-white
                                transition-shadow duration-200
                                ${colorClass}
                                ${
                                  isSelected
                                    ? "shadow-xl z-20"
                                    : "hover:shadow-sm shadow-sm z-10"
                                }
                              `}
                              style={{
                                // Vertical placement from your existing logic
                                gridRow: `span ${rowSpan}`,
                                height: `${rowSpan * 2}rem`,
                                // Horizontal placement from overlap logic
                                position: "absolute", // ensure absolute so `left`/`width` apply
                                ...overlapStyle,
                              }}
                            >
                              <span className="flex-col gap-0">
                                <p className="text-sm font-bold">
                                  {event.name}
                                </p>
                                <div className="text-xs flex items-center">
                                  {formatTimeForSlot(
                                    event.startDate,
                                    event.endDate
                                  )}
                                </div>
                              </span>
                              <div className="text-xs flex items-center">
                                <IconMapPin size={12} className="mr-1" />
                                {event.location || "TBA"}
                              </div>
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
      <motion.div
        className={`relative w-full ${
          isMobile
            ? " overflow-visible  inset-x-0 absolute bottom-0"
            : collapsed
            ? "hidden"
            : "block"
        }`}
        animate={isMobile ? { height: selectedEvent ? "80vh" : "0vh" } : {}}
        initial={isMobile ? { height: "0%", opacity: 0 } : {}}
        transition={{ duration: 0.3 }}
      >
        {selectedEvent && (
          <div className="p-4 bg-white w-full rounded-lg shadow-sm border border- md:h-full flex flex-col justify-between">
            {/* Top Section: Event Details */}
            <div>
              <h2 className="text-xl font-bold flex justify-between">
                {selectedEvent.name}
                <span className="flex items-center gap-2">
                  {/* Favorite Toggle */}
                  <span
                    onClick={() => toggleFavorite(selectedEvent.id)}
                    className="cursor-pointer"
                  >
                    {favorites[selectedEvent.id] ? (
                      <IconHeartFilled className="text-red-400" />
                    ) : (
                      <IconHeart className="text-gray-400" />
                    )}
                  </span>

                  {isMobile && (
                    <span
                      onClick={() => setSelectedEvent(null)}
                      className="cursor-pointer"
                    >
                      <IconX className="text-gray-400" />
                    </span>
                  )}

                  {/* Close Button */}
                </span>
              </h2>

              <p className="text-sm text-gray-500">
                {formatEventTimeRange(
                  selectedEvent.startDate,
                  selectedEvent.endDate
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

              <hr className="my-2" />
              <div className="flex items-center mt-2">
                <IconMapPin size={20} className="text-gray-400 mr-2" />
                <span>{selectedEvent.location || "TBA"}</span>
              </div>
              {selectedEvent.description && (
                <div className="flex items-center mt-2">
                  <IconInfoCircle size={20} className="text-gray-400 mr-2" />
                  {selectedEvent.description}
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
    </div>
  );
};

export default ScheduleGrid;
