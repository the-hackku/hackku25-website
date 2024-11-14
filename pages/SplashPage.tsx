"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Component() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-br from-black via-indigo-900 to-purple-900 text-white font-agency">
      {/* Header Section */}
      <section
        id="header"
        className="relative w-full flex items-center justify-center overflow-hidden py-40 "
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

          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-8xl font-dfvn font-extrabold"
          >
            HackKU25
          </motion.h1>

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
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-4"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-yellow-500 hover:shadow-xl rounded-full text-lg shadow-lg text-black"
              >
                Register Now
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-10 cursor-pointer"
          onClick={() => {
            const questsElement = document.getElementById("what-is-it");
            if (questsElement) {
              questsElement.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <ChevronDown size={40} className="text-gray-400" />
        </motion.div>
      </section>

      {/* What Is It Section */}
      <Section
        id="what-is-it"
        title="What is a Hackathon??"
        description="HackKU is an immersive hackathon experience where creators, innovators, and tech enthusiasts come together to build solutions, learn, and grow. It's a platform for aspiring hackers to showcase their skills and creativity."
      />

      {/* Stats Section */}
      <Section
        id="stats"
        title="Event Statistics"
        description="Join us for an exhilarating weekend filled with coding, collaboration, and creativity. Over 500 participants, 36 hours of hacking, and countless innovations await you!"
      />

      {/* Tracks Section */}
      <TracksSection />

      {/* Sponsors Section */}
      <SponsorsSection />
    </div>
  );
}

interface SectionProps {
  id: string;
  title: string;
  description: string;
}

function Section({ id, title, description }: SectionProps) {
  return (
    <section
      id={id}
      className="w-full py-24 flex items-center justify-center bg-transparent"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-600 font-dfvn">
          {title}
        </h2>
        <p className="text-xl text-gray-300">{description}</p>
      </motion.div>
    </section>
  );
}

function TracksSection() {
  const tracks = [
    { id: 1, name: "Web Development", description: "Build amazing websites!" },
    { id: 2, name: "Machine Learning", description: "Dive into AI!" },
    { id: 3, name: "Mobile Apps", description: "Create mobile experiences." },
    { id: 4, name: "Game Development", description: "Develop fun games." },
  ];

  return (
    <section
      id="tracks"
      className="w-full py-24 flex flex-col items-center bg-transparent"
    >
      <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-600">
        Event Tracks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="border p-4 rounded-lg bg-white text-black"
          >
            <h3 className="text-lg font-bold">{track.name}</h3>
            <p>{track.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SponsorsSection() {
  const sponsors = [
    { id: 1, name: "Tradebot", logo: "/images/sponsors/tradebot.webp" },
    { id: 2, name: "Patient Safety", logo: "/images/sponsors/patient.gif" },
    { id: 3, name: "Security Benefit", logo: "/images/sponsors/security.jpg" },
  ];

  return (
    <section
      id="sponsors"
      className="w-full py-24 flex flex-col items-center bg-transparent"
    >
      <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-600">
        Our Sponsors
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="flex justify-center">
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              width={200}
              height={100}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
