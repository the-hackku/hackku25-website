import React from "react";
import "../assets/styles/MLHBanner.css";

const MLHBanner = ({ rules }) => {
  return (
    <a href="https://mlh.io/seasons/2025/events">
      <img
        id="mlh-trust-badge"
        src="/assets/mlh-banner.svg"
        alt=""
        height="15%"
      />
    </a>
  );
};

export default MLHBanner;
