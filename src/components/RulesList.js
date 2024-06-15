import React from "react";
import "../assets/styles/RulesList.css";

const RulesList = ({ rules }) => {
  return (
    <ul className="rules-list">
      {rules.map((rule, index) => (
        <li key={index} className="rule-item">
          {rule}
        </li>
      ))}
    </ul>
  );
};

export default RulesList;
