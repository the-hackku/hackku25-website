import React, { useState } from "react";
import { Container, Paper, Text, Group, Collapse } from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import moment from "moment";

// Sample events with descriptions
const events = [
  {
    title: "Opening Ceremony",
    start: new Date("2025-04-18T10:00:00"),
    end: new Date("2025-04-18T11:00:00"),
    description: "Join us for the official opening of the hackathon.",
  },
  {
    title: "Workshop 1",
    start: new Date("2025-04-18T12:00:00"),
    end: new Date("2025-04-18T14:00:00"),
    description: "Learn the basics of web development in this workshop.",
  },
  {
    title: "Hackathon Start",
    start: new Date("2025-04-18T15:00:00"),
    end: new Date("2025-04-18T16:00:00"),
    description:
      "The hackathon officially begins. Start working on your projects!",
  },
  {
    title: "Keynote Speech",
    start: new Date("2025-04-19T09:00:00"),
    end: new Date("2025-04-19T10:00:00"),
    description:
      "Listen to our keynote speaker talk about the future of technology.",
  },
  {
    title: "Workshop 2",
    start: new Date("2025-04-19T11:00:00"),
    end: new Date("2025-04-19T13:00:00"),
    description: "Advanced topics in web development.",
  },
  {
    title: "Project Submissions",
    start: new Date("2025-04-20T10:00:00"),
    end: new Date("2025-04-20T12:00:00"),
    description: "Submit your projects for evaluation.",
  },
  {
    title: "Closing Ceremony",
    start: new Date("2025-04-20T13:00:00"),
    end: new Date("2025-04-20T14:00:00"),
    description: "Join us for the closing ceremony and awards.",
  },
];

// Helper function to group events by date
const groupEventsByDate = (events) => {
  return events.reduce((acc, event) => {
    const date = moment(event.start).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});
};

const SchedulePage = () => {
  const groupedEvents = groupEventsByDate(events);
  const [opened, setOpened] = useState({});

  const toggleOpen = (date, index) => {
    const key = `${date}-${index}`;
    setOpened((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Container size="sm" my={40}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Text
          style={{ fontSize: "2rem" }}
          align="center"
          mb="lg"
          variant="gradient"
          gradient={{ from: "red", to: "indigo", deg: 149 }}
        >
          Event Schedule
        </Text>
        {Object.keys(groupedEvents).map((date) => (
          <div key={date}>
            <Paper withBorder shadow="xs" p={20} radius="md" my={20}>
              <Text weight={700} size="lg" mb="sm">
                {moment(date).format("dddd, MMMM Do")}
              </Text>
              {groupedEvents[date].map((event, index) => {
                const key = `${date}-${index}`;
                return (
                  <Paper
                    withBorder
                    shadow="xs"
                    p={10}
                    radius="md"
                    my={10}
                    key={key}
                    sx={{
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Group
                      position="apart"
                      onClick={() => toggleOpen(date, index)}
                      style={{ cursor: "pointer" }}
                    >
                      <Text weight={500}>{event.title}</Text>
                      {opened[key] ? (
                        <IconChevronUp size={16} />
                      ) : (
                        <IconChevronDown size={16} />
                      )}
                    </Group>
                    <Text c="dimmed" style={{ marginTop: "5px" }}>
                      {moment(event.start).format("h:mm a")} -{" "}
                      {moment(event.end).format("h:mm a")}
                    </Text>
                    <Collapse in={opened[key]}>
                      <Text mt={10}>{event.description}</Text>
                    </Collapse>
                  </Paper>
                );
              })}
            </Paper>
          </div>
        ))}
      </Paper>
    </Container>
  );
};

export default SchedulePage;
