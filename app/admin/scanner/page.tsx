"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import ScannerComponent from "@/components/ScannerComponent";
import { validateQrCode } from "@/app/actions/validateQrCode";
import { getEvents } from "@/app/actions/getEvents";
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
  const selectedEventRef = useRef<string | null>(null); // Use ref for selected event

  // Fetch events on component mount
  useEffect(() => {
    async function fetchEvents() {
      const eventsList = await getEvents();
      setEvents(eventsList);
    }
    fetchEvents();
  }, []);
  // Function to handle scan result and validate the QR code
  const handleScanResult = (scannedCode: string) => {
    const selectedEvent = selectedEventRef.current;

    if (!selectedEvent) {
      setValidationResult("Please select an event.");
      setBackgroundColor("yellow");
      return;
    }

    if (!isProcessing) {
      const startTime = Date.now(); // Record the start time
      setIsProcessing(true); // Block new scans while processing
      setLoading(true);

      setTimeout(() => {
        startTransition(async () => {
          const result = await validateQrCode(scannedCode, selectedEvent);
          const endTime = Date.now(); // Record the end time
          const duration = endTime - startTime; // Calculate duration in milliseconds

          if (result.success) {
            setValidationResult(`Welcome ${result.name}! (${duration}ms)`);
            setBackgroundColor("green"); // Turn background green on success
          } else {
            setValidationResult(
              `${
                result.message || "Invalid QR code."
              } (Scan time: ${duration}ms)`
            );
            setBackgroundColor("red"); // Turn background red on failure
          }

          setLoading(false);

          // Add a delay before resetting the background and enabling a new scan
          setTimeout(() => {
            setIsProcessing(false); // Allow new scans after 2 seconds
            setBackgroundColor("inherit"); // Reset background after delay
            setValidationResult(null); // Clear the result
          }, 2000); // 2-second delay
        });
      }, 2); // Slight delay to ensure the state is updated before validation
    }
  };

  return (
    <div
      style={{
        backgroundColor,
        minHeight: "100vh",
        position: "relative",
        transition: "background-color 0.5s ease",
      }}
    >
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          <Select
            onValueChange={(value) => {
              selectedEventRef.current = value; // Update the ref directly
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
            style={{
              opacity: isProcessing ? 0 : 1, // Hide scanner while processing
              transition: "opacity 0.5s ease",
            }}
          >
            <ScannerComponent
              onScanResult={handleScanResult}
              isProcessing={isProcessing} // Pass the isProcessing state to control scanner visibility
            />
          </div>
          {(validationResult || loading) && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", // Center the text
                fontSize: "2rem", // Large font size for visibility
                fontWeight: "bold",
                textAlign: "center",
                zIndex: 10, // Ensure the text is on top
              }}
            >
              {loading ? "Validating..." : validationResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
