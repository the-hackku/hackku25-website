"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
const reimbursementSchema = z.object({
  transportationMethod: z.enum([
    "Car",
    "Bus",
    "Train",
    "Airplane",
    "Rideshare",
    "Other",
  ]),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  distance: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: "Distance must be a positive number." })
  ),
  estimatedCost: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative({ message: "Estimated cost must be 0 or more." })
  ),
  reason: z.string().min(10, {
    message: "Please provide a detailed reason (at least 10 characters).",
  }),
});

type ReimbursementFormData = z.infer<typeof reimbursementSchema>;

export function ReimbursementForm() {
  const router = useRouter();
  const form = useForm<ReimbursementFormData>({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: {
      transportationMethod: "Car",
      address: "",
      distance: 0,
      estimatedCost: 0,
      reason: "",
    },
  });

  // Local state for typed address and suggestions.
  const [addressInput, setAddressInput] = useState("");

  // 4c. Form Submission
  const onSubmit = async (data: ReimbursementFormData) => {
    try {
      console.log("Reimbursement Request Data:", data);
      // Replace with real API call here, e.g.:
      // await submitReimbursement(data);

      // Optionally reset the form and refresh the page
      form.reset();
      setAddressInput("");
      router.refresh();
    } catch (error) {
      console.error("Failed to submit reimbursement request:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-sm border m-8">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Travel Reimbursement Request
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              {/* Transportation Method */}
              <FormField
                control={form.control}
                name="transportationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transportation Method</FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={field.onChange}
                        className="border rounded p-2 w-full"
                      >
                        <option value="Car">Car</option>
                        <option value="Bus">Bus</option>
                        <option value="Train">Train</option>
                        <option value="Airplane">Airplane</option>
                        <option value="Rideshare">Rideshare</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address with Custom Debounce Autocomplete */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your address"
                        {...field}
                        value={addressInput}
                        onChange={(e) => {
                          field.onChange(e); // react-hook-form tracking
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Distance */}
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Distance (miles from 1536 W 15th St, Lawrence, KS )
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter distance in miles"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estimated Ticket / Gas Payment */}
              <FormField
                control={form.control}
                name="estimatedCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Ticket / Gas Payment ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter estimated cost"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reason */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Why do you wish to attend HackKU and what do you hope to
                      get out of the event?
                    </FormLabel>
                    <FormControl>
                      <textarea
                        className="border rounded p-2 w-full min-h-[100px]"
                        placeholder="Enter your reasons"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Submit Request
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
