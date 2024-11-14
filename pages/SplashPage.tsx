"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  // Function to handle smooth scrolling to a specific section
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  // Data for Sponsors with website URLs
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
    // Add more sponsors here
  ];

  // Data for Previous Events
  const previousEvents = [
    {
      name: "HackKU 2020",
      image: "/images/prev/2020.png",
      link: "https://hackku-2020.devpost.com/",
    },
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
        className="relative w-full flex items-center justify-center overflow-hidden pb-60 pt-48"
      >
        <motion.div className="text-center max-w-4xl z-10">
          {/* Event Dates */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-lg text-gray-300 font-agency"
          >
            APRIL 4th - 6th, 2025
          </motion.p>

          {/* Event Title */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-8xl font-dfvn font-extrabold"
          >
            HackKU25
          </motion.h1>

          {/* Event Host */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="text-lg text-gray-300 font-agency"
          >
            THE UNIVERSITY OF KANSAS
          </motion.p>

          {/* Register Now Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.25 }}
            className="mt-4"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-yellow-500 hover:shadow-xl rounded-full text-xl shadow-lg text-black font-bold"
              >
                Register Now
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Down Icon */}
        <motion.div
          className="absolute bottom-10  cursor-pointer"
          onClick={() => scrollToSection("what-is-it")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.5 }}
        >
          <p className="flex flex-col items-center">
            <ChevronDown size={32} />
            Scroll to Learn More
          </p>
        </motion.div>
      </section>

      {/* About Section */}
      <section
        id="what-is-it"
        className="w-full py-44 flex items-center justify-center bg-[#F0E9DF]"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center"
        >
          <h2 className="text-7xl font-bold mb-4 bg-clip-text text-black font-dfvn">
            What is HackKU?
          </h2>
          <p className="text-2xl text-black">
            HackKU is an immersive hackathon experience where creators,
            innovators, and tech enthusiasts come together to build solutions,
            learn, and grow. It&apos;s a platform for aspiring hackers to
            showcase their skills and creativity.
          </p>
          <h2 className="text-xl mt-12 mb-6 text-center text-gray-800">
            Check out our previous events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {previousEvents.map((event) => (
              <motion.a
                key={event.name}
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center bg-white rounded-lg shadow-md overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ duration: 0.3 }}
                aria-label={`View details of ${event.name}`}
              >
                <Image
                  src={event.image}
                  alt={event.name}
                  width={300}
                  height={200}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>
      {/* Sponsors Section */}
      <section
        id="sponsors"
        className="w-full py-44 flex flex-col items-center justify-center bg-[#019757]"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center mb-12"
        >
          <h2 className="text-7xl font-bold mb-4 bg-clip-text text-white font-dfvn">
            Our Sponsors
          </h2>
          <p className="text-2xl text-white">
            HackKU is supported by an incredible group of sponsors who make this
            event possible.
          </p>
        </motion.div>
        {sponsorTiers.map((tier) => (
          <div key={tier} className="w-full py-10">
            <h3 className="text-3xl font-semibold mb-6 text-center text-white font-dfvn">
              {tier} Tier
            </h3>
            {/* Flexbox Container */}
            <div className="flex flex-wrap justify-center gap-8">
              {sponsors
                .filter((sponsor) => sponsor.tier === tier)
                .map((sponsor) => (
                  <motion.a
                    key={sponsor.name}
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center overflow-hidden"
                    whileHover={{
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.3 }}
                    aria-label={`View details of ${sponsor.name}`}
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={250}
                      height={150}
                      className="object-contain h-auto cursor-pointer"
                    />
                  </motion.a>
                ))}
            </div>
          </div>
        ))}
      </section>
      {/* Meet the Team Section */}
      <section
        id="meet-the-team"
        className="w-full py-44 flex flex-col items-center justify-center bg-[#037EC1]"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-center mb-12 px-4"
        >
          <h2 className="text-7xl font-bold mb-4 text-white font-dfvn">
            Meet the Team
          </h2>
          <p className="text-2xl text-white">
            The passionate individuals driving HackKU25 forward. Our team is
            dedicated to creating an unforgettable hackathon experience for all
            participants.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 px-8">
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
                className="w-40 h-40 mb-4"
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
              <h3 className="text-xl font-semibold text-white">
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
