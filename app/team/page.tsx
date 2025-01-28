"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const teamMembers = [
  {
    name: "James Hurd",
    role: "Director",
    image: "/images/team/james.jpeg",
    linkedin: "https://www.linkedin.com/in/jameshurd2718/",
  },
  {
    name: "Joshua Lee",
    role: "Vice Director",
    image: "/images/team/joshua.jpeg",
    linkedin: "https://www.linkedin.com/in/joshualee128/",
  },
  {
    name: "Will Whitehead",
    role: "Technology Lead",
    image: "/images/team/will.jpeg",
    linkedin: "https://www.linkedin.com/in/willwhitehead122/",
  },
  {
    name: "Andrew Huang",
    role: "Tech Team",
    image: "/images/team/andrew.jpeg",
    linkedin: "https://www.linkedin.com/in/andrew-l-huang/",
  },
];

export default function TeamPage() {
  return (
    <section
      id="team"
      className="w-full py-32 md:py-22 flex flex-col items-center justify-center bg-[#F0E9DF] text-black"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-center mb-8 md:mb-12 px-4 md:px-0"
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-4 font-dfvn">
          Meet the Team
        </h2>
        <p>
          Our team is dedicated to creating an unforgettable hackathon
          experience for all participants!
        </p>
      </motion.div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-12 px-4 md:px-8">
        {teamMembers.map((member) => (
          <motion.div
            key={member.name}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Profile Image */}
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

            {/* Name and Role */}
            <h3 className="text-lg md:text-xl font-semibold">{member.name}</h3>
            <p className="text-gray-500">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
