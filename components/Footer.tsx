"use client";

import Link from "next/link";
import {
  IconBrandInstagram,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandDiscord,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-6 w-full">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Social Links on the left */}
        <div className="flex space-x-4">
          <Link
            href="https://discord.com/invite/AJXm3k6xWq"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            <IconBrandDiscord size={20} />
          </Link>
          <Link
            href="https://instagram.com"
            className="text-gray-400 hover:text-pink-600 transition-colors"
          >
            <IconBrandInstagram size={20} />
          </Link>
          <Link
            href="https://linkedin.com"
            className="text-gray-400 hover:text-blue-700 transition-colors"
          >
            <IconBrandLinkedin size={20} />
          </Link>
          <Link
            href="https://github.com"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <IconBrandGithub size={20} />
          </Link>
        </div>

        {/* Text on the right */}
        <div className="text-right">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HackKU. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Designed by the HackKU Team. LFK
          </p>
        </div>
      </div>
    </footer>
  );
}
