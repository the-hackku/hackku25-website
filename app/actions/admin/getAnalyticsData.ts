"use server";

import { prisma } from "@/prisma";
import {
  startOfHour,
  format,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";

export async function getAnalyticsData(
  startDate: Date,
  endDate: Date,
  aggregation: "hourly" | "daily"
) {
  let users, checkins;

  if (aggregation === "hourly") {
    users = await prisma.participantInfo.findMany({
      where: {
        createdAt: { gte: startOfDay(startDate), lte: endOfDay(endDate) },
      },
      select: { createdAt: true },
    });

    checkins = await prisma.checkin.findMany({
      where: {
        createdAt: { gte: startOfDay(startDate), lte: endOfDay(endDate) },
      },
      select: { createdAt: true },
    });

    const hourlyCounts: Record<
      string,
      { registrations: number; checkins: number }
    > = {};

    eachHourOfInterval({ start: startDate, end: endDate }).forEach((hour) => {
      const hourStr = format(hour, "yyyy-MM-dd HH:00");
      hourlyCounts[hourStr] = { registrations: 0, checkins: 0 };
    });

    users.forEach(({ createdAt }) => {
      const hourStr = format(startOfHour(createdAt), "yyyy-MM-dd HH:00");
      if (hourlyCounts[hourStr]) hourlyCounts[hourStr].registrations++;
    });

    checkins.forEach(({ createdAt }) => {
      const hourStr = format(startOfHour(createdAt), "yyyy-MM-dd HH:00");
      if (hourlyCounts[hourStr]) hourlyCounts[hourStr].checkins++;
    });

    return Object.entries(hourlyCounts).map(([date, counts]) => ({
      date,
      ...counts,
    }));
  }

  // Fallback to daily aggregation if not hourly
  users = await prisma.participantInfo.findMany({
    where: {
      createdAt: { gte: startOfDay(startDate), lte: endOfDay(endDate) },
    },
    select: { createdAt: true },
  });

  checkins = await prisma.checkin.findMany({
    where: {
      createdAt: { gte: startOfDay(startDate), lte: endOfDay(endDate) },
    },
    select: { createdAt: true },
  });

  const dailyCounts: Record<
    string,
    { registrations: number; checkins: number }
  > = {};

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = format(d, "yyyy-MM-dd");
    dailyCounts[dateStr] = { registrations: 0, checkins: 0 };
  }

  users.forEach(({ createdAt }) => {
    const dateStr = format(createdAt, "yyyy-MM-dd");
    if (dailyCounts[dateStr]) dailyCounts[dateStr].registrations++;
  });

  checkins.forEach(({ createdAt }) => {
    const dateStr = format(createdAt, "yyyy-MM-dd");
    if (dailyCounts[dateStr]) dailyCounts[dateStr].checkins++;
  });

  return Object.entries(dailyCounts).map(([date, counts]) => ({
    date,
    ...counts,
  }));
}
