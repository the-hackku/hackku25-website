"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconCalendar,
  IconCalendarFilled,
  IconHome2,
  IconHomeFilled,
  IconMenu2,
  IconUser,
  IconQrcode,
  IconScan,
  IconUserFilled,
  IconBolt,
  IconStar,
  IconInfoCircle,
  IconInfoCircleFilled,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "next-auth/react";

const Header = ({ isAdmin }: { isAdmin: boolean }) => {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [hasLoaded, setHasLoaded] = useState(false);
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";

  // Store the previous scroll position in a ref
  const prevScrollY = useRef(0);

  const pathname = usePathname();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  // Are we on the homepage?
  const isHomePage = pathname === "/";

  // Track scroll direction & threshold
  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 2. Determine scroll direction
      if (currentScrollY > prevScrollY.current) {
        // Scrolling down
        setScrollDirection("down");
      } else {
        // Scrolling up
        setScrollDirection("up");
      }

      // Update previous scroll position
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Mark as loaded after the first render
  useEffect(() => {
    setHasLoaded(true);
  }, []);

  // Decide header position & background
  let headerPosition = "sticky";
  let headerBackground = "bg-white";

  if (isHomePage) {
    headerPosition = "fixed";
    headerBackground = "bg-transparent";
  }

  // Tab logic for highlighting active route
  const tabValueMapping = useMemo(
    () => ({
      "/": "home",
      "/schedule": "schedule",
      "/faq": "faq",
      "/info": "info",
      "/profile": "profile",
      "/signin": "profile",
      "/admin": "admin",
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

  const shouldShowHeader = scrollDirection === "up";

  const scale = scrollDirection === "down" ? 1.25 : 1.0;
  const hoverScale = scrollDirection === "down" ? 1.3 : 1.1;

  return (
    <AnimatePresence>
      {shouldShowHeader && (
        <motion.header
          key="header"
          className={`
          ${headerPosition} top-0 left-0 right-0 z-50
          px-4 py-4
          ${headerBackground}
          backdrop-blur-md bg-white/80 lg:backdrop-blur-none lg:bg-transparent
        `}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <AnimatePresence>
                {scrollDirection === "up" && (
                  <motion.div
                    key="logo"
                    className="w-1/3 lg:flex items-center hidden lg:visible"
                    initial={hasLoaded ? { y: -100, opacity: 0 } : false} // No animation on load
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Link href="/" onClick={handleLogoClick}>
                      <motion.div className="drop-shadow-md hover:drop-shadow-lg">
                        <Image
                          src="/images/branding/logo_black.png"
                          width={75}
                          height={75}
                          alt="HackKU Logo"
                          className="w-auto h-12 md:h-10"
                          priority={true}
                        />
                      </motion.div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Menu */}
              <header className="lg:hidden w-full">
                <div className="grid grid-cols-2 items-center w-full">
                  {/* Left: Logo */}
                  <div className="flex justify-start">
                    <Link href="/" onClick={handleLogoClick}>
                      <Image
                        src="/images/branding/logo_black.png"
                        width={60}
                        height={60}
                        alt="HackKU Logo"
                        className="h-10 w-auto"
                      />
                    </Link>
                  </div>

                  {/* Right: Burger */}
                  <div className="flex justify-end items-center gap-3">
                    {isAuthenticated && (
                      <Link href="/profile">
                        <IconQrcode size={36} />
                      </Link>
                    )}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" className="p-0">
                          <IconMenu2 size={36} />
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
                                Info
                              </span>
                            </SheetClose>
                          </Link>

                          <Link href="/profile" passHref>
                            <SheetClose asChild>
                              <span className="flex items-center text-xl">
                                <IconUser size={24} className="mr-2" />
                                {isAuthenticated ? "Profile" : "Sign In"}
                              </span>
                            </SheetClose>
                          </Link>
                          <hr className="my-4" />
                          {isAdmin && (
                            <>
                              <Link href="/admin" passHref>
                                <SheetClose asChild>
                                  <span className="flex items-center text-xl">
                                    <IconStar size={24} className="mr-2" />
                                    Admin Panel
                                  </span>
                                </SheetClose>
                              </Link>
                              <Link href="/admin/scanner" passHref>
                                <SheetClose asChild>
                                  <span className="flex items-center text-xl">
                                    <IconScan size={24} className="mr-2" />
                                    Scan Hackers
                                  </span>
                                </SheetClose>
                              </Link>
                            </>
                          )}
                        </nav>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </header>

              {/* Center Tabs (Always Visible) (Desktop Only) */}
              <motion.div
                className={`hidden lg:flex justify-center flex-1 ${
                  isHomePage ? "drop-shadow-lg" : "drop-shadow-md"
                }`}
                initial={{ flex: 1, scale: 1 }}
                animate={{
                  scale: scale,
                }}
                whileHover={{
                  scale: hoverScale,
                }}
                transition={{ duration: 0.25 }}
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
                        Info
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger value="profile" asChild>
                      <Link href="/profile">
                        {currentTab === "profile" ? (
                          <IconUserFilled size={20} className="mr-2" />
                        ) : (
                          <IconUser size={20} className="mr-2" />
                        )}
                        {
                          // Show "Sign In" if not authenticated
                          isAuthenticated ? "Profile" : "Sign In"
                        }
                      </Link>
                    </TabsTrigger>
                    {isAdmin && (
                      <TabsTrigger value="admin" asChild>
                        <Link href="/admin">
                          <IconBolt size={20} className="mr-2" />
                          Admin
                        </Link>
                      </TabsTrigger>
                    )}
                  </TabsList>
                </Tabs>
              </motion.div>

              {/* Right Side */}
              <AnimatePresence>
                {scrollDirection === "up" && (
                  <motion.div
                    key="right-elements"
                    className={`hidden lg:flex w-1/3 justify-end space-x-4 ${
                      isHomePage ? "drop-shadow-lg" : "drop-shadow-sm"
                    }`}
                    initial={hasLoaded ? { y: -100, opacity: 0 } : false} // No animation on load
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* MLH Badge */}
                    <div className="absolute -top-10 z-50">
                      <Link
                        href="https://mlh.io/seasons/2025/events"
                        target="_blank"
                        passHref
                        className="drop-shadow-lg" // Apply drop shadow
                      >
                        <motion.div
                          whileHover={{
                            scale: 1.05,
                            y: 5,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <Image
                            src="/images/mlh-badge.svg"
                            alt="MLH Badge"
                            width={pathname === "/schedule" ? 100 : 200}
                            height={pathname === "/schedule" ? 100 : 200}
                            className="w-auto h-24"
                            priority={true}
                          />
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default Header;
