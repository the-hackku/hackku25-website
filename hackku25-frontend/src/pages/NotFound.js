// src/components/NotFound.js
import React from "react";
import { Link } from "react-router-dom";
import { Container, Title, Text, Button, Center } from "@mantine/core";

const NotFound = () => {
  return (
    <Container style={{ textAlign: "center", paddingTop: "100px" }}>
      <Title
        order={1}
        style={{ fontSize: "72px", fontWeight: 900, color: "#FF6B6B" }}
      >
        404
      </Title>
      <Text size="xl" weight={500} style={{ marginTop: "20px" }}>
        Oops! The page you're looking for doesn't exist.
      </Text>
      <Text size="md" style={{ marginTop: "10px", color: "#868e96" }}>
        The page you are trying to reach is not available.
      </Text>
      <Center style={{ marginTop: "40px" }}>
        <Button component={Link} to="/" size="lg" variant="outline">
          Go back to the homepage
        </Button>
      </Center>
    </Container>
  );
};

export default NotFound;
