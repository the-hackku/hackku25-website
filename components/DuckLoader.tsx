"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const DuckLoader = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Track when the component is mounted

  useEffect(() => {
    setIsMounted(true); // Set mounted to true on client-side render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show the loader for 1 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {isMounted &&
          isLoading && ( // Only render the loader when mounted
            <motion.div
              className="fixed inset-0 bg-black flex items-center justify-center z-50"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src="/images/duck2.png"
                alt="Loading Duck"
                className="h-24 w-24"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  type: "spring", // Use a spring animation type
                  stiffness: 50, // Control the spring tightness
                  damping: 8, // Control the amount of bounce
                  mass: 0.5, // Mass affects how bouncy it feels
                  duration: 0.8, // Animation duration
                  repeat: Infinity, // Loop the animation infinitely
                  repeatType: "loop", // Loop type
                }}
              />
            </motion.div>
          )}
      </AnimatePresence>
      {/* Render the children once loading is complete */}
      {!isLoading && <div className="relative z-0">{children}</div>}
    </div>
  );
};

export default DuckLoader;
