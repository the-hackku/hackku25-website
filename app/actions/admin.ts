"use server";

import { prisma } from "@/prisma";
import { isAdmin } from "@/middlewares/isAdmin";

// Type for the Event data used in creating or updating events
interface EventData {
  name: string;
  date: string; // Store as string and convert to Date
  location?: string;
}

// CRUD operations for the admin dashboard

// Fetch all users and return their names and emails
export async function getUsers() {
  await isAdmin(); // Ensure only admins can access

  return await prisma.user.findMany({
    select: {
      name: true,
      email: true, // Return the email along with the name
      role: true, // Add role if needed on frontend
    },
  });
}

// Fetch all events and return their names
export async function getEvents() {
  await isAdmin(); // Ensure only admins can access

  return await prisma.event.findMany({
    select: {
      id: true, // Return ID if needed for frontend actions
      name: true,
      date: true, // Return the date so the frontend can display the event details
      location: true, // Include location if necessary
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
      date: new Date(data.date), // Convert string to Date object
      location: data.location || null,
    },
    select: {
      id: true, // Include id for frontend reference
      name: true, // Return the event name after creation
      date: true, // Return the event date
      location: true, // Return the location
    },
  });
}

// Update an event
export async function updateEvent(eventId: string, data: EventData) {
  await isAdmin(); // Ensure only admins can access

  return await prisma.event.update({
    where: { id: eventId },
    data: {
      name: data.name,
      date: new Date(data.date), // Convert string to Date object
      location: data.location || null,
    },
    select: {
      id: true, // Include id for frontend reference
      name: true, // Return the updated event name
      date: true, // Return the updated date
      location: true, // Return the updated location
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
