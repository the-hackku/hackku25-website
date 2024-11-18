"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { IconAlertCircle, IconX } from "@tabler/icons-react";

export default function RegisterAlert() {
  const [visible, setVisible] = useState(true);

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
          <Alert variant="destructive" className="rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IconAlertCircle className="text-red-600" />
                <div>
                  <h4 className="font-semibold">Incomplete Registration</h4>
                  <p>
                    Complete your registration{" "}
                    <Link href="/register" className="underline">
                      here
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVisible(false)}
                aria-label="Close alert"
              >
                <IconX className="text-red-600" />
              </button>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
