import React from "react";
import Organizer from "../components/Organizer";
import "../assets/styles/AboutPage.css";

const organizers = [
  {
    name: "Andrew Huang",
    imageName: "andrew.jpeg",
    role: "Tech",
    link: "https://andrewhuang.dev",
  },
  {
    name: "Will Whitehead",
    imageName: "will.jpeg",
    role: "Tech",
    link: "https://www.linkedin.com/in/willwhitehead122/",
  },
  {
    name: "james hurd",
    imageName: "james.jpeg",
    role: "President / CEO",
    link: "https://www.linkedin.com/in/jameshurd2718/",
  },
  {
    name: "Joshua Lee",
    imageName: "joshua.jpeg",
    role: "Vice President",
    link: "https://www.linkedin.com/in/joshualee128/",
  },
  {
    name: "Anh Hoang",
    imageName: "anh.jpeg",
    role: "Organizer",
    link: "https://www.linkedin.com/in/anh-hoang-54a4b1291/",
  },
  {
    name: "Ky Le",
    imageName: "placeholder.png",
    role: "Organizer",
    link: "Organizer",
  },
  {
    name: "Trent Gould",
    imageName: "trent.jpeg",
    role: "Organizer",
    link: "https://www.linkedin.com/in/trent-gould/",
  },
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
      <h2>Meet the team!</h2>
      <p>Meet the team of organizers who work hard to make HackKU a reality.</p>
      <div className="organizers-grid">
        {organizers.map((organizer, index) => (
          <Organizer
            key={index}
            name={organizer.name}
            imageName={organizer.imageName}
            role={organizer.role}
            link={organizer.link}
          />
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
