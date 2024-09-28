"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ChevronDown, Clock, Calendar, Users, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function Component() {
  const eventDate = new Date("2025-04-04T08:00:00");
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="w-full min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale, opacity }}
          className="text-center max-w-4xl space-y-6 z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            HackKU 2025
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-2xl text-gray-300"
          >
            Innovate. Create. Compete.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center space-x-4 text-4xl font-bold"
          >
            {Object.entries(timeRemaining).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                <span className="text-5xl">{value}</span>
                <span className="text-sm uppercase text-gray-400">{unit}</span>
              </div>
            ))}
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
          className="absolute bottom-10"
        >
          <ChevronDown size={40} className="text-gray-400" />
        </motion.div>
      </section>

      {/* What to Expect Section */}
      <Section
        icon={<Lightbulb className="w-12 h-12 mb-4 text-yellow-400" />}
        title="What to Expect at HackKU"
        description="Embark on a 36-hour journey of innovation, collaboration, and creation. From coding challenges to hardware hacks, prepare for an unforgettable weekend of tech exploration and breakthrough ideas."
      />

      {/* Important Dates & Times Section */}
      <Section
        icon={<Calendar className="w-12 h-12 mb-4 text-green-400" />}
        title="Important Dates & Times"
        description="Mark your calendars! HackKU 2025 kicks off on April 4th at 8:00 AM sharp. Early check-in starts at 7:30 AM - be there to claim your exclusive hackathon swag and prime hacking spot!"
      />

      {/* Resources Section */}
      <Section
        icon={<Users className="w-12 h-12 mb-4 text-blue-400" />}
        title="Resources at Your Fingertips"
        description="Access a wealth of support including expert mentors, cutting-edge workshops, and state-of-the-art hardware labs. Whether you're a coding novice or a tech wizard, we've got the tools to elevate your project to the next level."
      />

      {/* Final Call to Action Section */}
      <section className="relative w-full py-24 flex items-center justify-center bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Ready to Hack the Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            The countdown has begun. Gather your team, fuel your creativity, and
            prepare to push the boundaries of innovation at HackKU 2025!
          </p>
          <Link href="signin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              Register Now
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Section({ icon, title, description }: SectionProps) {
  return (
    <section className="w-full py-24 flex items-center justify-center bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center"
      >
        {icon}
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {title}
        </h2>
        <p className="text-xl text-gray-300">{description}</p>
      </motion.div>
    </section>
  );
}
