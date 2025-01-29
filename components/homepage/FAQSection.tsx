import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Link from "next/link";
import constants from "@/constants";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  return (
    <section
      id="faq"
      className="w-full py-32 md:py-44 flex items-center justify-center bg-gray-50 text-gray-900"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full text-center px-4 md:px-0 overflow-hidden"
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-12 font-dfvn">FAQ</h2>

        <p className="text-lg md:text-2xl text-gray-700">
          Frequently asked questions about HackKU.
        </p>

        <div className="mx-auto w-full max-w-2xl p-4 md:p-8">
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

        <p className="text-lg md:text-xl text-gray-700">
          Have more questions? Join our{" "}
          <Link href={constants.discordInvite} className="underline">
            Discord
          </Link>{" "}
          or email us at{" "}
          <a href={`mailto:${constants.supportEmail}`} className="underline">
            {constants.supportEmail}
          </a>
          .
        </p>
      </motion.div>
    </section>
  );
};

export default FAQSection;
