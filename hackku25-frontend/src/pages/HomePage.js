import React, { useEffect, useState, useMemo } from "react";
import { useUser } from "../context/UserContext";
import { Container, Text, Paper } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";

const Home = () => {
  const { fetchUserData, user } = useUser();
  const [countdown, setCountdown] = useState("");

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

  return (
    <Container size="xs" my={40}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Text
          style={{ fontSize: "2rem" }} // You can use '3rem', '4rem', etc.
          align="center"
          mb="lg"
          variant="gradient"
          gradient={{ from: "red", to: "indigo", deg: 149 }}
        >
          myHackKU Portal
        </Text>

        {user ? (
          <>
            <Text align="center">Hi, {user?.username}!</Text>
          </>
        ) : (
          <Text align="center">Please sign in to access the portal.</Text>
        )}
      </Paper>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <Text
          style={{ fontSize: "3rem" }}
          align="center"
          variant="gradient"
          gradient={{ from: "red", to: "indigo", deg: 149 }}
        >
          {countdown}
        </Text>
      </Paper>
    </Container>
  );
};

export default Home;
