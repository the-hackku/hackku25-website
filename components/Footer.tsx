"use client";

import Link from "next/link";
import {
  IconBrandInstagram,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandDiscord,
} from "@tabler/icons-react";
import constants from "@/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-6 w-full">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Social Links on the left */}
        <div className="flex space-x-4">
          <Link
            href={constants.discordInvite}
            target="_blank"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            <IconBrandDiscord size={20} />
          </Link>
          <Link
            href="https://www.instagram.com/thehackku/"
            target="_blank"
            className="text-gray-400 hover:text-pink-600 transition-colors"
          >
            <IconBrandInstagram size={20} />
          </Link>
          <Link
            href="https://www.linkedin.com/company/hackku/about/"
            target="_blank"
            className="text-gray-400 hover:text-blue-700 transition-colors"
          >
            <IconBrandLinkedin size={20} />
          </Link>
          <Link
            href="https://github.com/the-hackku/hackku25-website"
            target="_blank"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <IconBrandGithub size={20} />
          </Link>
        </div>

        {/* Text on the right */}
        <div className="text-right">
          <p className="text-sm text-gray-500">
            ©{new Date().getFullYear()} HackKU25 Team
          </p>
        </div>
      </div>
    </footer>
  );
}
