import { PrismaClient } from "@prisma/client";

declare global {
  // Extend the NodeJS global type with `prisma`
  export interface Global {
    prisma: PrismaClient | undefined;
  }
}

export const prisma =
  (global as unknown as Global).prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Optional: Add logging for debugging
  });

if (process.env.NODE_ENV !== "production")
  (global as unknown as Global).prisma = prisma;
