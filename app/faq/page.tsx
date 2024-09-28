"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";

// Define the FAQ items
type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

const initialFAQs: FAQItem[] = [
  {
    id: 1,
    question: "What is HackKU 2025?",
    answer:
      "HackKU 2025 is an annual hackathon hosted at the University of Kansas, where students come together to build innovative projects, learn new skills, and network with industry professionals.",
  },
  {
    id: 2,
    question: "Who can participate?",
    answer:
      "HackKU is open to all university and high school students. Participants of all skill levels are welcome, whether you're a beginner or an experienced hacker.",
  },
  {
    id: 3,
    question: "Do I need a team to participate?",
    answer:
      "No, you don’t need a team to participate. You can either form a team before the event or join one at the team-building session during the hackathon.",
  },
  {
    id: 4,
    question: "What should I bring to the event?",
    answer:
      "We recommend bringing your laptop, charger, a water bottle, and any additional hardware you might want to use. We’ll provide meals, snacks, and a space for you to work!",
  },
  {
    id: 5,
    question: "How can I contact the organizers?",
    answer:
      "You can reach out to us via email at support@hackku.org or through our social media channels listed on our website.",
  },
];

export default function FAQPage() {
  // Manage the open/closed state of each FAQ item
  const [openItems, setOpenItems] = useState<number[]>([]);

  // Toggle open state of FAQ items
  const toggleFAQ = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 mb-4">
            Have a question? We’ve got answers! If you don’t see your question
            here, feel free to reach out to us.
          </p>
          <div className="space-y-3">
            {/* Render each FAQ item */}
            {initialFAQs.map((faq) => (
              <div key={faq.id} className="flex flex-col space-y-2">
                {/* FAQ Question */}
                <div
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex items-center justify-between cursor-pointer p-3 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  {openItems.includes(faq.id) ? (
                    <ChevronDown className="text-gray-600" />
                  ) : (
                    <ChevronRight className="text-gray-600" />
                  )}
                </div>

                {/* FAQ Answer - Conditionally Rendered */}
                {openItems.includes(faq.id) && (
                  <div className="p-3 pl-6 border-l-4 border-blue-500 bg-gray-50 rounded-md">
                    <p className="text-base text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
