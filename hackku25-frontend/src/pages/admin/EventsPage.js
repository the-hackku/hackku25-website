import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Button,
  Modal,
} from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import CustomTable from "../../components/CustomTable";
import { notifications } from "@mantine/notifications";
import BASE_URL from "../../config";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

const EventsPage = () => {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    start_time: "",
    end_time: "",
  });
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchEvents = async () => {
      nprogress.start();
      try {
        const response = await axios.get(`${BASE_URL}/admin/events`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        nprogress.complete();
      }
    };

    if (user && user.token) {
      fetchEvents();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    nprogress.start();
    try {
      const response = await axios.post(`${BASE_URL}/admin/events`, newEvent, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents((prevEvents) => [...prevEvents, response.data]);
      setNewEvent({ name: "", description: "", start_time: "", end_time: "" });
      notifications.show({
        title: "Success!",
        message: "Your event was created!",
      });
      close();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      nprogress.complete();
    }
  };

  const handleDeleteEvent = async (eventId) => {
    nprogress.start();
    try {
      await axios.delete(`${BASE_URL}/admin/events/${eventId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      notifications.show({
        title: "Success!",
        message: "The event was deleted!",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      nprogress.complete();
    }
  };

  const data = useMemo(
    () =>
      events.map((event) => ({
        name: event.name,
        description: event.description,
        start_time: new Date(event.start_time).toLocaleString(),
        end_time: new Date(event.end_time).toLocaleString(),
        id: event.id,
      })),
    [events]
  );

  const columns = useMemo(
    () => [
      { Header: "Event Name", accessor: "name" },
      { Header: "Description", accessor: "description" },
      { Header: "Start Time", accessor: "start_time" },
      { Header: "End Time", accessor: "end_time" },
      {
        Header: "Actions",
        accessor: "id",
        Cell: ({ value }) => (
          <>
            <Button
              component={Link}
              size="xs"
              to={`/admin/events/${value}`}
              style={{ marginRight: "8px" }}
            >
              View
            </Button>
            <Button
              color="red"
              size="xs"
              onClick={() => handleDeleteEvent(value)}
            >
              <IconTrash size={18} />
            </Button>
          </>
        ),
      },
    ],
    []
  );

  return (
    <Container size="lg" my={40}>
      <Title align="center" mb="lg">
        Events
      </Title>
      <Button onClick={open} mb="lg">
        + Create New Event
      </Button>
      <CustomTable columns={columns} data={data} />
      <Modal
        opened={opened}
        onClose={close}
        transitionProps={{
          transition: "pop",
        }}
      >
        <Title align="center" mt="lg" mb="lg">
          Create New Event
        </Title>
        <form onSubmit={handleFormSubmit}>
          <TextInput
            label="Event Name"
            name="name"
            value={newEvent.name}
            onChange={handleInputChange}
            required
            mb="sm"
          />
          <Textarea
            label="Description"
            name="description"
            value={newEvent.description}
            onChange={handleInputChange}
            required
            mb="sm"
          />
          <TextInput
            label="Start Time"
            type="datetime-local"
            name="start_time"
            value={newEvent.start_time}
            onChange={handleInputChange}
            required
            mb="sm"
          />
          <TextInput
            label="End Time"
            type="datetime-local"
            name="end_time"
            value={newEvent.end_time}
            onChange={handleInputChange}
            required
            mb="sm"
          />
          <Button type="submit" fullWidth>
            Create Event
          </Button>
        </form>
      </Modal>
    </Container>
  );
};

export default EventsPage;
