import { Anchor, Container, Paper, Text } from "@mantine/core";
import Login from "../components/Login";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <Container size={420} my={40}>
      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        style={{ position: "relative" }}
      >
        <Login />
        <Text align="center" mt="md">
          Already have an account?{" "}
          <Anchor component={Link} to="/login">
            Log In
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default LoginPage;
