import React, { useEffect, useState, useMemo } from "react";
import { useUser } from "../context/UserContext";
import {
  Container,
  Text,
  Paper,
  SimpleGrid,
  Button,
  Title,
  Center,
  Anchor,
  Modal,
} from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { hackathonInfo } from "../data/hackathonInfo";
import CountUp from "react-countup";
import PopupAuth from "../components/PopupAuth";
import { useMediaQuery } from "@mantine/hooks";

const Home = () => {
  const { fetchUserData, user } = useUser();
  const [countdown, setCountdown] = useState("");
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const targetDate = useMemo(
    () => new Date("2025-04-18T00:00:00").getTime(),
    []
  );

  useEffect(() => {
    nprogress.start();
    if (user && user.token) {
      fetchUserData().catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
    }
    nprogress.complete();
  }, [user, fetchUserData]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown(); // Initialize the countdown immediately
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const openModal = () => setOpened(true);
  const closeModal = () => setOpened(false);

  return (
    <Container my={40}>
      <Paper withBorder shadow="sm" p={30} radius="md" mt="xl" align="center">
        <Text
          style={{ fontSize: "3rem" }}
          align="center"
          variant="gradient"
          gradient={{ from: "red", to: "indigo", deg: 149 }}
        >
          {countdown}
        </Text>
        <Text align="center" c="dimmed" size="lg" mb="md">
          until the most <b>epic</b> hackathon of the year
        </Text>
        <Center>
          <Button size="md" radius="md" onClick={openModal}>
            Register Now!
          </Button>
          <Modal
            size={"sm"}
            opened={opened}
            onClose={closeModal}
            transitionProps={{
              transition: "pop",
            }}
          >
            <Container size="sm">
              <PopupAuth onSuccess={closeModal} initialAuth={"register"} />
            </Container>
          </Modal>
        </Center>
      </Paper>
      <SimpleGrid cols={isMobile ? 2 : 4} spacing="lg" align="center" py={40}>
        {hackathonInfo.stats.map((stat, index) => (
          <Paper key={index} shadow="sm" p="md" withBorder radius="md">
            <Text
              align="center"
              style={{
                fontSize: "2rem",
              }}
              weight={700}
            >
              <CountUp
                end={stat.value}
                prefix={stat.prefix || ""}
                duration={3}
              />
            </Text>
            <Text align="center" size="md" c="dimmed">
              {stat.label}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Home;
