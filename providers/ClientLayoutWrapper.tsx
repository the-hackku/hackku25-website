"use client";

import { usePathname } from "next/navigation";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine the className based on the pathname
  const mainContentClass =
    pathname === "/" ? "flex-grow" : "flex-grow container mx-auto";

  return <main className={`flex-grow ${mainContentClass}`}>{children}</main>;
}
