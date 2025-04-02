import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Link from "next/link";
import constants from "@/constants";

import { ReactNode } from "react";

interface FAQ {
  question: string;
  answer: ReactNode; // Allows JSX elements inside FAQ answers
}

interface FAQSectionProps {
  faqs: FAQ[];
  id?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs, id }) => {
  return (
    <section
      id={id}
      className="w-full min-h-screen py-32 md:py-44 flex flex-col items-center justify-start bg-[#019757] text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full text-center px-4 md:px-0 overflow-hidden"
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-12 font-dfvn">FAQ</h2>

        <p className="text-lg md:text-2x text-white">
          Frequently asked questions about HackKU.
        </p>

        <div className="mx-auto w-full max-w-2xl p-4 md:p-8 ">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="text-left"
              >
                <AccordionTrigger className="text-lg md:text-xl font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base md:text-lg p-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <p className="text-lg md:text-xl text-white">
          Have more questions? View our{" "}
          <Link href="/info" className="underline">
            Info Page
          </Link>{" "}
          or join our{" "}
          <Link href={constants.discordInvite} className="underline">
            Discord
          </Link>
          .
        </p>
      </motion.div>
    </section>
  );
};

export default FAQSection;
