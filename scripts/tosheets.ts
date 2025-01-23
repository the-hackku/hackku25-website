/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const { google } = require("googleapis");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();
const sheets = google.sheets("v4");

// Google Sheets setup
const SHEET_ID = "1Xwv7RBzU2VFX_xXCNxEpOi-StvNJV5DsiqkIYEQWQD4"; // Replace with your Google Sheet ID
const RANGE = "Sheet1"; // Replace with your desired sheet name

// Authenticate with Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!, "base64").toString(
      "utf-8"
    )
  ),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Fetch users and participant info
async function fetchDatabaseData() {
  const users = await prisma.user.findMany({
    include: {
      ParticipantInfo: true, // Join ParticipantInfo
    },
  });

  // Transform data for Google Sheets
  return users.map(
    (user: {
      email: string;
      ParticipantInfo?: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        age?: number;
        genderIdentity?: string;
        race?: string;
        hispanicOrLatino?: string;
        countryOfResidence?: string;
        levelOfStudy?: string;
        currentSchool?: string;
        major?: string;
        previousHackathons?: string;
        tShirtSize?: string;
        dietaryRestrictions?: string;
        specialAccommodations?: string;
        isHighSchoolStudent?: boolean;
        chaperoneFirstName?: string;
        chaperoneLastName?: string;
        chaperoneEmail?: string;
        chaperonePhoneNumber?: string;
        agreeHackKUCode?: boolean;
        agreeMLHCode?: boolean;
        shareWithMLH?: boolean;
        receiveEmails?: boolean;
      };
    }) => [
      user.email, // User email
      user.ParticipantInfo?.firstName || "N/A", // First Name
      user.ParticipantInfo?.lastName || "N/A", // Last Name
      user.ParticipantInfo?.phoneNumber || "N/A", // Phone Number
      user.ParticipantInfo?.age || "N/A", // Age
      user.ParticipantInfo?.genderIdentity || "N/A", // Gender Identity
      user.ParticipantInfo?.race || "N/A", // Race
      user.ParticipantInfo?.hispanicOrLatino || "N/A", // Hispanic or Latino
      user.ParticipantInfo?.countryOfResidence || "N/A", // Country of Residence
      user.ParticipantInfo?.levelOfStudy || "N/A", // Level of Study
      user.ParticipantInfo?.currentSchool || "N/A", // Current School
      user.ParticipantInfo?.major || "N/A", // Major
      user.ParticipantInfo?.previousHackathons || "N/A", // Previous Hackathons
      user.ParticipantInfo?.tShirtSize || "N/A", // T-shirt Size
      user.ParticipantInfo?.dietaryRestrictions || "N/A", // Dietary Restrictions
      user.ParticipantInfo?.specialAccommodations || "N/A", // Special Accommodations
      user.ParticipantInfo?.isHighSchoolStudent ? "Yes" : "No", // Is High School Student
      user.ParticipantInfo?.chaperoneFirstName || "N/A", // Chaperone First Name
      user.ParticipantInfo?.chaperoneLastName || "N/A", // Chaperone Last Name
      user.ParticipantInfo?.chaperoneEmail || "N/A", // Chaperone Email
      user.ParticipantInfo?.chaperonePhoneNumber || "N/A", // Chaperone Phone Number
      user.ParticipantInfo?.agreeHackKUCode ? "Yes" : "No", // Agree to HackKU Code
      user.ParticipantInfo?.agreeMLHCode ? "Yes" : "No", // Agree to MLH Code
      user.ParticipantInfo?.shareWithMLH ? "Yes" : "No", // Share with MLH
      user.ParticipantInfo?.receiveEmails ? "Yes" : "No", // Receive Emails
    ]
  );
}

// Write data to Google Sheets
async function writeToGoogleSheet(data: (string | number | boolean)[][]) {
  const client = await auth.getClient();
  const sheetsApi = google.sheets({ version: "v4", auth: client });

  // Add header row
  const headers = [
    "Email",
    "First Name",
    "Last Name",
    "Phone Number",
    "Age",
    "Gender Identity",
    "Race",
    "Hispanic or Latino",
    "Country of Residence",
    "Level of Study",
    "Current School",
    "Major",
    "Previous Hackathons",
    "T-shirt Size",
    "Dietary Restrictions",
    "Special Accommodations",
    "Is High School Student",
    "Chaperone First Name",
    "Chaperone Last Name",
    "Chaperone Email",
    "Chaperone Phone Number",
    "Agree to HackKU Code",
    "Agree to MLH Code",
    "Share with MLH",
    "Receive Emails",
  ];

  // Write data to the sheet
  await sheetsApi.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: "RAW",
    requestBody: {
      values: [headers, ...data], // Combine headers and data
    },
  });

  console.log("Data successfully written to Google Sheet!");
}

// Main function to export data
async function exportToGoogleSheet() {
  try {
    const data = await fetchDatabaseData(); // Fetch data from DB
    await writeToGoogleSheet(data); // Write to Google Sheets
  } catch (error) {
    console.error("Error exporting data:", error);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma
  }
}

// Run the export
exportToGoogleSheet();
