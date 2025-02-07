"use client";

import React, { useRef, useState } from "react";
import Script from "next/script";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { submitTravelReimbursement } from "../actions/register";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import Link from "next/link";

// Schema validation
const reimbursementSchema = z.object({
  transportationMethod: z.enum([
    "Car",
    "Bus",
    "Train",
    "Airplane",
    "Rideshare",
    "Other",
  ]),
  address: z.string().min(5, { message: "Address is required." }),
  distance: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({ required_error: "Distance is required." })
      .positive({ message: "Distance must be positive." })
  ),
  estimatedCost: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({ required_error: "Estimated cost is required." })
      .nonnegative({ message: "Estimated cost must be non-negative." })
  ),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }),
});

declare global {
  interface Window {
    google: typeof google;
  }
}

type ReimbursementFormData = z.infer<typeof reimbursementSchema>;

export default function ReimbursementForm() {
  const router = useRouter();
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReimbursementFormData>({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: {
      transportationMethod: "Car",
      address: "",
      distance: undefined,
      estimatedCost: undefined,
      reason: "",
    },
  });

  const removeLeadingZeros = (value: string) => {
    return value.replace(/^0+(?=\d)/, "");
  };

  // Initialize autocomplete when script finishes loading
  const handleScriptLoad = () => {
    if (addressInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "us" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        form.setValue("address", place.formatted_address || "");
      });
    }
  };

  const onSubmit = async (data: ReimbursementFormData) => {
    try {
      setIsSubmitting(true);

      await toast.promise(
        submitTravelReimbursement({
          transportationMethod: data.transportationMethod,
          address: data.address,
          distance: data.distance,
          estimatedCost: data.estimatedCost,
          reason: data.reason,
        }),
        {
          loading: "Submitting reimbursement request...",
          success: "Reimbursement request submitted successfully!",
          error: "Failed to submit reimbursement request.",
        }
      );

      router.refresh();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white my-6">
      {/* Load the Google Maps script and initialize autocomplete in onLoad */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />

      <h2 className="text-xl font-semibold text-center mb-4">
        Travel Reimbursement Request
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="transportationMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your transportation method?</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border p-1 rounded w-full text-md"
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

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where are you traveling from?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Start typing your address..."
                    {...field}
                    ref={addressInputRef} // ✅ Correct usage of ref
                    onChange={(e) => field.onChange(e.target.value)} // ✅ Ensure controlled input
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex flex-wrap gap-1">
                    <span>Distance to KU Engineering in miles?</span>
                    <Link
                      href="https://g.co/kgs/25TjzVB"
                      target="_blank"
                      className="underline break-words pb-1"
                    >
                      (1536 W 15th St, Lawrence, KS)
                    </Link>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter distance in miles"
                    type="number"
                    step="0.1"
                    {...field}
                    onChange={(e) => {
                      const formattedValue = e.target.value.replace(
                        /^0+(?=\d)/,
                        ""
                      );
                      field.onChange(formattedValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Ticket/Gas Cost ($)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter estimated cost in dollars"
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      const formattedValue = removeLeadingZeros(e.target.value);
                      field.onChange(formattedValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Why do you wish to attend HackkU &apos;25 and what do you hope
                  to get out of the event?
                </FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="border p-2 rounded w-full"
                    placeholder="Why do you want to attend HackKU?"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? (
              <>
                <IconLoader className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
