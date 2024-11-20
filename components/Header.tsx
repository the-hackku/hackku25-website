"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconCalendar,
  IconCalendarFilled,
  IconHome2,
  IconHomeFilled,
  IconUserStar,
  IconMenu2,
  IconInfoCircle,
  IconInfoCircleFilled,
  IconUser,
  IconQrcode,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = ({ isAdmin }: { isAdmin: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Check if the screen width is desktop
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  // Determine the active tab based on the current path
  const tabValueMapping = useMemo(
    () => ({
      "/": "home",
      "/schedule": "schedule",
      "/faq": "faq",
      "/info": "info",
      "/profile": "profile",
    }),
    []
  );

  // Set current tab based on pathname
  const [currentTab, setCurrentTab] = useState(
    pathname
      ? tabValueMapping[pathname as keyof typeof tabValueMapping] || ""
      : ""
  );

  // Update current tab whenever pathname changes
  useEffect(() => {
    setCurrentTab(
      pathname
        ? tabValueMapping[pathname as keyof typeof tabValueMapping] || ""
        : ""
    );
  }, [pathname, tabValueMapping]);

  // Track scroll event
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden px-4 ${
          isDesktop ? (isScrolled ? "bg-transparent" : "bg-white") : "bg-white"
        }`}
      >
        <div className="container mx-auto max-w-7xl overflow-hidden">
          <div className="flex items-center justify-between py-4">
            {/* Left Side - Logo */}
            <AnimatePresence>
              {(!isScrolled || !isDesktop) && (
                <motion.div
                  key="logo"
                  className="w-1/3 flex items-center"
                  initial={isDesktop ? { opacity: 0, x: -100 } : {}}
                  animate={isDesktop ? { opacity: 1, x: 0 } : {}}
                  exit={isDesktop ? { opacity: 0, x: -100 } : {}}
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

            {/* Mobile Burger Menu */}
            <header className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <IconMenu2 size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col space-y-4 pt-4">
                    <Link href="/" passHref>
                      <SheetClose asChild>
                        <span className="flex items-center text-xl">
                          <IconHome2 size={24} className="mr-2" />
                          Home
                        </span>
                      </SheetClose>
                    </Link>
                    <Link href="/schedule" passHref>
                      <SheetClose asChild>
                        <span className="flex items-center text-xl">
                          <IconCalendar size={24} className="mr-2" />
                          Schedule
                        </span>
                      </SheetClose>
                    </Link>
                    <Link href="/info" passHref>
                      <SheetClose asChild>
                        <span className="flex items-center text-xl">
                          <IconInfoCircle size={24} className="mr-2" />
                          HackerDoc
                        </span>
                      </SheetClose>
                    </Link>
                    <Link href="/profile" passHref>
                      <SheetClose asChild>
                        <span className="flex items-center text-xl">
                          <IconUser size={24} className="mr-2" />
                          My Profile
                        </span>
                      </SheetClose>
                    </Link>
                    {isAdmin && (
                      <>
                        <hr className="my-4" />
                        <Link href="/admin/scanner" passHref>
                          <SheetClose asChild>
                            <span className="flex items-center text-xl">
                              <IconQrcode size={24} className="mr-2" />
                              Admin Scanner
                            </span>
                          </SheetClose>
                        </Link>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </header>

            {/* Center - Navigation Links using Tabs (for larger screens) */}
            <motion.div
              className="hidden lg:flex justify-center flex-1"
              initial={{ flex: 1, scale: 1 }}
              animate={isDesktop && isScrolled ? { scale: 1.25 } : { scale: 1 }}
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
                  <TabsTrigger value="info" asChild>
                    <Link
                      href="/info"
                      className="flex items-center text-lg font-medium"
                    >
                      {currentTab === "info" ? (
                        <IconInfoCircleFilled size={20} className="mr-2" />
                      ) : (
                        <IconInfoCircle size={20} className="mr-2" />
                      )}
                      HackerDoc
                    </Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>

            {/* Right Side - Admin & Profile Buttons */}
            <AnimatePresence>
              {(!isScrolled || !isDesktop) && (
                <motion.div
                  key="right-elements"
                  className="hidden lg:flex w-1/3 justify-end space-x-4"
                  initial={isDesktop ? { opacity: 0, x: 100 } : {}}
                  animate={isDesktop ? { opacity: 1, x: 0 } : {}}
                  exit={isDesktop ? { opacity: 0, x: 100 } : {}}
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
                  {/* Profile Button */}
                  <Link href="/profile">
                    <Button variant="outline" className="text-sm">
                      <IconUser size={20} className="mr-2" />
                      Profile
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
