"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconBrandDiscord,
  IconCalendar,
  IconQuestionMark,
  IconUserPlus,
  IconAward,
  IconHome2,
} from "@tabler/icons-react"; // Import the icons
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const Header = ({ isRegistered }: { isRegistered: boolean }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Determine the active tab based on the current path
  const tabValueMapping: { [key: string]: string } = {
    "/": "home",
    "/schedule": "schedule",
    "/faq": "faq",
    "/tracks": "tracks",
    "/register": "register",
  };

  const currentTab = pathname ? tabValueMapping[pathname] : ""; // Get the current tab value, or empty if not found

  // Track scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <motion.header
        initial={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
        animate={{
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0)"
            : "rgba(255, 255, 255, 1)",
        }}
        transition={{ duration: 0.15 }}
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-150 ${
          isScrolled ? "shadow-none border-none" : ""
        }`}
      >
        {/* Main Header Container */}
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between py-4">
            {/* Left Side - Logo */}
            <AnimatePresence>
              {!isScrolled && (
                <motion.div
                  className="w-1/3 flex items-center"
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/">
                    <motion.div
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, -5, 5, -5, 5, 0],
                      }}
                    >
                      <Image
                        src="/images/duck2.png"
                        width={50}
                        height={50}
                        alt="HackKU Logo"
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center - Navigation Links using Tabs */}
            <motion.div
              className="flex justify-center"
              initial={{ flex: 1, scale: 1 }}
              animate={{ scale: isScrolled ? 1.25 : 1, flex: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 100 }}
            >
              <Tabs defaultValue={currentTab} value={currentTab}>
                <TabsList className="space-x-0">
                  <TabsTrigger value="home" asChild>
                    <Link
                      href="/"
                      className="flex items-center text-lg font-medium"
                    >
                      <IconHome2 size={20} className="mr-2" /> Home
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="schedule" asChild>
                    <Link
                      href="/schedule"
                      className="flex items-center text-lg font-medium"
                    >
                      <IconCalendar size={20} className="mr-2" /> Schedule
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="tracks" asChild>
                    <Link
                      href="/tracks"
                      className="flex items-center text-lg font-medium"
                    >
                      <IconAward size={20} className="mr-2" /> Tracks
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="faq" asChild>
                    <Link
                      href="/faq"
                      className="flex items-center text-lg font-medium"
                    >
                      <IconQuestionMark size={20} className="mr-2" /> FAQ
                    </Link>
                  </TabsTrigger>
                  {/* Conditionally render Register link based on isRegistered */}
                  {!isRegistered && (
                    <TabsTrigger value="register" asChild>
                      <Link
                        href={isAuthenticated ? "/register" : "/signin"}
                        className="flex items-center text-lg font-medium"
                      >
                        <IconUserPlus size={20} className="mr-2" /> Register
                      </Link>
                    </TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
            </motion.div>

            {/* Right Side - Admin & Profile Buttons */}
            <AnimatePresence>
              {!isScrolled && (
                <motion.div
                  className="w-1/3 flex justify-end space-x-4"
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Admin Button */}
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline" className="text-sm">
                        Admin
                      </Button>
                    </Link>
                  )}
                  {/* Regular Discord Button */}
                  <Link
                    href="https://discord.com/invite/AJXm3k6xWq"
                    target="_blank"
                  >
                    <Button variant="outline" className="text-sm">
                      <IconBrandDiscord size={20} />
                    </Button>
                  </Link>
                  {/* Profile or Sign In Button */}
                  <Link href={isAuthenticated ? "/profile" : "/signin"}>
                    <Button variant="outline" className="text-sm">
                      {isAuthenticated ? "Profile" : "Sign In"}
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Banner Section */}
      {isScrolled && (
        <div className="fixed top-0 right-20 z-40">
          <Link
            href="https://mlh.io/seasons/2025/events"
            className="transition-transform duration-300 transform hover:scale-110"
          >
            <Image
              src="/images/mlh-badge.svg"
              alt="MLH Badge"
              width={75}
              height={300} // Adjust height as needed
              className="transition-transform duration-300 transform hover:scale-110"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;
