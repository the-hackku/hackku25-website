"use client";
import React, { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconFilter,
  IconHeart,
  IconHeartFilled,
  IconMapPin,
  IconChevronDown,
  IconX,
  IconListDetails,
} from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "./ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";

type ScheduleGridProps = {
  schedule: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    location: string | null;
    description?: string;
  }[];
};

// Helper function to map slot index to a readable time format (e.g., "7:00 AM", "7:30 AM", etc.)
const formatTime = (index: number) => {
  const hour = Math.floor(index / 2) + 7; // Calculate hour starting from 7 AM
  const minutes = index % 2 === 0 ? "00" : "30";
  const adjustedHour = hour % 24; // Ensure hour stays within 24-hour format

  // Convert 24-hour format to 12-hour format, handling 12 AM and 12 PM correctly
  const displayHour =
    adjustedHour === 0
      ? 12
      : adjustedHour > 12
      ? adjustedHour - 12
      : adjustedHour;
  const period = adjustedHour >= 12 && adjustedHour < 24 ? "PM" : "AM";

  return `${displayHour}:${minutes} ${period}`;
};

// Calculate the start row for the event based on its start time
const getRowIndex = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours() - 7; // Use local hours instead of UTC hours
  const minutes = date.getMinutes(); // Use local minutes instead of UTC minutes
  return hours * 2 + (minutes >= 30 ? 1 : 0);
};

// Calculate the number of rows to span based on event duration
const getRowSpan = (startString: string, endString: string) => {
  const start = new Date(startString);
  const end = new Date(endString);
  const duration = (end.getTime() - start.getTime()) / (1000 * 60);
  return Math.max(1, duration / 30);
};

// Format event time range as "Day, StartTime - EndTime"
const formatEventTimeRange = (startString: string, endString: string) => {
  const start = new Date(startString);
  const end = new Date(endString);

  const day = start.toLocaleDateString(undefined, { weekday: "long" });
  const startTime = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${day}, ${startTime} - ${endTime}`;
};

const ScheduleGrid = ({ schedule }: ScheduleGridProps) => {
  const [selectedEvent, setSelectedEvent] = useState<
    ScheduleGridProps["schedule"][0] | null
  >(null);
  const [selectedDay, setSelectedDay] = useState("All");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const scheduleGridRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Group events by date
  const groupedEvents = schedule.reduce((acc, event) => {
    const eventDate = new Date(event.startDate).toLocaleDateString("en-US", {
      timeZone: "UTC",
    });
    if (!acc[eventDate]) acc[eventDate] = [];
    acc[eventDate].push(event);
    return acc;
  }, {} as Record<string, ScheduleGridProps["schedule"]>);

  const days = Object.keys(groupedEvents).sort();

  useEffect(() => {
    if (days.length > 0 && selectedDay === "") {
      setSelectedDay(days[0]);
    }
  }, [days, selectedDay]);

  useEffect(() => {
    const handleScroll = () => {
      if (scheduleGridRef.current && scheduleGridRef.current.scrollTop > 10) {
        setHasScrolled(true);
      }
    };
    const div = scheduleGridRef.current;
    if (div) {
      div.addEventListener("scroll", handleScroll);
      return () => div.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Handle changing day tabs
  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    setSelectedEvent(null);
  };

  // Toggle favorite status for an event
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allEvents = days.flatMap((day) => groupedEvents[day]);

  // Filter events to show only favorites if `showFavoritesOnly` is true
  const filteredEvents = showFavoritesOnly
    ? allEvents.filter((event) => favorites[event.id])
    : allEvents;

  const filteredGroupedEvents = filteredEvents.reduce((acc, event) => {
    const eventDate = new Date(event.startDate).toLocaleDateString("en-US", {
      timeZone: "UTC",
    });
    if (!acc[eventDate]) acc[eventDate] = [];
    acc[eventDate].push(event);
    return acc;
  }, {} as Record<string, ScheduleGridProps["schedule"]>);

  const earliestEventIndex = filteredEvents.length
    ? Math.min(...filteredEvents.map((event) => getRowIndex(event.startDate)))
    : 0;

  const firstEventSlotIndex = Math.max(0, earliestEventIndex - 2);
  const slots = Array.from(
    { length: 38 - firstEventSlotIndex },
    (_, i) => i + firstEventSlotIndex
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden p-4 h-2/5">
      {/* Left Section: Schedule Grid */}
      <div
        ref={scheduleGridRef}
        className="overflow-y-scroll h-[500px] border-r border-gray-300 p-4 relative"
      >
        {!hasScrolled && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-4"
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            style={{ zIndex: 10 }}
            onMouseEnter={() =>
              scheduleGridRef.current?.scrollTo({
                top: scheduleGridRef.current?.scrollHeight / 5,
                behavior: "smooth",
              })
            }
          >
            <IconChevronDown size={36} />
          </motion.div>
        )}
        {/* Container for Tabs and Heart Icon */}
        <div className="flex justify-between items-center mb-4 space-x-4">
          {/* Tabs to select the day */}
          <Tabs value={selectedDay} onValueChange={handleDayChange}>
            <TabsList>
              <TabsTrigger value="All">All Days</TabsTrigger>
              {days.map((date) => (
                <TabsTrigger key={date} value={date}>
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Popover for Filters */}
          <Popover>
            <PopoverTrigger>
              <div className="flex items-center cursor-pointer p-2 border rounded-lg shadow-sm">
                <IconFilter size={16} className="mr-2" />
                Filters
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-4 bg-white shadow-lg rounded-md w-60">
              <h3 className="text-lg font-bold mb-3">Filter Options</h3>
              <div className="flex items-center mb-2">
                <Checkbox
                  id="favorites-only"
                  checked={showFavoritesOnly}
                  onCheckedChange={(checked) =>
                    setShowFavoritesOnly(checked === true)
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="favorites-only"
                  className="text-sm cursor-pointer"
                >
                  Show Favorites Only
                </label>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Schedule Grid Table */}
        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-500 p-4">No events found</div>
        ) : (
          <table className="table-fixed w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-16 border-r border-gray-300"></th>
                {selectedDay === "All" ? (
                  days.map((date) => (
                    <th
                      key={date}
                      className="border border-gray-300 p-2 text-center"
                    >
                      {new Date(date).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </th>
                  ))
                ) : (
                  <th className="border border-gray-300 p-2 text-center">
                    {new Date(selectedDay).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {slots.map((slotIndex) => (
                <tr key={slotIndex} className="h-8">
                  <td
                    className={`border-r border-gray-300 text-xs text-right pr-2 ${
                      slotIndex % 2 === 1 ? "border-b border-dashed" : ""
                    }`}
                  >
                    {slotIndex % 2 === 0 ? formatTime(slotIndex) : ""}
                  </td>
                  {(selectedDay === "All" ? days : [selectedDay]).map((day) => (
                    <td
                      key={day}
                      className={`relative border ${
                        slotIndex % 2 === 1 ? "border-b border-dashed" : ""
                      }`}
                    >
                      {filteredGroupedEvents[day]
                        ?.filter(
                          (event) => getRowIndex(event.startDate) === slotIndex
                        )
                        .map((event) => (
                          <div
                            key={event.id}
                            onClick={() =>
                              setSelectedEvent(
                                selectedEvent?.id === event.id ? null : event
                              )
                            }
                            className={`absolute inset-0 ${
                              selectedEvent?.id === event.id
                                ? "bg-blue-500 text-white"
                                : "bg-gray-400 text-white"
                            } rounded-md shadow-md p-1 overflow-hidden cursor-pointer`}
                            style={{
                              gridRow: `span ${getRowSpan(
                                event.startDate,
                                event.endDate
                              )}`,
                              height: `${
                                getRowSpan(event.startDate, event.endDate) * 2
                              }rem`,
                              zIndex: getRowIndex(event.startDate),
                            }}
                          >
                            <CardTitle className="text-sm font-bold flex justify-between">
                              {event.name}
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(event.id);
                                }}
                              >
                                {favorites[event.id] ? (
                                  <IconHeartFilled className="text-red-400" />
                                ) : (
                                  <IconHeart className="text-white" />
                                )}
                              </span>
                            </CardTitle>
                            <div className="text-xs flex items-center">
                              <IconMapPin size={12} className="mr-1" />
                              {event.location || "TBA"}
                            </div>
                            {event.name.toLowerCase().includes("ceremony") && (
                              <Badge className="mt-1" variant="outline">
                                Main Event
                              </Badge>
                            )}
                          </div>
                        ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Right Section: Event Details */}
      <div className="p-4 relative">
        <AnimatePresence>
          {selectedEvent ? (
            <motion.div
              key={selectedEvent.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="p-4 bg-white rounded-lg shadow-sm border absolute inset-0"
            >
              <h2 className="text-xl font-bold flex justify-between">
                {selectedEvent.name}
                <span
                  onClick={() => toggleFavorite(selectedEvent.id)}
                  className="flex"
                >
                  {favorites[selectedEvent.id] ? (
                    <IconHeartFilled className="text-red-400 cursor-pointer" />
                  ) : (
                    <IconHeart className="text-gray-400 cursor-pointer" />
                  )}
                  <IconX
                    className=" cursor-pointer ml-2"
                    onClick={() => setSelectedEvent(null)}
                  />
                </span>
              </h2>
              <p className="text-sm text-gray-500">
                {formatEventTimeRange(
                  selectedEvent.startDate,
                  selectedEvent.endDate
                )}
              </p>
              <hr className="my-2" />
              <div className="flex items-center mt-2">
                <IconMapPin size={20} className="text-gray-400 mr-2" />
                <span>{selectedEvent.location || "TBA"}</span>
              </div>
              <div className="flex items-center mt-2">
                <IconListDetails size={20} className="text-gray-400 mr-2" />
                {selectedEvent.description || "No description available."}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500"
            >
              Select an event to view details
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScheduleGrid;
