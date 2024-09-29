"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TimeInput } from "../customui/TimeInput";
import { createEvent } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

// Define schema using Zod with coercion for the duration
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  date: z.enum(["2025-04-04", "2025-04-05", "2025-04-06"], {
    required_error: "Please select a valid date.",
  }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:MM.",
  }),
  duration: z.coerce
    .number()
    .min(0.5, { message: "Minimum duration is 0.5 hours." })
    .max(12, { message: "Maximum duration is 12 hours." }),
  location: z.string().optional(),
  description: z.string().optional(),
});

export function EventForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: "2025-04-04",
      startTime: "12:00",
      duration: 1.5, // Default to 1.5 hours (90 minutes)
      location: "",
      description: "",
    },
  });

  const onSubmit = async (data: {
    name: string;
    date: string;
    startTime: string;
    duration: number;
    location: string;
    description: string;
  }) => {
    try {
      // Construct start DateTime object from date and time
      const eventStart = createDateTime(data.date, data.startTime);

      // Calculate end DateTime based on the duration
      const eventEnd = calculateEndTime(eventStart, data.duration);

      // Call backend API to create the event
      await createEvent({
        name: data.name,
        startDate: eventStart.toISOString(),
        endDate: eventEnd.toISOString(),
        location: data.location,
      });

      // Reset the form and refresh the page
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  // Helper function to construct a full DateTime object from a date and time string
  const createDateTime = (date: string, time: string) => {
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    // Create a new Date object with specified year, month, day, hours, and minutes
    return new Date(year, month - 1, day, hours, minutes);
  };

  // Helper function to calculate end time based on start time and duration
  const calculateEndTime = (startDateTime: Date, durationInHours: number) => {
    const endDateTime = new Date(startDateTime);
    // Calculate duration in minutes
    const durationInMinutes = Math.round(durationInHours * 60);
    // Set the end time by adding the duration in minutes
    endDateTime.setMinutes(endDateTime.getMinutes() + durationInMinutes);
    return endDateTime;
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-sm border m-8">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Create New Event
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              {/* Event Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe the event" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date & Time */}
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex space-x-4"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="2025-04-04" id="friday" />
                          </FormControl>
                          <FormLabel htmlFor="friday" className="text-sm">
                            Friday, 4th
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="2025-04-05" id="saturday" />
                          </FormControl>
                          <FormLabel htmlFor="saturday" className="text-sm">
                            Saturday, 5th
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="2025-04-06" id="sunday" />
                          </FormControl>
                          <FormLabel htmlFor="sunday" className="text-sm">
                            Sunday, 6th
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Start Time and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <TimeInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Hours)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.5"
                          placeholder="Enter duration in hours"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Add Event
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
