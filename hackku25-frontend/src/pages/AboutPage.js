import React, { useState } from "react";
import {
  Container,
  Paper,
  Text,
  SimpleGrid,
  Card,
  Image,
  Group,
} from "@mantine/core";
import { hackathonInfo } from "../data/hackathonData";
import { organizers } from "../data/organizers";

const cardStyle = {
  height: "100%",
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const hoverStyle = {
  transform: "scale(1.05)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const AboutPage = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <Container my={40}>
      <Paper shadow="sm" p="lg" withBorder>
        <Text align="center" size="xl" weight={700}>
          About {hackathonInfo.name}
        </Text>
        <Text align="center" size="md" mt="md">
          {hackathonInfo.description}
        </Text>
      </Paper>

      <Paper shadow="sm" p="lg" withBorder mt="xl">
        <Text align="center" size="xl" weight={700} my={10}>
          Meet the Organizers
        </Text>
        <Text align="center" c="dimmed" my={10}>
          The team behind {hackathonInfo.name}
        </Text>
        <SimpleGrid cols={5} spacing="lg">
          {organizers.map((organizer, index) => (
            <a
              key={organizer.name}
              href={organizer.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={
                  hovered === index
                    ? { ...cardStyle, ...hoverStyle }
                    : cardStyle
                }
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <Card.Section>
                  <Image
                    src={`/images/officers/${organizer.imageName}`}
                    height={160}
                    alt={organizer.name}
                  />
                </Card.Section>
                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500}>{organizer.name}</Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {organizer.role}
                </Text>
              </Card>
            </a>
          ))}
        </SimpleGrid>
      </Paper>

      <Paper shadow="sm" p="lg" withBorder mt="xl">
        <Text align="center" size="xl" weight={700} my={10}>
          Past Hackathons
        </Text>
        <Text align="center" c="dimmed" my={10}>
          See what hackers have built in the past!
        </Text>
        <SimpleGrid cols={5} spacing="lg">
          {hackathonInfo.previousEvents.map((event, index) => (
            <a
              key={event.year}
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={
                  hovered === index + organizers.length
                    ? { ...cardStyle, ...hoverStyle }
                    : cardStyle
                }
                onMouseEnter={() => setHovered(index + organizers.length)}
                onMouseLeave={() => setHovered(null)}
              >
                <Card.Section>
                  <Image src={event.image} height={160} alt={event.alt} />
                </Card.Section>
                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500}>HackKU {event.year}</Text>
                </Group>
              </Card>
            </a>
          ))}
        </SimpleGrid>
      </Paper>
    </Container>
  );
};

export default AboutPage;
