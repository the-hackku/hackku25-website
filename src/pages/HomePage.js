import React from "react";
import Countdown from "../components/Countdown";

const HomePage = () => {
  const eventDate = "2025-04-18T18:00:00";

  return (
    <div className="home-page">
      <h2>Welcome to the Hackathon Site</h2>
      <p>This is the home page of the hackathon site.</p>
      <Countdown endDate={eventDate} />
    </div>
  );
};

export default HomePage;
