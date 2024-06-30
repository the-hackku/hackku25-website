import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { Container, Title, Button } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import CustomTable from "../../components/CustomTable";
import { notifications } from "@mantine/notifications";
import BASE_URL from "../../config";
import FormattedDate from "../../components/FormattedDate";
import { IconTrash } from "@tabler/icons-react";

const UsersPage = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      nprogress.start();
      try {
        const response = await axios.get(`${BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(response.data);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Error fetching users",
          color: "red",
        });
        console.error("Error fetching users:", error);
      } finally {
        nprogress.complete();
      }
    };

    if (user && user.token) {
      fetchUsers();
    }
  }, [user]);

  const handleDeleteUser = useCallback(
    async (userId) => {
      nprogress.start();
      try {
        await axios.delete(`${BASE_URL}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        notifications.show({
          title: "Success!",
          message: "You deleted a user",
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Error deleting user",
          color: "red",
        });
        console.error("Error deleting user:", error);
      } finally {
        nprogress.complete();
      }
    },
    [user]
  );

  const data = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_on: <FormattedDate utcDateString={user.created_on} />,
      })),
    [users]
  );

  const columns = useMemo(
    () => [
      { Header: "User ID", accessor: "id" },
      { Header: "Username", accessor: "username" },
      { Header: "Email", accessor: "email" },
      { Header: "Role", accessor: "role" },
      { Header: "Created On", accessor: "created_on" },
      {
        Header: "Actions",
        accessor: "action",
        Cell: ({ row }) => (
          <Button
            color="red"
            size="xs"
            onClick={() => handleDeleteUser(row.values.id)}
          >
            <IconTrash size={18} />
          </Button>
        ),
      },
    ],
    [handleDeleteUser]
  );

  return (
    <Container size="lg" my={40}>
      <Title align="center" mb="lg">
        All Users
      </Title>
      <CustomTable columns={columns} data={data} />
    </Container>
  );
};

export default UsersPage;
