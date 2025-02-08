// app/schedule/page.tsx

// import ScheduleGrid from "@/components/ScheduleGrid";
// import { prisma } from "@/prisma";
// import { Event } from "@prisma/client";

// // Server-side function to fetch events data
// async function getEvents(): Promise<Event[]> {
//   const events = await prisma.event.findMany({
//     select: {
//       id: true,
//       name: true,
//       location: true,
//       startDate: true,
//       endDate: true,
//       createdAt: true,
//       updatedAt: true,
//       description: true,
//       eventType: true,
//     },
//   });

//   return events;
// }

export default async function SchedulePage() {
  // const events = await getEvents();

  // // Convert date to string and include it in the formatted events
  // const formattedEvents = events.map((event) => ({
  //   ...event,
  //   startDate: event.startDate.toISOString(),
  //   endDate: event.endDate.toISOString(),
  //   description: event.description ?? undefined, // Ensure description is string or undefined
  // }));

  return (
    <div className="container mx-auto py-10 items-center">
      <>
        <div className="text-center text-3xl ">Schedule coming soon!</div>
        <div className="text-center text-sm text-muted-foreground mt-3">
          Check-in starts at 5:00pm on Friday, April 4th
        </div>
      </>
    </div>
  );

  // return (
  //   <div className="container mx-auto py:md:py-6">
  //     <ScheduleGrid schedule={formattedEvents} />
  //   </div>
  // );
}
