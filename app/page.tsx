"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SponsorsSection from "@/components/homepage/SponsorsSection";
import TeamSection from "@/components/homepage/TeamSection";
import AboutSection from "@/components/homepage/AboutSection";
import AllSvg from "@/components/homepage/svg/AllSvg";

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
  ];

  return (
    <div className="w-full min-h-screen overflow-x-hidden overflow-y-auto text-white font-agency">
      {/* Header Section */}

      <section
        id="header"
        className="relative w-full h-screen flex items-center justify-center md:justify-start overflow-hidden pb-40 pt-32 md:pb-96 md:pt-48 md:px-40"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
      >

        <motion.div
          className="z-10 max-w-[80%] text-center md:text-left md:max-w-[60%]"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: isMouseOver
              ? "transform .1s ease-out"
              : "transform 1s ease-out",
            textShadow: `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000`,
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-lg"
          >
            APRIL 4th - 6th, 2025
          </motion.p>

          {/* Event Title */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-7xl md:text-8xl font-dfvn drop-shadow-lg"
            style={{ textShadow: "2px 2px 0 black" }}
          >
            HackKU25
          </motion.h1>

          {/* Event Host */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl md:text-3xl"
          >
            @{" "}
            <Link
              href="https://maps.app.goo.gl/g2MHMwYqWsaYvLSL9"
              target="_blank"
              className="hover:underline md:text-white"
            >
              THE UNIVERSITY OF KANSAS
            </Link>
          </motion.p>

          {/* Register Now Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-5 bg-yellow-500 rounded-full text-3xl md:text-2xl text-black font-agency md:px-6 md:py-3"
              >
                Register Now!
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

        {/* Background SVG */}
        <div className="absolute bottom-0 left-[32%] transform -translate-x-[32%] z-0 w-full h-full">
          <AllSvg className="w-full h-full object-cover"/>
        </div>
      </section>

      <AboutSection previousEvents={previousEvents} />
      <SponsorsSection sponsorTiers={sponsorTiers} sponsors={sponsors} />
      <TeamSection teamMembers={teamMembers} />
    </div>
  );
}
