"use server";

import { PrismaClient } from "@prisma/client";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { RegistrationData } from "./schemas"; // Import the type from the new file

const prisma = new PrismaClient();

// Server action for registering a user
export async function registerUser(data: RegistrationData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Create a ParticipantInfo record linked to the user
  await prisma.participantInfo.create({
    data: {
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      age: data.age,
      genderIdentity: data.genderIdentity || "",
      race: data.race || "",
      hispanicOrLatino: data.hispanicOrLatino || "",
      countryOfResidence: data.countryOfResidence,
      tShirtSize: data.tShirtSize,
      dietaryRestrictions: data.dietaryRestrictions || "",
      specialAccommodations: data.specialAccommodations || "",
      isHighSchoolStudent: data.isHighSchoolStudent,
      currentSchool: data.currentSchool || "",
      levelOfStudy: data.levelOfStudy || "",
      major: data.major || "",
      previousHackathons: data.previousHackathons || 0,
      chaperoneFirstName: data.chaperoneFirstName || "",
      chaperoneLastName: data.chaperoneLastName || "",
      chaperoneEmail: data.chaperoneEmail || "",
      chaperonePhoneNumber: data.chaperonePhoneNumber || "",
      agreeHackKUCode: data.agreeHackKUCode,
      agreeMLHCode: data.agreeMLHCode,
      shareWithMLH: data.shareWithMLH ?? false,
      receiveEmails: data.receiveEmails ?? false,
    },
  });

  return { success: true };
}
