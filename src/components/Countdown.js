import React, { useEffect, useState } from "react";
import { calculateCountdown } from "../utils/countdown";
import "../assets/styles/Countdown.css"; // Optional: for styling

const Countdown = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateCountdown(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateCountdown(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return <div>Countdown finished!</div>;
  }

  return (
    <div className="countdown">
      <div>{timeLeft.days}d</div>
      <div>{timeLeft.hours}h</div>
      <div>{timeLeft.minutes}m</div>
      <div>{timeLeft.seconds}s</div>
    </div>
  );
};

export default Countdown;
