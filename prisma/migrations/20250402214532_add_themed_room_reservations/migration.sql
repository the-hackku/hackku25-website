-- CreateEnum
CREATE TYPE "ThemedRoom" AS ENUM ('ROOM_2324', 'ROOM_2326', 'ROOM_2328');

-- CreateEnum
CREATE TYPE "TimeSlot" AS ENUM ('FRI_8_11PM', 'FRI_11PM_2AM', 'SAT_2_5AM', 'SAT_5_8AM', 'SAT_8_11AM', 'SAT_11AM_2PM', 'SAT_2_5PM', 'SAT_5_8PM', 'SAT_8_11PM', 'SAT_11PM_2AM', 'SUN_2_5AM', 'SUN_5_8AM');

-- CreateEnum
CREATE TYPE "RoomTheme" AS ENUM ('DUNGEONS_AND_DRAGONS', 'HOW_TO_TRAIN_YOUR_DRAGON', 'DARK_FAIRY');

-- CreateTable
CREATE TABLE "ThemedRoomReservation" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "memberEmails" TEXT[],
    "room" "ThemedRoom" NOT NULL,
    "timeSlot" "TimeSlot" NOT NULL,
    "theme" "RoomTheme" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThemedRoomReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ThemedRoomReservation_room_timeSlot_key" ON "ThemedRoomReservation"("room", "timeSlot");
