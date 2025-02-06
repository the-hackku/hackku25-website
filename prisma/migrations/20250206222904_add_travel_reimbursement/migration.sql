/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `TravelReimbursement` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TravelReimbursement_userId_address_key";

-- CreateIndex
CREATE UNIQUE INDEX "TravelReimbursement_userId_key" ON "TravelReimbursement"("userId");
