import React from "react";
import {
  Container,
  Paper,
  Text,
  Anchor,
  List,
  Title,
  Divider,
} from "@mantine/core";

const RulesPage = () => {
  return (
    <Container my={40}>
      <Paper shadow="sm" p="lg" withBorder>
        <Text
          style={{ fontSize: "2rem" }}
          align="center"
          variant="gradient"
          gradient={{ from: "red", to: "indigo", deg: 149 }}
        >
          Code of Conduct
        </Text>
        <Text mb="md" align="center" size="md" c="dimmed">
          By attending HackKU 2025, you agree to abide by the following Code of
          Conduct.
        </Text>
        <Divider my="md" />
        <List withPadding spacing="md" size="lg" pr={40}>
          <List.Item>
            <Text>
              Treat all other hackers with respect. Behave kindly and
              professionally. Despite the competitive component of hackathons,
              understand that HackKU is, above all, a learning opportunity.
            </Text>
          </List.Item>
          <List.Item>
            <Text>
              Treat all organizers, sponsors, mentors, judges, volunteers, and
              event hosts with respect. Without them, HackKU would not be
              possible, so show that you appreciate them.
            </Text>
          </List.Item>
          <List.Item>
            <Text>
              Respect the University of Kansas’ facilities, as well as any
              others who may be on campus during HackKU. This event is hosted at
              a university, and you will be expected to act in accordance with
              the relevant sections of the University of Kansas Student Code.
            </Text>
          </List.Item>
          <List.Item>
            <Text>
              Food, snacks, drinks, and swag will be available for free
              throughout the weekend. Do not take more than your fair share or
              try to “cheat the system” to take more than you need.
            </Text>
          </List.Item>
          <List.Item>
            <Text>
              Harassment or discrimination based on any, or any combination of,
              the following grounds is strictly prohibited: age, religion, sex,
              sexual orientation, gender identity, gender expression,
              disability, race, ancestry, place of origin, ethnic origin,
              citizenship, color, age, and any other grounds that the law
              protects against. All individuals are entitled to a respectful and
              inclusive environment free from any form of harassment or
              discrimination. This policy applies to all areas of our operations
              and interactions.
            </Text>
          </List.Item>
          <List.Item>
            <Text>
              As a Major League Hacking (MLH) Member Event, all participants
              will be expected to follow the MLH Code of Conduct.
            </Text>
          </List.Item>
          <List.Item>
            <Text>
              Failure to comply with any part of the above-stated Code of
              Conduct may result in disqualification and/or removal from the
              event.
            </Text>
          </List.Item>
        </List>
        <Divider my="md" />
        <Text
          style={{ fontSize: "2rem" }}
          align="center"
          variant="gradient"
          gradient={{ from: "red", to: "indigo", deg: 149 }}
        >
          Photo Release
        </Text>

        <Text align="center">
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
