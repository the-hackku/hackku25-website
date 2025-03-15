-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_travelReimbursementId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_travelReimbursementId_fkey" FOREIGN KEY ("travelReimbursementId") REFERENCES "TravelReimbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
