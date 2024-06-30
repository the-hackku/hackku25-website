// src/components/FormattedDate.js

import React from "react";

const FormattedDate = ({ utcDateString }) => {
  const formatDate = (utcDateString) => {
    const postedDate = new Date(utcDateString);
    const localDate = new Date(
      postedDate.getTime() - postedDate.getTimezoneOffset() * 60000
    );
    return localDate.toLocaleString();
  };

  return <>{formatDate(utcDateString)}</>;
};

export default FormattedDate;
