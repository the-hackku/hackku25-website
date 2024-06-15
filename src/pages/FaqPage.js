import React from "react";
import FaqDropdown from "../components/FaqDropdown";

const FaqPage = () => {
  const faqs = [
    {
      question: "What is HackKU?",
      answer:
        "HackKU is an annual hackathon event where participants collaborate on software and hardware projects.",
    },
    {
      question: "How do I register?",
      answer:
        "You can register for HackKU through our website's registration page. Make sure to fill out all required fields.",
    },
    {
      question: "What are the rules?",
      answer:
        "The rules for HackKU can be found on our rules page. They include guidelines on team size, project submission, and more.",
    },
    {
      question: "What is the schedule?",
      answer:
        "The schedule for HackKU includes various events, workshops, and coding sessions. Check our schedule page for detailed timings.",
    },
  ];

  return (
    <div className="home-page">
      <h2>FAQ</h2>
      {faqs.map((faq, index) => (
        <FaqDropdown key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FaqPage;
