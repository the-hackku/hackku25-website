/*
  Warnings:

  - A unique constraint covering the columns `[reimbursementGroupId]` on the table `TravelReimbursement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[travelReimbursementId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ReimbursementGroupStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "TravelReimbursement" ADD COLUMN     "reimbursementGroupId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "travelReimbursementId" TEXT;

-- CreateTable
CREATE TABLE "ReimbursementGroup" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReimbursementGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReimbursementGroupMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reimbursementGroupId" TEXT NOT NULL,
    "status" "ReimbursementGroupStatus" NOT NULL DEFAULT 'PENDING',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReimbursementGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReimbursementGroupMember_userId_reimbursementGroupId_key" ON "ReimbursementGroupMember"("userId", "reimbursementGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "TravelReimbursement_reimbursementGroupId_key" ON "TravelReimbursement"("reimbursementGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "User_travelReimbursementId_key" ON "User"("travelReimbursementId");

-- AddForeignKey
ALTER TABLE "TravelReimbursement" ADD CONSTRAINT "TravelReimbursement_reimbursementGroupId_fkey" FOREIGN KEY ("reimbursementGroupId") REFERENCES "ReimbursementGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReimbursementGroup" ADD CONSTRAINT "ReimbursementGroup_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReimbursementGroupMember" ADD CONSTRAINT "ReimbursementGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReimbursementGroupMember" ADD CONSTRAINT "ReimbursementGroupMember_reimbursementGroupId_fkey" FOREIGN KEY ("reimbursementGroupId") REFERENCES "ReimbursementGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
