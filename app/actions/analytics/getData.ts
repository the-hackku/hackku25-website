"use server";

import { prisma } from "@/prisma";
import { cleanText } from "@/utils/textCleaning";

// Fetch raw dietary restrictions (NO PROCESSING)
export async function getDietaryData() {
  const participants = await prisma.participantInfo.findMany({
    select: { dietaryRestrictions: true },
  });

  return participants.map((p) => cleanText(p.dietaryRestrictions || ""));
}

const IGNORE_PHRASES = ["none", "no special accommodations", "n/a", "na", "no"];

/** 🔹 Fetch raw accessibility accommodations */
export async function getAccessibilityData() {
  const participants = await prisma.participantInfo.findMany({
    select: { specialAccommodations: true },
  });

  return participants
    .map((p) =>
      cleanText(p.specialAccommodations || "")
        .trim()
        .toLowerCase()
    )
    .filter((entry) => entry && !IGNORE_PHRASES.includes(entry)); // ✅ Removes irrelevant data
}
