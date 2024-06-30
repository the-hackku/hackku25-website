// UserContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import BASE_URL from "../config"; // Import the base URL

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const fetchUserData = useCallback(async () => {
    if (user && user.token) {
      try {
        const response = await axios.get(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUser((prevUser) => ({ ...prevUser, ...response.data }));
        console.log(user);
      } catch (error) {
        console.error("Error refreshing user data:", error);
        setUser(null); // Clear user if there's an error, e.g., token is invalid
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
