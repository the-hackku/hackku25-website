"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface PreviousEvent {
  name: string;
  image: string;
  link: string;
}

interface AboutSectionProps {
  previousEvents: PreviousEvent[];
}

const AboutSection: React.FC<AboutSectionProps> = ({ previousEvents }) => {
  return (
    <section
      id="about"
      className="w-full py-32 md:py-44 flex items-center justify-center bg-[#F0E9DF]"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center px-4 md:px-0"
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-black font-dfvn">
          What is HackKU?
        </h2>
        <p className="text-lg md:text-2xl text-black">
          HackKU is a 36 hour{" "}
          <Link
            href="https://en.wikipedia.org/wiki/Hackathon"
            className="underline"
            target="_blank"
          >
            hackathon
          </Link>{" "}
          event where students come together to build innovative projects and
          compete for exciting prizes. Hackers can attend workshops, network
          with sponsors, and explore new technologies, all while meeting new
          people and having fun!
        </p>

        <h2 className="text-lg md:text-xl mt-12 mb-8 text-center text-gray-800">
          Check out our previous events:
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 sm:gap-24 md:gap-52 px-4 md:px-8">
          {previousEvents.map((event) => (
            <motion.div
              key={event.name}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 md:w-40 md:h-40 mb-4"
              >
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit the ${event.name} page`}
                >
                  <Image
                    src={event.image}
                    alt={event.name}
                    width={140}
                    height={140}
                    className="rounded-md object-cover shadow-lg cursor-pointer"
                  />
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
