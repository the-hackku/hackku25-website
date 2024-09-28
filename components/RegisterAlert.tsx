"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertCircle } from "@tabler/icons-react";
import { motion } from "framer-motion";

// Define prop types for RegisterAlert
interface RegisterAlertProps {
  isRegistered: boolean;
}

export default function RegisterAlert({ isRegistered }: RegisterAlertProps) {
  // Show the alert if the user is not registered
  if (isRegistered) {
    return null;
  }

  return (
    <motion.div
      className="w-full mt-4 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ boxShadow: "0 0 5px rgba(239, 68, 68, 0.3)" }}
        animate={{
          boxShadow: [
            "0 0 5px rgba(239, 68, 68, 0.3)",
            "0 0 15px rgba(239, 68, 68, 0.6)",
            "0 0 5px rgba(239, 68, 68, 0.3)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-4 w-full max-w-4xl mx-auto rounded-lg border border-red-200 bg-red-50 text-red-700 shadow-md"
      >
        <Alert variant="destructive" className="rounded-lg">
          <div className="flex items-center space-x-3">
            <IconAlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <AlertTitle className="font-semibold text-lg">
                Incomplete Registration
              </AlertTitle>
              <AlertDescription className="mt-1 text-sm">
                Your registration is incomplete. Please complete it{" "}
                <u>
                  <Link href="/register" className="text-red-700 underline">
                    here
                  </Link>
                </u>
                .
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </motion.div>
    </motion.div>
  );
}
