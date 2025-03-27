/*
  Warnings:

  - You are about to drop the column `teamMembers` on the `ReservationRequest` table. All the data in the column will be lost.
  - Added the required column `outOfState` to the `ReservationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReservationRequest" DROP COLUMN "teamMembers",
ADD COLUMN     "outOfState" BOOLEAN NOT NULL;
