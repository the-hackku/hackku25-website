import React from "react";
import Countdown from "../components/Countdown";

const HomePage = () => {
  const eventDate = "2025-04-18T18:00:00";

  return (
    <div className="home-page">
      <h2>HackKU 2025</h2>
      <p>This is the home page of HackKU.</p>
      <Countdown endDate={eventDate} />
    </div>
  );
};

export default HomePage;
