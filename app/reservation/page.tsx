"use client";

import React, { useState, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import Link from "next/link";
import { debounce } from "lodash";

// Example UI components
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

// -- Import your server actions (adjust paths as needed):
import { searchUsersByEmail } from "@/app/actions/reimbursement";
import { createReservationRequest } from "@/app/actions/reservationRequest";

// ----- Zod schema definition
const reservationSchema = z.object({
  teamName: z.string().min(1, { message: "Team Name is required." }),
  isOutOfStateOrHighSchool: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Please select Yes or No." }),
  }),
  // An array of user objects. We expect the user to add them via search.
  groupMembers: z
    .array(
      z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
      })
    )
    .min(1, { message: "Please add at least one group member." }),

  // Optionally allow typed emails (comma-separated)
  memberEmails: z.string().optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

export default function HackKU25RoomReservationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For searching + storing group members
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; email: string; name: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // React Hook Form setup
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      teamName: "",
      isOutOfStateOrHighSchool: "No",
      groupMembers: [],
      memberEmails: "",
    },
  });

  // Access the groupMembers from the form state
  const groupMembers = form.watch("groupMembers");

  // Debounced search function for user emails
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.trim().length < 3) {
          setSearchResults([]);
          setHasSearched(false);
          return;
        }

        try {
          setIsSearching(true);
          const results = await searchUsersByEmail(query);
          setSearchResults(results);
          setHasSearched(true);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      }, 300),
    []
  );

  // Add a member to the group
  const handleAddMember = (user: {
    id: string;
    email: string;
    name: string;
  }) => {
    // Prevent duplicates
    if (groupMembers.some((m) => m.id === user.id)) return;

    // Limit group size if you want. For example, 10:
    if (groupMembers.length >= 10) {
      toast.error("A group can have a maximum of 10 members.");
      return;
    }

    // Use setValue from RHF to update groupMembers in the form state
    form.setValue("groupMembers", [...groupMembers, user]);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  // Remove a member from the group
  const handleRemoveMember = (userId: string) => {
    const updated = groupMembers.filter((m) => m.id !== userId);
    form.setValue("groupMembers", updated);
  };

  // onSubmit handler
  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);

    // 1) Parse typed emails into an array
    const typedEmails = data.memberEmails
      ? data.memberEmails
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean)
      : [];

    // 2) Gather groupMembers' emails
    const groupMemberEmails = data.groupMembers.map((m) => m.email);

    // 3) Combine and deduplicate
    const allEmails = [...typedEmails, ...groupMemberEmails];
    const uniqueEmails = Array.from(new Set(allEmails));
    const finalEmailString = uniqueEmails.join(", ");

    // For completeness, let's also keep a comma-separated list of their IDs or names.
    // We'll store them in a 'teamMembers' column if you like. E.g.:
    const teamMembersList = data.groupMembers.map((m) => m.id).join(", ");

    try {
      // We'll store the combined emails in `memberEmails`
      // and the list of group member IDs in `teamMembers`.
      await toast.promise(
        createReservationRequest({
          teamName: data.teamName,
          memberEmails: finalEmailString,
          teamMembers: teamMembersList,
          outOfState: data.isOutOfStateOrHighSchool === "Yes",
        }),
        {
          loading: "Submitting your room reservation...",
          success: "Room reservation submitted successfully!",
          error: "Failed to submit. Please try again.",
        }
      );

      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white my-6 rounded-lg shadow-sm border">
      <h1 className="text-2xl font-bold mb-4">HackKU25 Room Reservation</h1>

      {/* Explanatory Text */}
      <div className="space-y-4 mb-6 text-sm leading-6">
        <p>
          This year, HackKU is introducing an{" "}
          <strong>optional room reservation system</strong> to ensure fair and
          organized space allocation for all participants during the 36-hour
          hackathon.
        </p>
        <p>
          <strong>Event Timing:</strong> April 4th - 6th, 2025
          <br />
          <strong>Event Address:</strong> 1520 W. 15th Street, Lawrence, Kansas,
          66045
          <br />
          <strong>Contact us:</strong>{" "}
          <Link href="mailto:hack@ku.edu" className="underline">
            hack@ku.edu
          </Link>
        </p>
        {/* ...the rest of your event info text ... */}
      </div>

      {/* The Actual Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Team Name */}
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your Team Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Group Member Search/Select */}
          <div>
            <FormLabel>
              Search and Add Registered Users to Your Team (up to 10)
            </FormLabel>
            <Input
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                debouncedSearch(e.target.value);
              }}
            />

            {isSearching && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <IconLoader className="animate-spin" size={16} />
                Searching...
              </div>
            )}

            {/* Show "no user found" if search done but no results */}
            {!isSearching &&
              hasSearched &&
              searchResults.length === 0 &&
              searchQuery.trim().length >= 3 && (
                <div className="mt-2 text-sm text-red-500">
                  No user found. Are you sure they registered?
                </div>
              )}

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
              <div className="mt-4">
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
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Out-of-state or High-school? */}
          <FormField
            control={form.control}
            name="isOutOfStateOrHighSchool"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Are you an out-of-state or high-school team? *
                </FormLabel>
                <FormControl>
                  <div className="space-x-4">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={field.value === "Yes"}
                        onChange={(e) => field.onChange(e.target.value)}
                      />{" "}
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={field.value === "No"}
                        onChange={(e) => field.onChange(e.target.value)}
                      />{" "}
                      No
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <IconLoader className="animate-spin" size={20} />
                Submitting...
              </div>
            ) : (
              "Submit Reservation"
            )}
          </Button>
          <p className="text-xs text-muted-foreground pt-1">
            By submitting this form, you agree that the information provided is
            accurate and complete.
          </p>
        </form>
      </Form>
    </div>
  );
}
