"use client";

import React, { useRef, useState, useMemo } from "react";
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
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import Link from "next/link";
import { debounce } from "lodash";

// Import the server actions
import {
  submitTravelReimbursement,
  searchUsersByEmail,
} from "@/app/actions/reimbursement";

// Schema validation
const reimbursementSchema = z
  .object({
    isGroup: z.boolean().default(false),
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
    groupMembers: z
      .array(
        z.object({
          id: z.string(),
          email: z.string().email(),
          name: z.string(),
        })
      )
      .default([]),
  })
  .refine(
    (data) => {
      // If applying as a group, at least one other person must be in the group
      if (data.isGroup && data.groupMembers.length < 1) {
        return false;
      }
      return true;
    },
    {
      message:
        "If applying as a group, you must add at least one group member.",
    }
  );

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

  // Toggle for group or individual
  const [isGroup, setIsGroup] = useState(false);

  // List of group members (for group leaders)
  const [groupMembers, setGroupMembers] = useState<
    { id: string; email: string; name: string }[]
  >([]);

  // Search state
  const [searchResults, setSearchResults] = useState<
    { id: string; email: string; name: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  // New flag to indicate a search has been performed
  const [hasSearched, setHasSearched] = useState(false);

  const form = useForm<ReimbursementFormData>({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: {
      isGroup: false,
      transportationMethod: "Car",
      address: "",
      distance: undefined,
      estimatedCost: undefined,
      reason: "",
    },
  });

  // Utility to remove leading zeros from cost/distance
  const removeLeadingZeros = (value: string) => {
    return value.replace(/^0+(?=\d)/, "");
  };

  // Memoized debounced search function using useMemo
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 3) {
          setSearchResults([]);
          setHasSearched(false);
          return;
        }
        try {
          setIsSearching(true);
          const users = await searchUsersByEmail(query);
          setSearchResults(users);
          setHasSearched(true);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      }, 300),
    []
  );

  // Add group member
  const handleAddMember = (user: {
    id: string;
    email: string;
    name: string;
  }) => {
    // Prevent duplicates
    if (groupMembers.some((m) => m.id === user.id)) return;
    // Limit to 10 members
    if (groupMembers.length >= 10) {
      toast.error("A group can have a maximum of 10 members.");
      return;
    }
    setGroupMembers([...groupMembers, user]);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  // Initialize autocomplete for address
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

  // Form submission
  // Form submission
  const onSubmit = async (data: ReimbursementFormData) => {
    setIsSubmitting(true);

    try {
      // Use toast.promise to track submission
      await toast.promise(
        submitTravelReimbursement({
          transportationMethod: data.transportationMethod,
          address: data.address,
          distance: data.distance,
          estimatedCost: data.estimatedCost,
          reason: data.reason,
          isGroup,
          groupMemberEmails: groupMembers.map((m) => m.email),
        }),
        {
          loading: "Submitting reimbursement request...",
          success: "Reimbursement request submitted successfully!",
          error: "Failed to submit reimbursement request.",
        }
      );
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      router.push("/profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white my-6 rounded-lg md:shadow-sm md:border">
      {/* Google Maps Autocomplete for address */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />

      <h2 className="text-xl font-semibold text-center mb-4">
        Travel Reimbursement Request
      </h2>

      <div className="text-sm">
        <p className="py-2">
          Application Deadline:{" "}
          <span className="bg-yellow-200">March 15, 2025, at 11:59 PM CST</span>
          . View more details{" "}
          <Link href="/reimbursement" className="underline">
            here
          </Link>
          .
        </p>
      </div>
      <hr className="my-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Toggle for Individual vs. Group */}
          <div className="flex gap-2 items-center justify-start mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isGroup}
                onChange={() => setIsGroup(!isGroup)}
              />
              <span>I am applying on behalf of a group</span>
            </label>
          </div>

          {/* Group Members Section */}
          {isGroup && (
            <>
              <div className="space-y-2 mb-4">
                <p className="bg-yellow-200">
                  You are now applying on behalf of a group. Please add group
                  members below. They must accept the invitation to join the
                  group via email or profile. All dollar amounts should be the
                  total for the group.
                </p>
                <FormLabel>Add Group Members (up to 10)</FormLabel>
                <Input
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                />

                {/* Loading indicator */}
                {isSearching && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <IconLoader className="animate-spin" size={16} />
                    Searching...
                  </div>
                )}

                {/* Show "no user found" message only if a search has been performed */}
                {!isSearching &&
                  hasSearched &&
                  searchResults.length === 0 &&
                  searchQuery.length >= 3 && (
                    <div className="mt-2 text-sm text-red-500">
                      No user found. Are you sure they registered?
                    </div>
                  )}

                {/* Show results if found */}
                {searchResults.length > 0 && (
                  <div className="border bg-gray-50 rounded p-2 mt-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex justify-between items-center py-1"
                      >
                        <span>
                          {user.name} ({user.email})
                        </span>
                        <Button size="sm" onClick={() => handleAddMember(user)}>
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {groupMembers.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold">Selected Members:</h4>
                    {groupMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between sm:justify-start py-1"
                      >
                        <span>
                          {member.name} ({member.email})
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setGroupMembers(
                              groupMembers.filter((m) => m.id !== member.id)
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <hr className="my-8" />
            </>
          )}

          {/* Transportation Method */}
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

          {/* Address */}
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
                    ref={addressInputRef}
                    onChange={(e) => field.onChange(e.target.value)}
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

          {/* Estimated Cost */}
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

          {/* Reason */}
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Why do you wish to attend HackKU and what do you hope to get
                  out of the event? (min 10 characters)
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

          {/* Submit Button */}
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
          <p className="text-sm text-muted-foreground">
            By submitting this form, you agree that the information provided is
            accurate and complete.
          </p>
        </form>
      </Form>
    </div>
  );
}
