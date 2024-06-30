import React, { useState, useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import BASE_URL from "../../config";
import { Container, Text, Paper, Alert, Center, Select } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const AdminScanner = () => {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventIdMap, setEventIdMap] = useState({});
  const selectedEventRef = useRef("");
  const [scanResult, setScanResult] = useState(null);
  const successSoundRef = useRef(null);
  const errorSoundRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/events`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const eventsData = response.data;
        setEvents(eventsData);

        const eventIdMapping = {};
        eventsData.forEach((event) => {
          eventIdMapping[event.name] = event.id;
        });
        setEventIdMap(eventIdMapping);
        console.log("Fetched events:", eventsData);

        // Set the default selected event to the first event
        if (eventsData.length > 0) {
          setSelectedEvent(eventsData[0].name);
          selectedEventRef.current = eventsData[0].name;
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (user && user.token) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    selectedEventRef.current = selectedEvent;
  }, [selectedEvent]);

  const handleScan = async (result) => {
    if (result) {
      const decodedText = result[0].rawValue;
      console.log("Decoded text:", decodedText);
      setScanResult(decodedText);
      if (decodedText && selectedEventRef.current) {
        const userId = parseInt(decodedText, 10);
        const eventId = eventIdMap[selectedEventRef.current];
        console.log("Parsed user ID:", userId);
        console.log("Parsed event ID:", eventId);

        if (isNaN(userId) || isNaN(eventId)) {
          setErrorMessage("Invalid user ID or event ID");
          return;
        }

        try {
          const payload = {
            user_id: userId,
            event_id: eventId,
          };
          console.log("Payload:", payload);
          const response = await axios.post(
            `${BASE_URL}/admin/checkins`,
            payload,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          console.log("Check-in successful for user ID:", decodedText);

          setErrorMessage("");
          if (successSoundRef.current) {
            successSoundRef.current.play();
          }
        } catch (error) {
          console.error("Check-in error:", error);
          if (error.response) {
            console.log("Error response data:", error.response.data);
            let errorMessage = "An unexpected error occurred";
            if (
              error.response.status === 400 ||
              error.response.status === 422
            ) {
              if (Array.isArray(error.response.data.detail)) {
                errorMessage = error.response.data.detail
                  .map((err) => `${err.msg} at ${err.loc.join(" > ")}`)
                  .join(", ");
              } else if (typeof error.response.data.detail === "object") {
                errorMessage = JSON.stringify(error.response.data.detail);
              } else {
                errorMessage = error.response.data.detail;
              }
            }
            setErrorMessage(errorMessage);
          } else {
            setErrorMessage("An unexpected error occurred");
          }
          if (errorSoundRef.current) {
            errorSoundRef.current.play();
          }
        }
      } else {
        console.log("No data or event selected.");
      }
    }
  };

  const handleEventChange = (value) => {
    setSelectedEvent(value);
    console.log("Event selected:", value);
  };

  useEffect(() => {
    console.log("Selected event state updated:", selectedEvent);
  }, [selectedEvent]);

  return (
    <Container size="sm" my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Select
          label="Select Event"
          placeholder="Select an event"
          data={Object.keys(eventIdMap).map((eventName) => ({
            value: eventName,
            label: eventName,
          }))}
          value={selectedEvent}
          onChange={handleEventChange}
          mb="lg"
        />
        <Center mb="lg">
          <Scanner onScan={handleScan} />
        </Center>
        {scanResult && (
          <Text align="center" mt="md">
            Scanned User ID: {scanResult}
          </Text>
        )}
        {errorMessage && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            mt="md"
          >
            {errorMessage}
          </Alert>
        )}
        <audio ref={successSoundRef} src="/sounds/success.mp3" preload="auto" />
        <audio ref={errorSoundRef} src="/sounds/error.mp3" preload="auto" />
      </Paper>
    </Container>
  );
};

export default AdminScanner;
