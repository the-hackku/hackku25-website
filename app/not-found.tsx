// app/not-found.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 ">
      {/* Playful animated duck */}
      <motion.div
        whileHover={{
          scale: 1.2, // Slightly increase the size on hover
          rotate: 10,
          transition: { type: "spring", stiffness: 500 }, // Smooth bounce effect
        }}
        whileTap={{ scale: 0.9, rotate: -10 }} // Shrink and rotate back on click
      >
        <Image
          src="/images/duck2.png"
          width={200}
          height={200}
          alt="404 Not Found"
        />
      </motion.div>

      {/* Alert with playful message */}
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertTitle>Not the duck you&apos;re looking for!</AlertTitle>
        <AlertDescription>
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </AlertDescription>
      </Alert>

      {/* Button to go back to home */}
      <Button variant="outline" size="lg" onClick={() => router.push("/")}>
        Go Back to Home
      </Button>
    </div>
  );
}
