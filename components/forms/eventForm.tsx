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

// Define schema using Zod for date selection
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  date: z.enum(["2024-04-04", "2024-04-05", "2024-04-06"], {
    required_error: "Please select a valid date.",
  }), // Restrict date to April 4th, 5th, or 6th
  time: z.string().optional(),
  location: z.string().optional(),
});

export function EventForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: "2024-04-04",
      time: "12:00",
      location: "",
    },
  });

  const onSubmit = async (data: {
    name: string;
    date: string;
    time: string;
    location: string;
  }) => {
    try {
      const [year, month, day] = data.date.split("-").map(Number);
      const eventDateTime = new Date(year, month - 1, day);
      const [hours, minutes] = data.time.split(":").map(Number);
      eventDateTime.setHours(hours || 0, minutes || 0);

      await createEvent({
        name: data.name,
        date: eventDateTime.toISOString(),
        location: data.location,
      });

      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="border rounded-lg p-3 grid grid-cols-2 gap-4 mt-8">
          <h2 className="col-span-2 text-lg font-semibold mb-2">
            Create New Event
          </h2>

          {/* Event Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location (Optional) */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Group 2: Date & Time */}

          <h2 className="col-span-2 text-lg font-semibold mb-2">Date & Time</h2>

          {/* Event Date Selection using Radio Group */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Event Date</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex space-x-2"
                  >
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="2024-04-04" id="friday" />
                      </FormControl>
                      <FormLabel htmlFor="friday" className="text-sm">
                        April 4th
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="2024-04-05" id="saturday" />
                      </FormControl>
                      <FormLabel htmlFor="saturday" className="text-sm">
                        April 5th
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="2024-04-06" id="sunday" />
                      </FormControl>
                      <FormLabel htmlFor="sunday" className="text-sm">
                        April 6th
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Event Time */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Event Time</FormLabel>
                <FormControl>
                  <TimeInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            size="sm"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Add Event
          </Button>
        </div>
      </form>
    </Form>
  );
}
