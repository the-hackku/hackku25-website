import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import BASE_URL from "../config";
import { TextInput, PasswordInput, Button, Title, Space } from "@mantine/core";
import { useForm } from "@mantine/form";
import { nprogress } from "@mantine/nprogress";
import ErrorAlert from "./ErrorAlert";

const Login = ({ onSuccess = null, setLoading }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser, fetchUserData, user } = useUser();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
    },
  });

  const handleSubmit = async (values) => {
    nprogress.start(); // Start navigation progress
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
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
      setError(null); // Clear error if login is successful
      setUser({ token: response.data.access_token }); // Store only token
      if (onSuccess) {
        onSuccess(); // Call onSuccess callback if provided
      }
      navigate("/"); // Redirect to home page
    } catch (err) {
      const errorResponse = err.response
        ? err.response.data
        : { detail: "An error occurred" };
      setError(errorResponse);
      console.error("Login failed:", errorResponse);
    } finally {
      setLoading(false); // Stop loading
      nprogress.complete(); // End navigation progress
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchUserData()
        .then(() => {
          navigate("/"); // Redirect to home page on success
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
        });
    }
  }, [user, fetchUserData, navigate]);

  const inputStyle = {
    fontSize: "16px",
  };

  return (
    <>
      <Title align="center">Login</Title>
      <Space h="md" />
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          autoCapitalize="none"
          style={inputStyle}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
          autoCapitalize="none"
          style={inputStyle}
          {...form.getInputProps("password")}
          mt="md"
        />
        <Button
          fullWidth
          mt="xl"
          type="submit"
          disabled={!form.values.email || !form.values.password}
        >
          Login
        </Button>
      </form>
      <ErrorAlert error={error} />
    </>
  );
};

export default Login;
