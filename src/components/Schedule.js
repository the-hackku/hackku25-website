import React from "react";
import "../assets/styles/Schedule.css";

const Schedule = ({ schedule }) => {
  return (
    <table className="schedule-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Event</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((item, index) => (
          <tr key={index} className="schedule-row">
            <td className="schedule-time">{item.time}</td>
            <td className="schedule-event">{item.event}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Schedule;
