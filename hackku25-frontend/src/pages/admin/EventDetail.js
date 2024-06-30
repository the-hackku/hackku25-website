import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { Container, Title, Paper, Text } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import CustomTable from "../../components/CustomTable";
import BASE_URL from "../../config";
import FormattedDate from "../../components/FormattedDate"; // Import the new component

const EventDetail = () => {
  const { user } = useUser();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      nprogress.start(); // Start navigation progress
      try {
        const eventResponse = await axios.get(
          `${BASE_URL}/admin/events/${eventId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setEvent(eventResponse.data);

        const checkinsResponse = await axios.get(
          `${BASE_URL}/admin/events/${eventId}/checkins`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setCheckins(checkinsResponse.data);
      } catch (error) {
        console.error("Error fetching event details or check-ins:", error);
      }
      nprogress.complete(); // End navigation progress
    };

    if (user && user.token) {
      fetchEventDetails();
    }
  }, [user, eventId]);

  const data = useMemo(
    () =>
      checkins.map((checkin) => ({
        username: checkin.user ? checkin.user.username : "Deleted User",
        checkin_time: <FormattedDate utcDateString={checkin.checkin_time} />, // Use the new component
      })),
    [checkins]
  );

  const columns = useMemo(
    () => [
      { Header: "Username", accessor: "username" },
      { Header: "Check-in Time", accessor: "checkin_time" },
    ],
    []
  );

  return (
    <Container size="md" my={40}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title align="center" mb="lg">
          {event?.name}
        </Title>
        <Text size="lg" mb="sm">
          {event?.description}
        </Text>
        <Text>
          Start Time: <FormattedDate utcDateString={event?.start_time} />
        </Text>
        <Text>
          End Time: <FormattedDate utcDateString={event?.end_time} />
        </Text>
        <Title order={2} mt="lg" mb="sm">
          Check-ins
        </Title>
        <CustomTable columns={columns} data={data} />
      </Paper>
    </Container>
  );
};

export default EventDetail;
