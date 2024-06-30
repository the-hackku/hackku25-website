import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title, Group, Button, Card, Center } from "@mantine/core";
import { IconUsers, IconCalendarEvent, IconScan } from "@tabler/icons-react";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm" my={40}>
      <Title align="center" mb="lg">
        Admin Panel
      </Title>
      <Center>
        <Group position="center" spacing="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group direction="column" position="center" spacing="sm">
              <Button
                leftSection={<IconUsers size={16} />}
                fullWidth
                onClick={() => navigate("/admin/users")}
                leftIcon={<IconUsers size={16} />}
              >
                View All Users
              </Button>
              <Button
                leftSection={<IconCalendarEvent size={16} />}
                fullWidth
                onClick={() => navigate("/admin/events")}
                leftIcon={<IconCalendarEvent size={16} />}
              >
                Manage Events
              </Button>
              <Button
                leftSection={<IconScan size={16} />}
                fullWidth
                onClick={() => navigate("/admin/scanner")}
                leftIcon={<IconScan size={16} />}
              >
                QR Check In
              </Button>
            </Group>
          </Card>
        </Group>
      </Center>
    </Container>
  );
};

export default AdminPanel;
