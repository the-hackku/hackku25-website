import React from "react";
import "../assets/styles/Organizer.css";

const Organizer = ({ name, imageName, role, link }) => {
  const imageUrl = `/assets/organizers/${imageName}`;

  return (
    <div className="organizer">
      <img src={imageUrl} alt={name} className="organizer-image" />
      <h3 className="organizer-name">
        <a href={link} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </h3>
      <p className="organizer-role">{role}</p>
    </div>
  );
};

export default Organizer;
