/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ThemedRoomReservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ThemedRoomReservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ThemedRoomReservation" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "memberEmails" SET NOT NULL,
ALTER COLUMN "memberEmails" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ThemedRoomReservation_userId_key" ON "ThemedRoomReservation"("userId");
