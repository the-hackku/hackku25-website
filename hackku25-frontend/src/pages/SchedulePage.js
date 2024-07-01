import React, { useState } from "react";
import {
  Container,
  Paper,
  Text,
  Group,
  Collapse,
  TextInput,
} from "@mantine/core";
import {
  IconChevronUp,
  IconChevronDown,
  IconClock,
  IconMapPin,
} from "@tabler/icons-react";
import moment from "moment";
import { hackathonInfo } from "../data/hackathonInfo";

const events = hackathonInfo.events;

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
  const [searchQuery, setSearchQuery] = useState("");

  const toggleOpen = (date, index) => {
    const key = `${date}-${index}`;
    setOpened((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredEvents = Object.keys(groupedEvents).reduce((acc, date) => {
    const filtered = groupedEvents[date].filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[date] = filtered;
    }
    return acc;
  }, {});

  return (
    <Container my={40}>
      <Paper shadow="sm" p="lg" withBorder>
        <Text
          style={{ fontSize: "2rem" }}
          align="center"
          mb="md"
          variant="gradient"
          gradient={{ from: "red", to: "indigo", deg: 149 }}
        >
          Events Schedule
        </Text>
        <TextInput
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearchChange}
          mb="lg"
        />
        {Object.keys(filteredEvents).map((date) => (
          <div key={date}>
            <Paper withBorder shadow="xs" p={20} radius="md" my={20}>
              <Text
                style={{
                  fontWeight: 600,
                }}
                size="lg"
                mb="sm"
              >
                {moment(date).format("dddd, MMMM Do")}
              </Text>
              {filteredEvents[date].map((event, index) => {
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
                      onClick={() => toggleOpen(date, index)}
                      style={{ cursor: "pointer" }}
                      gap="2"
                    >
                      <Text weight={500}>{event.title}</Text>
                      {opened[key] ? (
                        <IconChevronUp size={16} />
                      ) : (
                        <IconChevronDown size={16} />
                      )}
                    </Group>
                    <Text c="dimmed">
                      <IconClock size={13} />
                      {moment(event.start).format("h:mma")} -{" "}
                      {moment(event.end).format("h:mma")}
                      <IconMapPin
                        size={13}
                        style={{
                          marginLeft: 10,
                        }}
                      />
                      {event.location}
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
