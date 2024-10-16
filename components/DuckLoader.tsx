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
        {isMounted && isLoading && (
          <>
            {/* Background Fade-Out Effect */}
            <motion.div
              className="fixed inset-0 bg-white z-40" // Background layer with z-index lower than the loader image
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {/* Loader Animation */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50" // Loader container with higher z-index
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.img
                src="/images/duck2.png"
                alt="Loading Duck"
                className="h-24 w-24"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 8,
                  mass: 0.5,
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Render the children once loading is complete */}
      {!isLoading && <div className="relative z-0">{children}</div>}
    </div>
  );
};

export default DuckLoader;
