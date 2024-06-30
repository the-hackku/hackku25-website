import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import {
  Container,
  Title,
  Text,
  Paper,
  Center,
  List,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { nprogress } from "@mantine/nprogress";
import BASE_URL from "../config";
import FormattedDate from "../components/FormattedDate";

const Profile = () => {
  const { user } = useUser();
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    const fetchCheckins = async () => {
      nprogress.start();
      try {
        const response = await axios.get(`${BASE_URL}/users/me/checkins`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setCheckins(response.data);
      } catch (error) {
        console.error("Error fetching check-ins", error);
      } finally {
        nprogress.complete();
      }
    };

    fetchCheckins();
  }, []);

  return (
    <Container size="xs" my={40}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title align="center" mb="lg">
          Your Profile
        </Title>
        <Center my="lg">
          <div>
            <Title order={3} align="center" mb="sm">
              Profile Identifier
            </Title>
            <Center>
              <Paper withBorder shadow="md" p={10} radius="sm">
                <Center>
                  <QRCode value={user.id.toString()} size={200} />
                </Center>
              </Paper>
            </Center>
            <Text c="dimmed" align="center" mt="sm">
              Use this to check-in to events
            </Text>
          </div>
        </Center>
      </Paper>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={3} align="center" mb="sm">
          My Recent Check-ins
        </Title>
        {checkins.length === 0 ? (
          <Text align="center">No check-ins yet</Text>
        ) : (
          <List
            align="center"
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon size={18}>
                <IconCheck size={12} />
              </ThemeIcon>
            }
          >
            {checkins
              .filter((checkin) => checkin.event && checkin.event.name)
              .map((checkin) => (
                <List.Item key={checkin.id}>
                  {checkin.event.name} -{" "}
                  <FormattedDate utcDateString={checkin.checkin_time} />
                </List.Item>
              ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
