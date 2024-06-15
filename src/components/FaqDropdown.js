import React, { useState } from "react";
import "../assets/styles/FaqDropdown.css";

const FaqDropdown = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-dropdown">
      <h3 onClick={toggleDropdown} className="faq-question">
        {question}
      </h3>
      {isOpen && <p className="faq-answer">{answer}</p>}
    </div>
  );
};

export default FaqDropdown;
