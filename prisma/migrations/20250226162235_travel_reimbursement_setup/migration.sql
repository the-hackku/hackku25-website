/*
  Warnings:

  - You are about to drop the column `reimbursementGroupId` on the `TravelReimbursement` table. All the data in the column will be lost.
  - You are about to drop the `ReimbursementGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReimbursementGroupMember` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `TravelReimbursement` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- DropForeignKey
ALTER TABLE "ReimbursementGroup" DROP CONSTRAINT "ReimbursementGroup_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "ReimbursementGroupMember" DROP CONSTRAINT "ReimbursementGroupMember_reimbursementGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ReimbursementGroupMember" DROP CONSTRAINT "ReimbursementGroupMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "TravelReimbursement" DROP CONSTRAINT "TravelReimbursement_reimbursementGroupId_fkey";

-- DropIndex
DROP INDEX "TravelReimbursement_reimbursementGroupId_key";

-- AlterTable
ALTER TABLE "TravelReimbursement" DROP COLUMN "reimbursementGroupId",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "ReimbursementGroup";

-- DropTable
DROP TABLE "ReimbursementGroupMember";

-- DropEnum
DROP TYPE "ReimbursementGroupStatus";

-- CreateTable
CREATE TABLE "ReimbursementInvite" (
    "id" TEXT NOT NULL,
    "reimbursementId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReimbursementInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReimbursementInvite_userId_reimbursementId_key" ON "ReimbursementInvite"("userId", "reimbursementId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_travelReimbursementId_fkey" FOREIGN KEY ("travelReimbursementId") REFERENCES "TravelReimbursement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReimbursementInvite" ADD CONSTRAINT "ReimbursementInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReimbursementInvite" ADD CONSTRAINT "ReimbursementInvite_reimbursementId_fkey" FOREIGN KEY ("reimbursementId") REFERENCES "TravelReimbursement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
