// app/actions/registerUser.ts (or wherever you define your server actions)
"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { revalidatePath } from "next/cache";
import {
  exportToGoogleSheet,
  UserWithParticipantInfo,
} from "@/scripts/googleSheetsExport";
import { RegistrationData } from "@/app/actions/schemas";

const prisma = new PrismaClient();

export async function registerUser(data: RegistrationData, resumeUrl?: string) {
  // Authenticate the user.
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  console.log(resumeUrl);

  // Create the participant record including the blob URL.
  const participantInfo = await prisma.participantInfo.create({
    data: {
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      age: data.age,
      resumeUrl: resumeUrl ?? "testing",
      genderIdentity: data.genderIdentity ?? "",
      race: data.race ?? "",
      hispanicOrLatino: data.hispanicOrLatino ?? "",
      countryOfResidence: data.countryOfResidence ?? "",
      tShirtSize: data.tShirtSize,
      dietaryRestrictions: data.dietaryRestrictions ?? "",
      specialAccommodations: data.specialAccommodations ?? "",
      currentSchool: data.currentSchool ?? "",
      levelOfStudy: data.levelOfStudy ?? "",
      major: data.major ?? "",
      minor: data.minor ?? "",
      previousHackathons: data.previousHackathons ?? 0,
      chaperoneFirstName: data.chaperoneFirstName ?? "",
      chaperoneLastName: data.chaperoneLastName ?? "",
      chaperoneEmail: data.chaperoneEmail ?? "",
      chaperonePhoneNumber: data.chaperonePhoneNumber ?? "",
      agreeHackKUCode: data.agreeHackKUCode,
      agreeMLHCode: data.agreeMLHCode,
      shareWithMLH: data.shareWithMLH ?? false,
      receiveEmails: data.receiveEmails ?? false,
      isHighSchoolStudent: data.levelOfStudy === "High School",
    },
  });

  // (Optional) Export to Google Sheets.
  try {
    const userWithInfo: UserWithParticipantInfo = {
      ...user,
      ParticipantInfo: participantInfo,
    };
    await exportToGoogleSheet(userWithInfo);
  } catch (error) {
    console.error("Error updating Google Sheet:", error);
  }

  // Optionally, revalidate the profile page if you're using ISR.
  revalidatePath("/profile");

  return { success: true };
}
