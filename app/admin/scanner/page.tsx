"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import ScannerComponent from "@/components/ScannerComponent";
import { validateQrCode, fetchScanHistory } from "@/app/actions/admin"; // Update to use the new action for validating QR codes
import { fetchEvents } from "@/app/actions/events";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function ScannerPage() {
  const [backgroundColor, setBackgroundColor] = useState("inherit");
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, startTransition] = useTransition();
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [scanHistory, setScanHistory] = useState<
    {
      id: string;
      name: string;
      eventName: string;
      successful: boolean;
      timestamp: string;
    }[]
  >([]);

  const selectedEventRef = useRef<string | null>(null);

  // Sound effects
  const errorSound = useRef(new Audio("/sounds/error.mp3"));
  const successSound = useRef(new Audio("/sounds/success.mp3"));

  // Fetch events and scan history on component mount
  useEffect(() => {
    async function initializeData() {
      const [eventsList, history] = await Promise.all([
        fetchEvents(),
        fetchScanHistory(),
      ]);
      setEvents(eventsList);
      setScanHistory(history);
    }
    initializeData();
  }, []);

  // Function to reset the background and validation result
  const resetScreen = () => {
    setBackgroundColor("inherit");
    setValidationResult(null);
    setIsProcessing(false);
  };

  // Function to handle scan result and validate the QR code
  const handleScanResult = (scannedCode: string) => {
    const selectedEvent = selectedEventRef.current;

    if (!selectedEvent) {
      errorSound.current.play(); // Play error sound for missing event
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
            errorSound.current.play(); // Play error sound for high school student
            setValidationResult(
              `HS Student: ${result.name} -
              Chaperone: ${result.chaperoneInfo?.chaperoneName}`
            );
          } else {
            setBackgroundColor("green");
            successSound.current.play(); // Play success sound
            setValidationResult(`Welcome ${result.name}!`);

            setScanHistory((prevHistory) => [
              ...prevHistory,
              {
                id: result.id, // Assume `result.id` is included in the API response
                name: result.name || "Unknown User", // Ensure `name` is always a string
                eventName: selectedEventRef.current || "Unknown Event",
                successful: true, // Mark as successful scan
                timestamp: new Date().toISOString(), // Use ISO string format for consistency
              },
            ]);
          }
        } else {
          setBackgroundColor("red");
          errorSound.current.play(); // Play error sound for invalid scan
          setValidationResult(result.message || "Invalid QR code.");
        }

        setLoading(false);
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Scanner Section with dynamic background */}
      <div onClick={resetScreen}>
        <Select
          onValueChange={(value) => {
            selectedEventRef.current = value;
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name}
              </SelectItem>
            ))}
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
                    <p
                      className="
                      text-2xl
                      font-bold
                      mb-4
                    "
                    >
                      {validationResult}{" "}
                    </p>
                    <p>Click anywhere to scan again.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scan History Section with static background */}
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
