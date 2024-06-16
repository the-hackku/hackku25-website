import React from "react";
import RulesList from "../components/RulesList";

const RulesPage = () => {
  const rules = [
    "Be respectful",
    "Have fun",
    "Be creative",
    "Don't break the law",
  ];

  return (
    <div className="rules-page">
      <h2>Rules</h2>
      <RulesList rules={rules} />
    </div>
  );
};

export default RulesPage;
