"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: "smooth" });
  };
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 15; // Adjust tilt sensitivity
    const y = ((clientY - top) / height - 0.5) * -15; // Adjust tilt sensitivity
    setTilt({ x, y });
    setIsMouseOver(true);
  };

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 });
    setIsMouseOver(false);
  };

  const sponsorTiers = ["Kila", "Mega"];
  const sponsors = [
    {
      name: "Tradebot",
      logo: "/images/sponsors/tradebot.webp",
      website: "https://www.tradebot.com",
      tier: "Kila",
    },
    {
      name: "Security Benefit",
      logo: "/images/sponsors/security.svg",
      website: "https://www.securitybenefit.com",
      tier: "Kila",
    },
    {
      name: "Patient Safety",
      logo: "/images/sponsors/patient.gif",
      website: "https://www.patientsafetytech.com/",
      tier: "Mega",
    },
  ];

  const previousEvents = [
    {
      name: "HackKU 2021",
      image: "/images/prev/2021.png",
      link: "https://hackku-2021.devpost.com/",
    },
    {
      name: "HackKU 2022",
      image: "/images/prev/2022.png",
      link: "https://hackku-2022.devpost.com/",
    },
    {
      name: "HackKU 2023",
      image: "/images/prev/2023.png",
      link: "https://hackku-2023.devpost.com/",
    },
    {
      name: "HackKU 2024",
      image: "/images/prev/2024.png",
      link: "https://hackku-2024.devpost.com/",
    },
  ];

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
    {
      name: "Tyler Anderson",
      role: "Tech Team",
      image: "/images/team/tyler.webp",
      linkedin: "https://www.linkedin.com/in/andrew-l-huang/",
    },
  ];

  return (
    <div className="w-full min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-br from-black via-indigo-900 to-purple-900 text-white font-agency">
      {/* Header Section */}
      <section
        id="header"
        className="relative w-full flex items-center justify-center overflow-hidden pb-40 pt-32 md:pb-60 md:pt-48"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
      >
        <motion.div
          className="text-center max-w-4xl z-10 px-4 md:px-0"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: isMouseOver
              ? "transform .1s ease-out"
              : "transform 1s ease-out",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-md md:text-lg text-gray-300 font-agency"
          >
            APRIL 4th - 6th, 2025
          </motion.p>
          {/* Event Title */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-6xl md:text-8xl font-dfvn font-extrabold"
          >
            HackKU25
          </motion.h1>

          {/* Event Host */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="text-md md:text-lg text-gray-300 font-agency"
          >
            @{" "}
            <Link
              href="https://maps.app.goo.gl/g2MHMwYqWsaYvLSL9"
              target="_blank"
              className="hover:underline"
            >
              THE UNIVERSITY OF KANSAS
            </Link>
          </motion.p>

          {/* Register Now Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.25 }}
            className="mt-4 relative flex justify-center items-center"
          >
            {/* Register Now Button */}
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-yellow-500 hover:shadow-xl rounded-full text-lg md:text-xl shadow-lg text-black font-bold"
              >
                Register Now
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Down Icon */}
        <motion.div
          className="absolute bottom-8 md:bottom-10 cursor-pointer"
          onClick={() => scrollToSection("what-is-it")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.5 }}
        >
          <p className="flex flex-col items-center text-md md:text-lg">
            <ChevronDown size={24} />
            Scroll to Learn More
          </p>
        </motion.div>
      </section>

      {/* About Section */}
      <section
        id="what-is-it"
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
            HackKU is a 36-hour event where students come together to build
            innovative projects and compete for exciting prizes. Hackers can
            attend workshops, network with sponsors, and explore new
            technologies, all while meeting new people and having fun!
          </p>

          <h2 className="text-lg md:text-xl mt-12 mb-4 text-center text-gray-800">
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
                  >
                    <Image
                      src={event.image}
                      alt={event.name}
                      width={160}
                      height={160}
                      className="rounded-md object-cover shadow-lg cursor-pointer"
                    />
                  </a>
                </motion.div>
                <h3 className="text-lg md:text-xl text-black">{event.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section
        id="sponsors"
        className="w-full py-32 md:py-44 flex flex-col items-center justify-center bg-[#019757]"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center mb-8 md:mb-12 px-4 md:px-0"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-2 text-white font-dfvn">
            Our Sponsors
          </h2>
          <p className="text-lg md:text-2xl text-white">
            HackKU is supported by an incredible group of sponsors who make this
            event possible.
          </p>
        </motion.div>

        {sponsorTiers.map((tier, index) => (
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.3, // Offset start times
            }}
            className="w-full py-6 md:py-10"
          >
            <h3 className="text-4xl md:text-5xl font-semibold mb-6 text-center text-white font-dfvn">
              {tier} Tier
            </h3>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {sponsors
                .filter((sponsor) => sponsor.tier === tier)
                .map((sponsor) => (
                  <motion.a
                    key={sponsor.name}
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    aria-label={`View details of ${sponsor.name}`}
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={200}
                      height={100}
                      className="object-contain h-auto cursor-pointer"
                    />
                  </motion.a>
                ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Meet the Team Section */}
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
    </div>
  );
}
