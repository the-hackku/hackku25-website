"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function exportEmails(): Promise<string> {
  try {
    const users = await prisma.user.findMany({
      select: { email: true },
    });
    return users.map((user) => user.email).join("\n");
  } catch (error) {
    console.error("❌ Error exporting emails:", error);
    return "";
  } finally {
    await prisma.$disconnect();
  }
}

export async function exportParticipantEmails(): Promise<string> {
  try {
    const participants = await prisma.user.findMany({
      where: {
        ParticipantInfo: { isNot: null }, // Only users with ParticipantInfo
      },
      select: { email: true },
    });
    return participants.map((user) => user.email).join("\n");
  } catch (error) {
    console.error("❌ Error exporting participant emails:", error);
    return "";
  } finally {
    await prisma.$disconnect();
  }
}
