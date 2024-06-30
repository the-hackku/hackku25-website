import { Anchor, Container, Paper, Text } from "@mantine/core";
import Register from "../components/Register";
import { Link } from "react-router-dom";

const RegisterPage = () => {
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
        <Register />
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

export default RegisterPage;
