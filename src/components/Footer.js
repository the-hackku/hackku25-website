import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Footer.css";

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
          <li>
            <Link to="/faq">FAQ</Link>
          </li>
          <li>
            <Link to="/rules">Rules</Link>
          </li>
          <li>
            <Link to="/schedule">Schedule</Link>
          </li>
          <li>
            <Link to="/">myHackKU</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
