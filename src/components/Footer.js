import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Footer.css"; // Importing the stylesheet

const Footer = () => {
  return (
    <footer>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
