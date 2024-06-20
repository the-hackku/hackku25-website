import React from "react";
import Countdown from "../components/Countdown";
import Button from "../components/Button";
import "../assets/styles/HomePage.css";

const HomePage = () => {
  const eventDate = "2025-04-18T18:00:00";

  const handleJoinDiscord = () => {
    window.open("https://discord.com/invite/your-invite-link", "_blank");
  };

  const handleSignUp = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="home-page">
      <h2>HackKU 2025</h2>
      <Countdown endDate={eventDate} />
      <p>until HackKU</p>
      <p>04/18 - 04/20</p>
      <div className="buttons-container">
        <Button text="Join Discord" onClick={handleJoinDiscord} />
        <Button text="Sign Up" onClick={handleSignUp} />
      </div>
    </div>
  );
};

export default HomePage;
