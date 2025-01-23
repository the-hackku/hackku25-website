"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertCircle, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterAlert() {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 right-0 w-full max-w-sm px-4 pb-4 z-50"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div className="rounded-lg bg-red-50 text-red-700 shadow-md">
            <Alert variant="destructive" className="rounded-lg p-3">
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3">
                  <IconAlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <Link href="/register" onClick={handleClose}>
                      <AlertTitle className="font-semibold text-lg">
                        Incomplete Registration
                      </AlertTitle>
                      <AlertDescription className="mt-1 text-sm">
                        Complete your registration <u>here</u>.
                      </AlertDescription>
                    </Link>
                  </div>
                </div>
                <button onClick={handleClose} aria-label="Close alert">
                  <IconX className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </Alert>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
