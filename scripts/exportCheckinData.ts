import { writeFileSync } from "fs";
import { resolve } from "path";
import { parse } from "json2csv";
// import { prisma } from "../lib/prisma.ts"; // use this when running standalone
import { prisma } from "../lib/prisma";

async function main() {
  const MAIN_EVENT_ID = "cm6vgqdwr0000l703iuxogwcy";

  const checkins = await prisma.checkin.findMany({
    where: {
      eventId: MAIN_EVENT_ID,
    },
    include: {
      user: {
        include: {
          ParticipantInfo: true,
        },
      },
    },
  });

  const rows = checkins.map(({ user }) => {
    const info = user.ParticipantInfo;

    return {
      firstName: info?.firstName || "",
      lastName: info?.lastName || "",
      age: info?.age || "",
      email: user.email,
      school: info?.currentSchool || "",
      phoneNumber: info?.phoneNumber || "",
      country: info?.countryOfResidence || "",
      levelOfStudy: info?.levelOfStudy || "",
      checkedIn: true, // everyone in this list has checked in

      // Optional fields from schema (recommended by MLH, if available)
      genderIdentity: info?.genderIdentity || "",
      race: info?.race || "",
      hispanicOrLatino: info?.hispanicOrLatino || "",
      isHighSchoolStudent: info?.isHighSchoolStudent ? "Yes" : "No",
      major: info?.major || "",
    };
  });

  const csv = parse(rows);
  const outputPath = resolve("checkin-data.csv");
  writeFileSync(outputPath, csv);
  console.log(`✅ Exported ${rows.length} check-ins to ${outputPath}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ Error exporting check-in data:", err);
  process.exit(1);
});
