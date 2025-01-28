"use client";

import { motion } from "framer-motion";
import MemberImage from "./MemberImage";
import { IconBrandLinkedin, IconWorld } from "@tabler/icons-react";
import { useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  website?: string;
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ teamMembers }) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  return (
    <section
      id="team"
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
      {/* Updated container with smaller width */}
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 overflow-x-auto pb-4">
        <div className="grid grid-flow-col grid-rows-2 auto-cols-min gap-2 md:gap-6 py-5">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center text-center w-48 md:w-56"
            >
              <motion.div
                className="w-32 h-32 md:w-40 md:h-40 mb-4 relative"
                onMouseEnter={() =>
                  (member.linkedin || member.website) &&
                  setHoveredImage(member.name)
                }
                onMouseLeave={() => setHoveredImage(null)}
              >
                <MemberImage
                  src={member.image}
                  alt={member.name}
                  width={160}
                  height={160}
                  className={`rounded-md object-cover shadow-lg transition-all duration-300 ${
                    hoveredImage === member.name &&
                    (member.linkedin || member.website)
                      ? "brightness-50"
                      : "brightness-100"
                  }`}
                />
                {(member.linkedin || member.website) && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center space-x-4 transition-all duration-300 ${
                      hoveredImage === member.name ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name}'s LinkedIn`}
                        className="text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full p-2"
                      >
                        <IconBrandLinkedin size={24} />
                      </a>
                    )}
                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name}'s Website`}
                        className="text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full p-2"
                      >
                        <IconWorld size={24} />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
              <h3 className="text-lg md:text-xl font-semibold text-white">
                {member.name}
              </h3>
              <p className="text-gray-300">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
