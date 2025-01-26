"use server";

import { prisma } from "@/prisma";
import { isAdmin } from "@/middlewares/isAdmin";
import { EventType } from "@prisma/client";

// Type for the Event data used in creating or updating events// Type for the Event data used in creating or updating events

interface EventData {
  startDate: string;
  endDate: string;
  name: string;
  location: string;
  description: string;
  eventType: EventType;
}

// CRUD operations for the admin dashboard

// Fetch all users and return their names and emails
export async function getUsers() {
  await isAdmin(); // Only allow admins to access this data

  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      ParticipantInfo: true, // Fetch all fields from ParticipantInfo
    },
  });
}

// Fetch all check-ins and return user names, event names, and check-in time
export async function getCheckins() {
  await isAdmin(); // Ensure only admins can access

  return await prisma.checkin.findMany({
    select: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      event: {
        select: {
          name: true,
        },
      },
      createdAt: true,
    },
  });
}

// Create a new event
export async function createEvent(data: EventData) {
  await isAdmin(); // Ensure only admins can access

  return await prisma.event.create({
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      location: data.location || null,
      description: data.description,
      eventType: data.eventType,
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      location: true,
      description: true,
      eventType: true,
    },
  });
}

export async function updateEvent(eventId: string, data: EventData) {
  await isAdmin(); // Ensure only admins can access

  return await prisma.event.update({
    where: { id: eventId },
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      location: data.location || null,
      description: data.description,
      eventType: data.eventType, // Add eventType
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      location: true,
      description: true,
      eventType: true, // Include eventType
    },
  });
}

// Delete an event
export async function deleteEvent(eventId: string) {
  await isAdmin(); // Ensure only admins can access

  return await prisma.event.delete({
    where: { id: eventId },
    select: {
      id: true, // Include id for frontend reference
      name: true, // Return the name of the deleted event
    },
  });
}
