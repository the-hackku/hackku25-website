import React from "react";
import "../assets/styles/Organizer.css";

const Organizer = ({ name, imageName, role }) => {
  const imageUrl = `/assets/organizers/${imageName}`;
  console.log(imageUrl);

  return (
    <div className="organizer">
      <img src={imageUrl} alt={name} className="organizer-image" />
      <h3 className="organizer-name">{name}</h3>
      <p className="organizer-role">{role}</p>
    </div>
  );
};

export default Organizer;
