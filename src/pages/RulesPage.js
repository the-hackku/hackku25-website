import React from "react";
import RulesList from "../components/RulesList";
import CodeOfConduct from "../components/CodeOfConduct";

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
      <CodeOfConduct/>
    </div>
  );
};

export default RulesPage;
