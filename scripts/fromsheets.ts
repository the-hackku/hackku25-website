// to run: npx ts-node scripts/fromsheets.ts

//uncomment the following lines to run the script,

// const { google } = require("googleapis");
// const { PrismaClient } = require("@prisma/client");

// const fs = require("fs");
// const path = require("path");
// const dotenv = require("dotenv");

import { google } from "googleapis";
import { PrismaClient, ROLE } from "@prisma/client";

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// COMMENT THESE LINES WHEN RUNNING LOCALLY
// to run: npx ts-node scripts/fromsheets.ts

const prisma = new PrismaClient();
const sheets = google.sheets("v4");

dotenv.config();

const SHEET_ID = "1mXvz5Qc_Sb7pLFznVAisc20c0IYI--R5pThx7dvDFgQ"; // Replace with your Google Sheet ID
const RANGE = "Form Responses 1!A:AG";

// Authenticate with Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!, "base64").toString(
      "utf-8"
    )
  ),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

async function getGoogleSheetData() {
  const client = await auth.getClient();
  const result = await sheets.spreadsheets.values.get({
    auth: client as unknown as string,
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });

  return result.data.values || [];
}

// Transform the data from Google Sheets into Prisma-friendly format
interface SheetEntry {
  [key: string]: string;
}

interface ParticipantInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  age: number;
  genderIdentity: string;
  race: string;
  hispanicOrLatino: string;
  countryOfResidence: string;
  tShirtSize: string;
  dietaryRestrictions: string;
  specialAccommodations: string;
  isHighSchoolStudent: boolean;
  currentSchool: string;
  levelOfStudy: string;
  major: string;
  minor: string;
  previousHackathons: number;
  chaperoneFirstName: string;
  chaperoneLastName: string;
  chaperoneEmail: string;
  chaperonePhoneNumber: string;
  agreeHackKUCode: boolean;
  agreeMLHCode: boolean;
  shareWithMLH: boolean;
  receiveEmails: boolean;
}

interface TransformedData {
  email: string;
  role: ROLE;
  ParticipantInfo: {
    create: ParticipantInfo;
  };
}

function transformData(sheetData: string[][]): TransformedData[] {
  const headers = sheetData[0].map((header) => header.trim()); // Trim all headers
  const rows = sheetData.slice(1); // Remaining rows contain data

  return rows.map((row, index) => {
    const entry: SheetEntry = Object.fromEntries(
      headers.map((header, i) => [header, row[i] || ""])
    );

    console.log(`Row ${index + 1}:`, entry);
    console.log("Level of Study:", entry["Current Level of Study"]);

    return {
      email: entry["Email Address"],
      role: "HACKER",
      ParticipantInfo: {
        create: {
          firstName: entry["First Name"],
          lastName: entry["Last Name"],
          phoneNumber: entry["Phone Number (ex. 1234567890)"],
          age: parseInt(entry["Age"]) || 0,
          genderIdentity: entry["Gender Identity"],
          race: entry["Race (select all that apply)"],
          hispanicOrLatino: entry["Are you Hispanic or Latino"],
          countryOfResidence: entry["Country of Residence"],
          tShirtSize: entry["T-shirt Size (Unisex)"],
          dietaryRestrictions:
            entry["Do you have any dietary restrictions or food allergies?"],
          specialAccommodations:
            entry[
              "When planning HackKU25, inclusivity is our top priority! How can we best accommodate you for the best hackathon experience possible?"
            ],
          isHighSchoolStudent:
            entry["Are you a high school student under the age of 18?"] ===
            "Yes",
          currentSchool: entry["Current School"],
          levelOfStudy: entry["Current Level of Study"]
            ? entry["Current Level of Study"].match(
                /^(Secondary|Undergraduate|Graduate)/
              )?.[0] || "Unknown"
            : "Unknown",
          major:
            entry[
              "Major(s), If applicable (Use semicolons to delimit multiple degrees)"
            ],
          minor:
            entry[
              "Minor(s) and/or Certificate(s), If applicable (Use semicolons to delimit multiple specializations)"
            ],
          previousHackathons:
            parseInt(
              entry["How many hackathons have you attended previously?"]
            ) || 0,
          chaperoneFirstName: entry["Chaperone First Name"],
          chaperoneLastName: entry["Chaperone Last Name"],
          chaperoneEmail: entry["Chaperone Email"],
          chaperonePhoneNumber: entry["Chaperone Phone Number (1234567890)"],
          agreeHackKUCode:
            entry["I have read and agree to the HackKU Code of Conduct."] ===
            "I Agree",
          agreeMLHCode:
            entry["I have read and agree to the MLH Code of Conduct."] ===
            "I Agree",
          shareWithMLH:
            entry[
              "I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the MLH Privacy Policy. I further agree to the terms of both the MLH Contest Terms and Conditions and the MLH Privacy Policy."
            ] === "I Agree",
          receiveEmails:
            entry[
              "I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements."
            ] === "I Agree",
        },
      },
    };
  });
}

async function migrateData() {
  const failedEntriesLogPath = path.resolve("failed_entries.log");

  try {
    const sheetData = await getGoogleSheetData();
    const transformedData = transformData(sheetData);

    // Clear or create the log file
    fs.writeFileSync(failedEntriesLogPath, "Failed Entries Log\n\n");

    for (const userData of transformedData) {
      try {
        await prisma.user.upsert({
          where: { email: userData.email },
          update: {},
          create: userData,
        });
        console.log(
          `User with email ${userData.email} processed successfully.`
        );
      } catch (error) {
        console.error(
          `Error processing user with email ${userData.email}:`,
          error
        );

        // Log failed entry details into the log file
        fs.appendFileSync(
          failedEntriesLogPath,
          `Failed to process user with email ${userData.email}.\nError: ${
            (error as any).message
          }\nData: ${JSON.stringify(userData, null, 2)}\n\n`
        );
      }
    }

    console.log("Data migration completed successfully!");
    console.log(`Check ${failedEntriesLogPath} for failed entries.`);
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateData();
