import React from "react";
import Organizer from "../components/Organizer";
import "../assets/styles/AboutPage.css";

const organizers = [
  { name: "Andrew Huang", imageName: "andrew.jpeg", role: "Tech Lead" },
  { name: "Will Whitehead", imageName: "will.jpeg", role: "Tech Lead" },
  { name: "james hurd", imageName: "james.jpeg", role: "President / CEO" },
  { name: "Joshua Lee", imageName: "joshua.jpeg", role: "Vice President" },
];

const AboutPage = () => {
  return (
    <div className="about-page">
      <h2>About HackKU</h2>
      <p>
        HackKU is an annual hackathon event where participants collaborate on
        software and hardware projects. It provides an excellent opportunity for
        students to learn, innovate, and network with like-minded individuals.
      </p>
      <h2>Organizers</h2>
      <div className="organizers-grid">
        {organizers.map((organizer, index) => (
          <Organizer
            key={index}
            name={organizer.name}
            imageName={organizer.imageName}
            role={organizer.role}
          />
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
