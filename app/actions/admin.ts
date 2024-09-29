"use server";

import { prisma } from "@/prisma";
import { isAdmin } from "@/middlewares/isAdmin";

// Type for the Event data used in creating or updating events// Type for the Event data used in creating or updating events
interface EventData {
  startDate: string; // Use separate startDate field
  endDate: string; // Use separate endDate field
  name: string;
  location?: string;
  description?: string;
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
      startDate: true, // Return the event date
      endDate: true, // Return the end
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
      startDate: new Date(data.startDate), // Use startDate field
      endDate: new Date(data.endDate), // Use endDate field
      location: data.location || null,
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      location: true,
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
      startDate: new Date(data.startDate), // Convert string to Date object
      endDate: new Date(data.endDate), // Set end date to the same as start date for now
      location: data.location || null,
    },
    select: {
      id: true, // Include id for frontend reference
      name: true, // Return the updated event name
      startDate: true, // Return the updated event date
      endDate: true, // Return the updated
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
