"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Component() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const [prizeAmount, setPrizeAmount] = useState(0);
  const totalPrize = 10000; // Total prize amount

  useEffect(() => {
    const eventDate = new Date("2025-04-04T08:00:00");
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      const milliseconds = Math.floor(difference % 1000);

      setTimeRemaining({ days, hours, minutes, seconds, milliseconds });
    }, 1);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const countUp = setInterval(() => {
      setPrizeAmount((prev) => {
        if (prev < totalPrize) {
          return Math.min(prev + 100 / prev, totalPrize);
        }
        clearInterval(countUp);
        return prev;
      });
    }, 50);

    return () => clearInterval(countUp);
  }, []);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="w-full min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-br from-black via-indigo-900 to-purple-900 text-white">
      {/* Header Section */}
      <section
        id="header"
        className="relative w-full flex items-center justify-center overflow-hidden py-40"
      >
        <motion.div
          style={{ scale, opacity }}
          className="text-center max-w-4xl space-y-6 z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-600"
          >
            HackKU 2025
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-2xl text-gray-300"
          >
            Forge Your Legacy. Seize the Magic.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center space-x-4 text-4xl font-bold"
          >
            {Object.entries(timeRemaining).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                <span className="text-5xl">
                  {value
                    .toString()
                    .padStart(unit === "milliseconds" ? 3 : 2, "0")}
                </span>
                <span className="text-sm uppercase text-gray-400">{unit}</span>
              </div>
            ))}
          </motion.div>
          {/* Event Dates */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-6 text-xl text-gray-300"
          >
            April 4th - April 6th, 2025
          </motion.p>
          {/* Register Now Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-8"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition duration-300"
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

      {/* Prize Money Section */}
      <section className="relative w-full py-24 flex items-center justify-center bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-600">
            Total Prize Money:{" "}
            <span className="text-yellow-500">${prizeAmount}</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Compete for a chance to win amazing prizes!
          </p>
        </motion.div>
      </section>

      {/* Tracks Section */}
      <TracksSection />

      {/* Sponsors Section */}
      <SponsorsSection />

      {/* Final Call to Action Section */}
      <section className="relative w-full py-24 flex items-center justify-center bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-600">
            Ready to Embark on Your Quest?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            The countdown has begun. Gather your companions, wield your
            creativity, and prepare to forge your legacy at HackKU 2025!
          </p>
          <Link href="signin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              Join the Quest
            </motion.button>
          </Link>
        </motion.div>
      </section>
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
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-600">
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
    { id: 1, name: "Company A", logo: "/images/company-a.png" },
    { id: 2, name: "Company B", logo: "/images/company-b.png" },
    { id: 3, name: "Company C", logo: "/images/company-c.png" },
    { id: 4, name: "Company D", logo: "/images/company-d.png" },
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
              width={150}
              height={50}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
