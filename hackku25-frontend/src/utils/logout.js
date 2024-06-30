// src/utils/logout.js
import { notifications } from "@mantine/notifications";

const logout = (setUser, navigate) => {
  setUser(null);
  localStorage.removeItem("user");
  navigate("/");
  notifications.show({
    title: "Success!",
    message: "You have been logged out!",
  });
};

export default logout;
