import React from "react";
import Schedule from "../components/Schedule";

const SchedulePage = () => {
  const schedule = [
    { time: "09:00 AM", event: "Opening Ceremony" },
    { time: "10:00 AM", event: "Team Formation" },
    { time: "11:00 AM", event: "Hacking Begins" },
    { time: "01:00 PM", event: "Lunch Break" },
    { time: "06:00 PM", event: "Dinner Break" },
    { time: "10:00 PM", event: "Check-in and Updates" },
    { time: "08:00 AM", event: "Hacking Ends" },
    { time: "09:00 AM", event: "Project Submission" },
    { time: "10:00 AM", event: "Judging Begins" },
    { time: "12:00 PM", event: "Closing Ceremony" },
  ];

  return (
    <div className="home-page">
      <h2>Schedule</h2>
      <p>This is the schedule page of HackKU.</p>
      <Schedule schedule={schedule} />
    </div>
  );
};

export default SchedulePage;
