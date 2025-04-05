"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { debounce } from "lodash";
import { searchUsers, manualCheckIn } from "@/app/actions/admin"; // Your admin actions
import { fetchEvents } from "@/app/actions/events"; // Server action to get events
import { toast } from "sonner";
// If you want to use a loading spinner icon
import { IconLoader } from "@tabler/icons-react";

export default function ManualCheckin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; firstName: string; lastName: string; email: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [events, setEvents] = useState<
    { id: string; name: string; startDate: string }[]
  >([]);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  // ---- 1. Fetch events on component mount ----
  useEffect(() => {
    startTransition(async () => {
      try {
        const eventsList = await fetchEvents();
        setEvents(
          eventsList.map((event) => ({
            ...event,
            startDate: event.startDate.toISOString(),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast.error("Failed to load events.");
      }
    });
  }, []);

  const resetUserSelection = () => {
    setSelectedUserId("");
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  // ---- 2. Debounce the user search to reduce server calls ----
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 2) {
          setSearchResults([]);
          return;
        }

        try {
          setIsSearching(true);
          const results = await searchUsers(query);
          setSearchResults(results);
        } catch (error) {
          console.error("Search failed:", error);
          toast.error("User search failed.");
        } finally {
          setIsSearching(false);
        }
      }, 300),
    []
  );

  // ---- 3. Handle typing in the search box ----
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // ---- 4. Handle manual check-in call ----
  const handleCheckIn = async () => {
    if (!selectedUserId || !selectedEventId) {
      toast.error("Please select a user and an event first.");
      return;
    }

    startTransition(async () => {
      try {
        await toast.promise(manualCheckIn(selectedUserId, selectedEventId), {
          loading: "Checking user in...",
          success: "Check-in successful!",
          error: "Manual check-in failed.",
        });
        resetUserSelection(); // ✅ Only reset the user field here
      } catch (error) {
        console.error("Manual check-in error:", error);
        setMessage("Something went wrong with manual check-in.");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white my-6 rounded-lg md:shadow-sm md:border">
      <h2 className="text-xl font-semibold text-center mb-4">
        Manual Check-In
      </h2>
      <p className="text-sm mb-4">
        Use this form to manually check a user in if they don’t have a QR code.
      </p>

      {/* Events Dropdown */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Select an event:</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select an event --</option>
          {events.map((evt) => (
            <option key={evt.id} value={evt.id}>
              {evt.name} ({new Date(evt.startDate).toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Search for a user:</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border p-2 rounded w-full"
          />
          {isSearching && <IconLoader className="animate-spin" size={20} />}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Type at least 2 characters to start searching.
        </p>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 border rounded p-2 bg-gray-50">
            {searchResults.map((user) => (
              <label
                key={user.id}
                className="block py-1 cursor-pointer hover:bg-gray-100 rounded"
              >
                <input
                  type="radio"
                  name="selectedUser"
                  className="mr-2"
                  value={user.id}
                  onChange={() => setSelectedUserId(user.id)}
                />
                {user.firstName} {user.lastName} ({user.email})
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Check-in button */}
      <button
        onClick={handleCheckIn}
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isPending ? "Checking in..." : "Check In Manually"}
      </button>

      {/* Message display (success or error) */}
      {message && <p className="mt-4 text-center font-medium">{message}</p>}
    </div>
  );
}
