import React from "react";
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const ErrorAlert = ({ error }) => {
  if (!error) return null;

  if (Array.isArray(error.detail)) {
    return error.detail.map((err, index) => (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
        key={index}
        my={10}
      >
        {err.msg}
      </Alert>
    ));
  } else if (typeof error.detail === "string") {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
        my={10}
      >
        {error.detail}
      </Alert>
    );
  } else {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
        my={10}
      >
        An unknown error occurred
      </Alert>
    );
  }
};

export default ErrorAlert;
