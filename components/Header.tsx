"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconCalendar,
  IconCalendarFilled,
  IconAward,
  IconAwardFilled,
  IconHome2,
  IconUser,
  IconHomeFilled,
  IconUserFilled,
  IconUserStar,
} from "@tabler/icons-react"; // Import the icons, both regular and filled variants
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
    "/profile": "profile",
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
                  key="logo" // Add unique key
                  className="w-1/3 flex items-center"
                  initial={{ opacity: 0, x: -100 }}
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
                      {currentTab === "home" ? (
                        <IconHomeFilled size={20} className="mr-2" />
                      ) : (
                        <IconHome2 size={20} className="mr-2" />
                      )}
                      Home
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="schedule" asChild>
                    <Link
                      href="/schedule"
                      className="flex items-center text-lg font-medium"
                    >
                      {currentTab === "schedule" ? (
                        <IconCalendarFilled size={20} className="mr-2" />
                      ) : (
                        <IconCalendar size={20} className="mr-2" />
                      )}
                      Schedule
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="tracks" asChild>
                    <Link
                      href="/tracks"
                      className="flex items-center text-lg font-medium"
                    >
                      {currentTab === "tracks" ? (
                        <IconAwardFilled size={20} className="mr-2" />
                      ) : (
                        <IconAward size={20} className="mr-2" />
                      )}
                      Tracks
                    </Link>
                  </TabsTrigger>

                  {!isRegistered && (
                    <TabsTrigger value="register" asChild>
                      <Link
                        href={isAuthenticated ? "/register" : "/signin"}
                        className="flex items-center text-lg font-medium"
                      >
                        {currentTab === "register" ? (
                          <IconUserFilled size={20} className="mr-2" />
                        ) : (
                          <IconUser size={20} className="mr-2" />
                        )}
                        Register
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
                  key="right-elements" // Add unique key
                  className="w-1/3 flex justify-end space-x-4"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Admin Button */}
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline" className="text-sm">
                        <IconUserStar size={20} />
                      </Button>
                    </Link>
                  )}
                  {/* Profile or Sign In Button */}
                  <Link href={isAuthenticated ? "/profile" : "/signin"}>
                    <Button variant="outline" className="text-sm">
                      {currentTab === "profile" ? (
                        <IconUserFilled size={20} className="mr-1" />
                      ) : (
                        <IconUser size={20} className="mr-1" />
                      )}
                      {isAuthenticated ? "Account" : "Sign In"}
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
