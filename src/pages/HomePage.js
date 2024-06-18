import React from "react";
import Countdown from "../components/Countdown";
import "../assets/styles/HomePage.css";

const HomePage = () => {
  const eventDate = "2025-04-18T18:00:00";

  return (
    <div className="home-page">
      <h2>HackKU 2025</h2>
      <Countdown endDate={eventDate} />
      <p>until HackKU</p>
      <p>04/18 - 04/20</p>
    </div>
  );
};

export default HomePage;
