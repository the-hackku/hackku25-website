import React from "react";

const SchedulePage = () => {
  return (
    <div className="home-page">
      <h2>Schedule</h2>
      <p>This is the schedule page of HackKU.</p>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>{/* Add schedule rows here */}</tbody>
      </table>
    </div>
  );
};

export default SchedulePage;
