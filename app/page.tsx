"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import SponsorsSection from "@/components/homepage/SponsorsSection";
import AboutSection from "@/components/homepage/AboutSection";
import AllSvg from "@/components/homepage/svg/AllSvg";
import FAQSection from "@/components/homepage/FAQSection";
import { IconBrandDiscord } from "@tabler/icons-react";
import constants from "@/constants";
import TeamSection from "@/components/homepage/TeamSection";
import { useSession } from "next-auth/react";

// import TeamSection from "@/components/homepage/TeamSection";

export default function HomePage() {
  // const scrollToSection = (id: string) => {
  //   const target = document.getElementById(id);
  //   target?.scrollIntoView({ behavior: "smooth" });
  // };
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("header");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsSidebarVisible(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsSidebarVisible(false);
      }, 3000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("[id]");
    const validSectionIds = ["header", "about", "faq", "sponsors", "team"];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting && validSectionIds.includes(id)) {
          setActiveSection(id);
        }
      });
      entries.forEach((entry) => {
        console.log("Intersecting:", entry.target.id, entry.isIntersecting);
      });
    });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
      website: "https://jameshurd.net/",
    },
    {
      name: "Joshua Lee",
      role: "Vice Director",
      image: "/images/team/joshua.jpeg",
      linkedin: "https://www.linkedin.com/in/joshualee128/",
    },
    {
      name: "Anh Hoang",
      role: "Co-Director of Media & Marketing",
      image: "/images/team/anh.png",
      linkedin: "https://www.linkedin.com/in/anh-hoang-ku/",
    },
    {
      name: "David Westerhaus",
      role: "Co-Director of Media & Marketing",
      image: "/images/team/david.png",
      linkedin: "https://www.linkedin.com/in/davidwesterhaus/",
    },
    {
      name: "Sarah Moore",
      role: "Media & Marketing",
      image: "/images/team/sarah.png",
      linkedin: "https://www.linkedin.com/in/semoore27/",
    },
    {
      name: "Katharine Swann",
      role: "Media & Marketing",
      image: "/images/team/katharine.png",
      linkedin: "https://www.linkedin.com/in/katharine-swann-7379b9224/",
    },
    {
      name: "Achinth Ulagapperoli",
      role: "Media & Marketing",
      image: "/images/team/achinth.png",
      linkedin: "https://www.linkedin.com/in/achinth-ulagapperoli-323a52204/",
    },
    {
      name: "Ky Le",
      role: "Media & Marketing",
      image: "/images/team/ky.png",
      linkedin: "",
    },

    {
      name: "Will Whitehead",
      role: "Director of Technology",
      image: "/images/team/will.jpeg",
      linkedin: "https://l.willwhitehead.com/",
      website: "https://willwhitehead.com/",
    },
    {
      name: "Andrew Huang",
      role: "Technology",
      image: "/images/team/andrewhuang.png",
      linkedin: "https://www.linkedin.com/in/andrew-l-huang/",
    },
    {
      name: "Raven Duong",
      role: "Director of Logistics",
      image: "/images/team/raven.png",
      linkedin: "https://www.linkedin.com/in/raven-duong-0128h/",
    },
    {
      name: "Shayna Weinstein",
      role: "Logistics",
      image: "/images/team/shayna.jpg",
      linkedin: "https://www.linkedin.com/in/shayna-weinstein/",
    },
    {
      name: "Sreeja Narahari",
      role: "Logistics",
      image: "/images/team/sreeja.png",
      linkedin: "https://www.linkedin.com/in/sreeja-narahari/",
    },
    {
      name: "Kieran Egan",
      role: "Logistics & Director of Finance",
      image: "/images/team/kieran.png",
      linkedin: "https://www.linkedin.com/in/kieran-fo-egan/",
    },

    {
      name: "Trent Gould",
      role: "Director of Sponsorship",
      image: "/images/team/trent.png",
      linkedin: "https://www.linkedin.com/in/trent-gould/",
      website: "https://www.trent-gould.com/",
    },

    {
      name: "Drew Meyer",
      role: "Sponsorship",
      image: "/images/team/drew.png",
      linkedin: "https://www.linkedin.com/in/drewmeyer28/",
      website: "https://drewku42.github.io/AI_Dev_Portfolio/",
    },
    {
      name: "Kevinh Nguyen",
      role: "Sponsorship",
      image: "/images/team/kevinh.png",
      linkedin: "https://www.linkedin.com/in/kevinh-nguyen/",
    },

    {
      name: "Arul Sethi",
      role: "Co-Director of Nourishment",
      image: "/images/team/arul.png",
      linkedin: "https://www.linkedin.com/in/arul-sethi/",
    },
    {
      name: "Andrew Ha",
      role: "Co-Director of Nourishment",
      image: "/images/team/andrewha.png",
      linkedin: "https://www.linkedin.com/in/andrew~ha/",
    },
  ];

  const faqs = [
    {
      question: "What's a hackathon?",
      answer:
        "A hackathon is an event where individuals or teams come together to brainstorm, design, and build projects. It provides an environment to learn new skills, tackle real-world challenges, and create impactful solutions, with opportunities to network and compete for prizes!",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring a laptop, charger, and any hardware you plan to use. We also recommend bringing a change of clothes and toiletries.",
    },
    {
      question: "Who can participate?",
      answer:
        "Current students are welcome to participate. No prior experience is necessary! All High school students will require a chaperone.",
    },
    {
      question: "Is there a cost to attend?",
      answer:
        "No, HackKU is free to attend! We provide meals, swag, and resources for all participants.",
    },
    {
      question: "Can I participate remotely?",
      answer:
        "No, HackKU is an in-person event. We believe that the best experience comes from being on-site, collaborating with others, and engaging in the full hackathon experience.",
    },
    {
      question: "Do you offer travel reimbursements?",
      answer: (
        <>
          Yes! We offer travel reimbursements for participants who are traveling
          from outside of Lawrence, KS.
        </>
      ),
    },
  ];

  const sponsorTiers = ["Tera", "Giga", "Mega", "Kila", "Partner"];
  const sponsors = [
    {
      name: "Everly",
      logo: "/images/sponsors/everly.svg",
      website: "https://www.everlylife.com/",
      tier: "Tera",
    },
    {
      name: "Security Benefit",
      logo: "/images/sponsors/security.png",
      website: "https://www.securitybenefit.com",
      tier: "Tera",
    },
    {
      name: "Pella",
      logo: "/images/sponsors/pella.png",
      website: "https://www.pella.com/",
      tier: "Giga",
    },
    {
      name: "Ripple",
      logo: "/images/sponsors/ripple.png",
      website: "https://ripple.com/",
      tier: "Giga",
    },
    {
      name: "Garmin",
      logo: "/images/sponsors/garmin.svg",
      website: "https://www.garmin.com/en-US/",
      tier: "Mega",
    },
    {
      name: "H&R Block",
      logo: "/images/sponsors/hrblock.png",
      website: "https://www.hrblock.com/",
      tier: "Mega",
    },
    {
      name: "Payit",
      logo: "/images/sponsors/payit.png",
      website: "https://payitgov.com/",
      tier: "Mega",
    },
    {
      name: "Patient Safety",
      logo: "/images/sponsors/patient.png",
      website: "https://www.patientsafetytech.com/",
      tier: "Mega",
    },
    {
      name: "KU School of business",
      logo: "/images/sponsors/bschool.png",
      website: "https://business.ku.edu/",
      tier: "Kila",
    },
    {
      name: "Niantic 8th Wall",
      logo: "/images/sponsors/niantic.svg",
      website: "https://www.8thwall.com/niantic",
      tier: "Kila",
    },
    {
      name: "Peak Performance IT",
      logo: "/images/sponsors/peakperformance.png",
      website: "https://www.peakperformanceit.com/",
      tier: "Kila",
    },
    {
      name: "Pinnacle Technology",
      logo: "/images/sponsors/pinnacle.png",
      website: "https://pinnaclet.com/",
      tier: "Kila",
    },
    {
      name: "Tradebot",
      logo: "/images/sponsors/tradebot.webp",
      website: "https://www.tradebot.com",
      tier: "Kila",
    },
    {
      name: "Stand Out Stickers",
      logo: "/images/sponsors/sos.png",
      website: "http://hackp.ac/mlh-StandOutStickers-hackathons",
      tier: "Partner",
    },
    {
      name: "Redbull",
      logo: "/images/sponsors/redbull.svg",
      website: "https://www.redbull.com/us-en",
      tier: "Partner",
    },
    {
      name: "McClains",
      logo: "/images/sponsors/mcclains.png",
      website: "https://www.mclainskc.com/lawrence-iowast",
      tier: "Partner",
    },
    {
      name: "Globe Indian",
      logo: "/images/sponsors/globeindian.png",
      website: "https://www.globelawrence.com/",
      tier: "Partner",
    },
    {
      name: "Red Pepper",
      logo: "/images/sponsors/redpepper.png",
      website: "https://www.redpepperlawrenceks.com/",
      tier: "Partner",
    },
    {
      name: "La Estrella",
      logo: "/images/sponsors/laestrella.png",
      website: "https://laestrellamexicana.com/",
      tier: "Partner",
    },
    {
      name: "Eileens",
      logo: "/images/sponsors/eileens.jpg",
      website: "https://www.eileenscookies.com/store/lawrence/",
      tier: "Partner",
    },
    {
      name: "Wheatfields",
      logo: "/images/sponsors/wheatfields.png",
      website: "https://wheatfieldsbakery.com/",
      tier: "Partner",
    },
    {
      name: "Bubble Box",
      logo: "/images/sponsors/bubblebox.png",
      website: "https://www.instagram.com/bubbleboxlawrence/",
      tier: "Partner",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div
        onMouseEnter={() => {
          setIsSidebarVisible(true);
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        }}
        onMouseLeave={() => {
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = setTimeout(() => {
            setIsSidebarVisible(false);
          }, 3000);
        }}
        className={`fixed top-1/2 left-4 -translate-y-1/2 z-50 hidden md:flex flex-col space-y-4 transition-opacity duration-500 ${
          isSidebarVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {[
          { id: "header", label: "Home" },
          { id: "about", label: "About" },
          { id: "faq", label: "FAQ" },
          { id: "sponsors", label: "Sponsors" },
          { id: "team", label: "Team" },
        ].map(({ id, label }) => (
          <Link
            key={id}
            href={`#${id}`}
            className="flex items-center space-x-2 group"
          >
            <div
              className={`transition-all duration-500 ease-in-out rounded-full
        ${
          activeSection === id
            ? "bg-yellow-400 w-3 h-14"
            : "bg-gray-400 w-1 h-10"
        }
        group-hover:w-2 group-hover:bg-yellow-300`}
            />
            <span
              className={`text-sm px-2 py-1 rounded-md text-black transition-all duration-300
    ${
      activeSection === id
        ? "opacity-100 bg-yellow-400"
        : "opacity-0 group-hover:opacity-100 bg-gray-300"
    }`}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>

      <div className="w-full min-h-screen overflow-x-hidden text-white font-agency">
        {/* Header Section */}
        <section
          id="header"
          className="relative w-full h-screen flex items-center justify-center text-center md:justify-start md:text-left overflow-hidden pb-40 pt-32 md:pb-96 md:pt-48 md:px-40"
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
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-2xl drop-shadow-md"
              style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 1)" }}
            >
              APRIL 4th - 6th, 2025
            </motion.p>

            {/* Event Title */}
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-7xl md:text-8xl font-dfvn drop-shadow-lg"
              style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 1)" }}
            >
              HackKU25
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl md:text-3xl drop-shadow-md"
              style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)" }}
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

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 flex flex-row justify-center md:justify-start gap-2"
            >
              {session ? (
                <Link href="/schedule">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 bg-green-600 rounded-full text-2xl text-white font-agency"
                  >
                    View Schedule
                  </motion.button>
                </Link>
              ) : (
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 bg-yellow-500 rounded-full text-2xl text-black font-agency"
                  >
                    Register Now
                  </motion.button>
                </Link>
              )}

              <Link
                href={constants.discordInvite}
                target="_blank"
                className="ml-0"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 bg-blue-500 rounded-full text-2xl font-agency text-white flex items-center space-x-2"
                >
                  <span>Discord</span>
                  <IconBrandDiscord />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Background SVG */}
          <div className="absolute bottom-0 left-[32%] transform -translate-x-[32%] z-0 w-full h-full">
            <AllSvg className="w-full h-full object-cover" />
          </div>
        </section>
        <AboutSection previousEvents={previousEvents} id="about" />
        <FAQSection faqs={faqs} id="faq" />
        <SponsorsSection
          sponsorTiers={sponsorTiers}
          sponsors={sponsors}
          id="sponsors"
        />
        <TeamSection teamMembers={teamMembers} id="team" />
      </div>
    </motion.div>
  );
}
