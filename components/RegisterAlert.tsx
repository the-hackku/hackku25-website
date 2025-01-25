"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertCircle } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterAlert() {
  const pathname = usePathname(); // Get the current route

  // Don't show the alert on the /register page
  if (pathname === "/register" || pathname === "/schedule") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 right-0 w-full max-w-sm px-4 pb-4 z-50"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div className="rounded-lg bg-red-50 text-red-700 shadow-md">
          <Alert variant="destructive" className="rounded-lg p-3">
            <div className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <IconAlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <Link href="/register">
                    <AlertTitle className="font-semibold text-lg">
                      Incomplete Registration
                    </AlertTitle>
                    <AlertDescription className="mt-1 text-sm">
                      Complete your registration <u>here</u>.
                    </AlertDescription>
                  </Link>
                </div>
              </div>
            </div>
          </Alert>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
