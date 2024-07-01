import React from "react";
import {
  Container,
  Text,
  Group,
  Anchor,
  Tooltip,
  ActionIcon,
  Center,
  Divider,
} from "@mantine/core";
import { hackathonInfo } from "../data/hackathonInfo";
import { IconBrandDiscord, IconBrandInstagram } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer>
      <Divider />
      <Container size="lg" py="md" px="lg">
        <Center>
          <Group position="apart">
            <Text size="sm">Made by your HackKU Team</Text>
            <Group spacing="xs">
              <Tooltip label="Join Discord" withArrow>
                <ActionIcon
                  component={Anchor}
                  href={hackathonInfo.discord}
                  target="_blank"
                  size={30}
                  variant="subtle"
                >
                  <IconBrandDiscord />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Visit Instagram" withArrow>
                <ActionIcon
                  component={Anchor}
                  href={hackathonInfo.instagram}
                  target="_blank"
                  size={30}
                  variant="subtle"
                >
                  <IconBrandInstagram />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Center>
      </Container>
    </footer>
  );
};

export default Footer;
