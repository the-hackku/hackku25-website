// scripts/zipResumes.ts

import fetch from "node-fetch";
// import { prisma } from "../lib/prisma.ts"; //swap with this when running node scripts/zipResumes.ts
import { prisma } from "../lib/prisma";
import AdmZip from "adm-zip";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper: Fetch file from a resume URL
async function fetchResumeBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  // 1. Fetch all users with resumeUrl
  const participants = await prisma.participantInfo.findMany({
    where: { resumeUrl: { not: null } },
    select: {
      resumeUrl: true,
      user: { select: { email: true } },
    },
  });

  console.log(`Found ${participants.length} resumes.`);

  const zip = new AdmZip();

  // 2. Download and add each resume to the ZIP
  for (const { resumeUrl, user } of participants) {
    if (!resumeUrl || !resumeUrl.trim()) {
      console.warn(`⚠️ Skipping ${user.email}: No valid resume URL`);
      continue;
    }

    try {
      const fileName = `${user.email.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      const fileBuffer = await fetchResumeBuffer(resumeUrl);
      zip.addFile(fileName, fileBuffer);
      console.log(`✅ Added ${fileName}`);
    } catch (error) {
      console.error(`❌ Failed to add ${user.email}:`, error);
    }
  }

  // 3. Save ZIP file locally
  const outputPath = resolve(__dirname, "all-resumes.zip");
  zip.writeZip(outputPath);
  console.log(`📦 Created ZIP: ${outputPath}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
