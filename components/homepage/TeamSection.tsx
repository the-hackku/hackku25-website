"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ teamMembers }) => {
  return (
    <section
      id="meet-the-team"
      className="w-full py-32 md:py-44 flex flex-col items-center justify-center bg-[#037EC1]"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-center mb-8 md:mb-12 px-4 md:px-0"
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-4 text-white font-dfvn">
          Meet the Team
        </h2>
        <p className="text-lg md:text-2xl text-white">
          The passionate individuals driving HackKU25 forward. Our team is
          dedicated to creating an unforgettable hackathon experience for all
          participants.
        </p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-12 px-4 md:px-8">
        {teamMembers.map((member) => (
          <motion.div
            key={member.name}
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
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name}'s LinkedIn`}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="rounded-md object-cover shadow-lg cursor-pointer"
                />
              </a>
            </motion.div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              {member.name}
            </h3>
            <p className="text-gray-300">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
