import React from "react";
import { Container, Paper, Text, Anchor, List, Title } from "@mantine/core";
import { Link } from "react-router-dom";

const RulesPage = () => {
  return (
    <Container my={40}>
      <Paper shadow="sm" p="lg" withBorder>
        <Title order={1} align="center" mb="md">
          Code of Conduct
        </Title>
        <Text mb="md">
          By attending HackKU 2025, you agree to abide by the following Code of
          Conduct.
        </Text>
        <List withPadding>
          <List.Item>
            Treat all other hackers with respect. Behave kindly and
            professionally. Despite the competitive component of hackathons,
            understand that HackKU is, above all, a learning opportunity.
          </List.Item>
          <List.Item>
            Treat all organizers, sponsors, mentors, judges, volunteers, and
            event hosts with respect. Without them, HackKU would not be
            possible, so show that you appreciate them.
          </List.Item>
          <List.Item>
            Respect the University of Kansas’ facilities, as well as any others
            who may be on campus during HackKU. This event is hosted at a
            university, and you will be expected to act in accordance with the
            relevant sections of the University of Kansas Student Code.
          </List.Item>
          <List.Item>
            Food, snacks, drinks, and swag will be available for free throughout
            the weekend. Do not take more than your fair share or try to “cheat
            the system” to take more than you need.
          </List.Item>
          <List.Item>
            Harassment or discrimination based on any, or any combination of,
            the following grounds is strictly prohibited: age, religion, sex,
            sexual orientation, gender identity, gender expression, disability,
            race, ancestry, place of origin, ethnic origin, citizenship, color,
            age, and any other grounds that the law protects against. All
            individuals are entitled to a respectful and inclusive environment
            free from any form of harassment or discrimination. This policy
            applies to all areas of our operations and interactions.
          </List.Item>
          <List.Item>
            As a Major League Hacking (MLH) Member Event, all participants will
            be expected to follow the MLH Code of Conduct.
          </List.Item>
          <List.Item>
            Failure to comply with any part of the above-stated Code of Conduct
            may result in disqualification and/or removal from the event.
          </List.Item>
        </List>
      </Paper>

      <Paper shadow="sm" p="lg" withBorder mt="xl">
        <Title order={2} align="center" mb="md">
          Photo Release
        </Title>
        <Text>
          By attending or participating in any HackKU event, you hereby grant
          HackKU permission to use your likeness in a photograph, video, or
          other digital media without payment or other consideration. You
          understand and agree that all photos will become the property of
          HackKU.
        </Text>
      </Paper>
    </Container>
  );
};

export default RulesPage;
