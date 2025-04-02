/*
  Warnings:

  - You are about to drop the column `room` on the `ThemedRoomReservation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[theme,timeSlot]` on the table `ThemedRoomReservation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ThemedRoomReservation_room_timeSlot_key";

-- AlterTable
ALTER TABLE "ThemedRoomReservation" DROP COLUMN "room";

-- DropEnum
DROP TYPE "ThemedRoom";

-- CreateIndex
CREATE UNIQUE INDEX "ThemedRoomReservation_theme_timeSlot_key" ON "ThemedRoomReservation"("theme", "timeSlot");
