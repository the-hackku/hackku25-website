/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

import { google } from "googleapis";
import dotenv from "dotenv";
// 1. Import Prisma types
import type {
  User as PrismaUser,
  ParticipantInfo as PrismaParticipantInfo,
} from "@prisma/client";

dotenv.config();

// Replace with your own Google Sheet ID and desired range:
const SHEET_ID = "1Xwv7RBzU2VFX_xXCNxEpOi-StvNJV5DsiqkIYEQWQD4";
const RANGE = "Sheet1!A1";

const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) {
  throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set");
}

// 2. Type that ensures the user actually has a ParticipantInfo object
export type UserWithParticipantInfo = PrismaUser & {
  ParticipantInfo: PrismaParticipantInfo; // Not optional
};

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(
    Buffer.from(serviceAccountKey, "base64").toString("utf-8")
  ),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

function transformUserData(user: UserWithParticipantInfo): string[] {
  // Return the data as strings, ready for appending to Google Sheets
  return [
    user.email ?? "N/A",
    user.ParticipantInfo.firstName ?? "N/A",
    user.ParticipantInfo.lastName ?? "N/A",
    user.ParticipantInfo.phoneNumber ?? "N/A",
    user.ParticipantInfo.age?.toString() ?? "N/A",
    user.ParticipantInfo.genderIdentity ?? "N/A",
    user.ParticipantInfo.race ?? "N/A",
    user.ParticipantInfo.resumeUrl ?? "N/A",
    user.ParticipantInfo.hispanicOrLatino ?? "N/A",
    user.ParticipantInfo.countryOfResidence ?? "N/A",
    user.ParticipantInfo.levelOfStudy ?? "N/A",
    user.ParticipantInfo.currentSchool ?? "N/A",
    user.ParticipantInfo.major ?? "N/A",
    user.ParticipantInfo.minor ?? "N/A",
    user.ParticipantInfo.previousHackathons?.toString() ?? "N/A",
    user.ParticipantInfo.tShirtSize ?? "N/A",
    user.ParticipantInfo.dietaryRestrictions ?? "N/A",
    user.ParticipantInfo.specialAccommodations ?? "N/A",
    user.ParticipantInfo.isHighSchoolStudent ? "Yes" : "No",
    user.ParticipantInfo.chaperoneFirstName ?? "N/A",
    user.ParticipantInfo.chaperoneLastName ?? "N/A",
    user.ParticipantInfo.chaperoneEmail ?? "N/A",
    user.ParticipantInfo.chaperonePhoneNumber ?? "N/A",
    user.ParticipantInfo.agreeHackKUCode ? "Yes" : "No",
    user.ParticipantInfo.agreeMLHCode ? "Yes" : "No",
    user.ParticipantInfo.shareWithMLH ? "Yes" : "No",
    user.ParticipantInfo.receiveEmails ? "Yes" : "No",
    user.createdAt ? user.createdAt.toISOString() : "N/A", // Convert createdAt date to string
  ];
}

export async function exportToGoogleSheet(user: UserWithParticipantInfo) {
  try {
    const sheetsApi = google.sheets({ version: "v4", auth });

    const rowValues = transformUserData(user);

    // Append data to the Google Sheet, starting at the correct position
    await sheetsApi.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE, // Refers to the entire sheet, starting from the first available row
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS", // Ensures rows are inserted correctly
      requestBody: {
        values: [rowValues], // Adds a new row of data
      },
    });

    console.log("User successfully added to Google Sheet!");
  } catch (error) {
    console.error("Error exporting data to Google Sheet:", error);
  }
}
