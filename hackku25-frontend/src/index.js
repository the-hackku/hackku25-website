import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css"; // Import Tailwind CSS
import reportWebVitals from "./reportWebVitals";
import { MantineProvider } from "@mantine/core";
import { NavigationProgress } from "@mantine/nprogress";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { BrowserRouter as Router } from "react-router-dom"; // Import Router here

import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      {" "}
      {/* Wrap the entire app with Router */}
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <NavigationProgress />
        <ModalsProvider>
          <Notifications />
          <App />
        </ModalsProvider>
      </MantineProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
