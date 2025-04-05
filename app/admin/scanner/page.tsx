"use client";

import { useEffect, useRef, useState, useTransition, useMemo } from "react";
import { debounce } from "lodash";
import ScannerComponent from "@/components/ScannerComponent";

// Combined imports for scanning + manual checkin logic
import {
  validateQrCode,
  fetchScanHistory,
  searchUsers,
  manualCheckIn,
} from "@/app/actions/admin";
import { fetchEvents } from "@/app/actions/events";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";

export default function ScannerPage() {
  /*******************************/
  /***  STATE & REF VARIABLES  ***/
  /*******************************/
  const [backgroundColor, setBackgroundColor] = useState("inherit");
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, startTransition] = useTransition();
  const [events, setEvents] = useState<
    { id: string; name: string; startDate: Date }[]
  >([]);
  const [scanHistory, setScanHistory] = useState<
    {
      id: string;
      name: string;
      eventName: string;
      successful: boolean;
      timestamp: string;
    }[]
  >([]);

  // We keep this ref around for the backend logic
  const selectedEventRef = useRef<string | null>(null);

  // Audio references
  const errorSound = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);

  /***************************************************/
  /***  MANUAL CHECK-IN STATES (MOVED IN-LINE)    ****/
  /***************************************************/
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; firstName: string; lastName: string; email: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startManualCheckInTransition] = useTransition();

  /***************************************************/
  /***  USEEFFECTS FOR INITIAL DATA & SCANNER RESET ***/
  /***************************************************/

  // Fetch events and scan history on component mount
  useEffect(() => {
    async function initializeData() {
      const [eventsList, history] = await Promise.all([
        fetchEvents(),
        fetchScanHistory(),
      ]);

      // Make sure to convert date strings to actual Date objects if needed
      // (depends on how your fetchEvents() returns the data)
      const typedEvents = eventsList.map((evt) => ({
        ...evt,
        startDate: new Date(evt.startDate),
      }));
      setEvents(typedEvents);
      setScanHistory(history);
    }
    initializeData();
  }, []);

  // Load audio on mount
  useEffect(() => {
    errorSound.current = new Audio("/sounds/error.mp3");
    successSound.current = new Audio("/sounds/success.mp3");
  }, []);

  /*********************************************/
  /***  SCANNER-RELATED FUNCTIONS & HANDLERS  ***/
  /*********************************************/

  // Function to reset the background and validation result
  const resetScreen = () => {
    setBackgroundColor("inherit");
    setValidationResult(null);
    setIsProcessing(false);
  };

  // Handle scan result
  const handleScanResult = async (scannedCode: string) => {
    const selectedEvent = selectedEventRef.current;

    if (!selectedEvent) {
      errorSound.current?.play();
      setIsProcessing(false);
      setLoading(false);
      setValidationResult("Please select an event.");
      setBackgroundColor("yellow");
      return;
    }

    if (!isProcessing) {
      setIsProcessing(true);
      setLoading(true);

      startTransition(async () => {
        const result = await validateQrCode(scannedCode, selectedEvent);

        if (result.success) {
          if (result.isHighSchoolStudent) {
            setBackgroundColor("yellow");
            errorSound.current?.play();
            setValidationResult(
              `HS Student: ${result.name} - Chaperone: ${result.chaperoneInfo?.chaperoneName}`
            );
          } else {
            setBackgroundColor("green");
            successSound.current?.play();
            setValidationResult(`Welcome ${result.name}!`);

            // Update local scan history
            setScanHistory((prevHistory) => [
              ...prevHistory,
              {
                id: result.id,
                name: result.name || "Unknown User",
                eventName: selectedEventRef.current || "Unknown Event",
                successful: true,
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        } else {
          setBackgroundColor("red");
          errorSound.current?.play();
          setValidationResult(result.message || "Invalid QR code.");
        }

        setLoading(false);
      });
    }
  };

  /***************************************************/
  /***  MANUAL CHECK-IN LOGIC (SHARING EVENT REF)  ***/
  /***************************************************/
  // Debounced user search
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

  // Handle changes in the search box
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Manual check-in
  const handleCheckIn = async () => {
    const eventId = selectedEventRef.current;
    if (!selectedUserId || !eventId) {
      toast.error("Please select a user and event first.");
      return;
    }

    startManualCheckInTransition(async () => {
      try {
        await toast.promise(manualCheckIn(selectedUserId, eventId), {
          loading: "Checking user in...",
          success: "Check-in successful!",
          error: "Manual check-in failed.",
        });
        // Reset relevant states
        setSelectedUserId("");
        setSearchQuery("");
        setSearchResults([]);
      } catch (error) {
        console.error("Manual check-in error:", error);
        setMessage("Something went wrong with manual check-in.");
      }
    });
  };

  /*********************/
  /***  RENDER JSX   ***/
  /*********************/
  return (
    <div className="flex flex-col min-h-screen">
      {/* Scanner Section with dynamic background */}
      <div onClick={resetScreen}>
        <Select
          onValueChange={(value) => {
            selectedEventRef.current = value;
          }}
        >
          <SelectTrigger
            className={selectedEventRef.current === null ? "bg-yellow-200" : ""}
          >
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => {
              // get e.g. "Sat"
              const dayName = new Date(event.startDate).toLocaleDateString(
                "en-US",
                { weekday: "short" }
              );
              return (
                <SelectItem key={event.id} value={event.id}>
                  {dayName}: {event.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <div
          className="container mx-auto py-8"
          style={{
            backgroundColor,
            flex: 1,
            position: "relative",
            transition: "background-color 0.5s ease",
            minHeight: "60vh",
          }}
        >
          <div className="space-y-4">
            <div style={{ opacity: isProcessing ? 0 : 1 }}>
              <ScannerComponent
                onScanResult={handleScanResult}
                isProcessing={isProcessing}
              />
            </div>

            {(validationResult || loading) && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  zIndex: 10,
                }}
              >
                {loading ? (
                  "Validating..."
                ) : (
                  <>
                    <p className="text-2xl font-bold mb-4">
                      {validationResult}
                    </p>
                    <p>Click anywhere to scan again.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MANUAL CHECK-IN SECTION (same event selection) */}
      <div className="max-w-3xl mx-auto p-6 bg-white my-6 rounded-lg md:shadow-sm md:border">
        <h2 className="text-xl font-semibold text-center mb-4">
          Manual Check-In
        </h2>
        <p className="text-sm mb-4">
          Use this form to manually check a user in if they don’t have a QR
          code.
        </p>

        {/* We no longer have a separate event dropdown here; 
            we’re using selectedEventRef from above. */}

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
                    checked={selectedUserId === user.id}
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

      {/* Scan History Section */}
      <div className="bg-white border-t">
        <div className="container mx-auto py-8">
          <h2 className="text-lg font-bold mb-4">Scan History</h2>
          <ul className="space-y-2">
            {scanHistory.map((scan) => (
              <li
                key={scan.id}
                className={`border p-2 rounded ${
                  scan.successful ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <p>
                  <strong>Name:</strong> {scan.name}
                </p>
                <p>
                  <strong>Event:</strong> {scan.eventName}
                </p>
                <p>
                  <strong>Successful:</strong> {scan.successful ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(scan.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
