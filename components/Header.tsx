"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconBrandDiscord } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
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
    "/register": "register",
  };

  const currentTab = pathname ? tabValueMapping[pathname] : ""; // Get the current tab value, or empty if not found

  // Track scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      animate={{
        backgroundColor: isScrolled
          ? "rgba(255, 255, 255, 0)"
          : "rgba(255, 255, 255, 0.8)",
      }}
      transition={{ duration: 0.15 }} // Shortened the animation duration
      className={`sticky top-0 z-50 transition-all duration-150 ${
        isScrolled ? "shadow-none border-none" : ""
      }`}
      style={{ borderBottom: "none", boxShadow: "none" }} // Remove border and shadow explicitly
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
                transition={{ duration: 0.3 }} // Adjusted the exit animation duration
              >
                <Link href="/">
                  <Image
                    src="/images/duck2.png"
                    width={50}
                    height={50}
                    alt="HackKU Logo"
                  />
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
              <TabsList className="space-x-4">
                <TabsTrigger value="home" asChild>
                  <Link href="/" className="text-lg font-medium">
                    Home
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="schedule" asChild>
                  <Link href="/schedule" className="text-lg font-medium">
                    Schedule
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="faq" asChild>
                  <Link href="/faq" className="text-lg font-medium">
                    FAQ
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="register" asChild>
                  <Link
                    href={isAuthenticated ? "/register" : "/signin"}
                    className="text-lg font-medium"
                  >
                    Register
                  </Link>
                </TabsTrigger>
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
                transition={{ duration: 0.3 }} // Adjusted the exit animation duration
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
  );
};

export default Header;
