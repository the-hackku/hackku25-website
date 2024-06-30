import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import BASE_URL from "../config";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Group,
  Progress,
  Checkbox,
  Space,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { nprogress } from "@mantine/nprogress";
import ErrorAlert from "./ErrorAlert";

function getStrength(password) {
  return password.length ** 2.5;
}

function getStrengthColor(strength) {
  switch (true) {
    case strength < 30:
      return "red";
    case strength < 50:
      return "orange";
    case strength < 70:
      return "yellow";
    default:
      return "teal";
  }
}

const Register = ({ onSuccess, setLoading }) => {
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const strength = getStrength(password);
  const color = getStrengthColor(strength);

  const navigate = useNavigate();
  const { setUser, fetchUserData, user } = useUser();

  useEffect(() => {
    if (user && user.token) {
      fetchUserData()
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
        });
    }
  }, [user, fetchUserData, navigate]);

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },

    validate: {
      username: (value) =>
        value.length < 3 ? "Username must be at least 3 characters long" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
    },
  });

  const handleRegister = async (values) => {
    nprogress.start();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/users/register`, {
        username: values.username,
        email: values.email,
        password: values.password,
        role: "hacker",
      });

      const loginResponse = await axios.post(
        `${BASE_URL}/users/login`,
        new URLSearchParams({
          username: values.email,
          password: values.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setError(null);
      setUser({ token: loginResponse.data.access_token });
      navigate("/login");
      onSuccess();
    } catch (err) {
      const errorResponse = err.response
        ? err.response.data
        : { detail: "An error occurred" };
      setError(errorResponse);
      console.error("Registration or login failed:", errorResponse);
    } finally {
      setLoading(false);
      nprogress.complete();
    }
  };

  const inputStyle = {
    fontSize: "16px",
  };

  return (
    <>
      <Title align="center">Register</Title>
      <Space h="md" />
      <form onSubmit={form.onSubmit((values) => handleRegister(values))}>
        <TextInput
          label="Username"
          placeholder="Create a username"
          autoCapitalize="none"
          style={inputStyle}
          {...form.getInputProps("username")}
          required
        />
        <TextInput
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          autoCapitalize="none"
          style={inputStyle}
          {...form.getInputProps("email")}
          required
          mt="md"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={(event) => {
            setPassword(event.currentTarget.value);
            form.setFieldValue("password", event.currentTarget.value);
          }}
          autoComplete="new-password"
          autoCapitalize="none"
          style={inputStyle}
          required
          mt="md"
        />

        <Group grow gap={5} mt="xs">
          <Progress
            size="xs"
            color={color}
            value={password.length > 0 ? 100 : 0}
            transitionDuration={0}
          />
          <Progress
            size="xs"
            color={color}
            transitionDuration={0}
            value={strength < 30 ? 0 : 100}
          />
          <Progress
            size="xs"
            color={color}
            transitionDuration={0}
            value={strength < 50 ? 0 : 100}
          />
          <Progress
            size="xs"
            color={color}
            transitionDuration={0}
            value={strength < 70 ? 0 : 100}
          />
        </Group>

        <Checkbox
          label="I accept the terms & conditions"
          mt="md"
          mb="md"
          onChange={(event) => {
            form.setFieldValue("terms", event.currentTarget.checked);
          }}
        />

        <Button
          fullWidth
          mt="xl"
          type="submit"
          disabled={
            !form.values.username ||
            !form.values.email ||
            !form.values.password ||
            !form.values.terms
          }
        >
          Register
        </Button>
      </form>
      <ErrorAlert error={error} />
    </>
  );
};

export default Register;
