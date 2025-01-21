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

const SCROLL_THRESHOLD = 20;

const Header = ({ isAdmin }: { isAdmin: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Are we on the homepage?
  const isHomePage = pathname === "/";

  // Watch scroll to toggle the isScrolled state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Decide header position & background
  let headerPosition = "sticky";
  let headerBackground = "bg-white"; // default for non-home pages

  if (isHomePage) {
    headerPosition = "fixed"; // Change from 'sticky' to 'fixed'
    headerBackground = "bg-transparent"; // Keep transparent background
  }

  // Tab logic for highlighting active route
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

  const [currentTab, setCurrentTab] = useState(
    pathname
      ? tabValueMapping[pathname as keyof typeof tabValueMapping] || ""
      : ""
  );

  useEffect(() => {
    setCurrentTab(
      pathname
        ? tabValueMapping[pathname as keyof typeof tabValueMapping] || ""
        : ""
    );
  }, [pathname, tabValueMapping]);

  const handleLogoClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        className={`
          ${headerPosition} top-0 left-0 right-0 z-50
          px-4
          transition-colors duration-300
          ${headerBackground}
        `}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <AnimatePresence>
              <motion.div
                key="logo"
                className="w-1/3 flex items-center"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/" onClick={handleLogoClick}>
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Image
                      src="/images/branding/logo_black.png"
                      width={75}
                      height={75}
                      alt="HackKU Logo"
                    />
                  </motion.div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Menu */}
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

            {/* Nav Tabs (Desktop) */}
            <motion.div
              className={`hidden lg:flex justify-center flex-1 ${
                isHomePage ? "drop-shadow-lg" : "drop-shadow-sm"
              }`}
              initial={{ flex: 1, scale: 1 }}
              animate={{ scale: isScrolled ? 1.25 : 1 }}
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

            {/* Right Side */}
            <AnimatePresence>
              <motion.div
                key="right-elements"
                className={`hidden lg:flex w-1/3 justify-end space-x-4 ${
                  isHomePage ? "drop-shadow-lg" : "drop-shadow-sm"
                }`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
              >
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" className="text-sm">
                      <IconUserStar size={20} />
                    </Button>
                  </Link>
                )}
                <Link href="/profile">
                  <Button variant="outline" className="text-sm">
                    <IconUser size={20} className="mr-2" />
                    Profile
                  </Button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
