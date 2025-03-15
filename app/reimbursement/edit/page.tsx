"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
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

// Server actions
import {
  updateTravelReimbursement,
  getReimbursementDetails,
  deleteTravelReimbursement,
  searchUsersByEmail,
  getInvitedUsers,
  // (if you want to support adding members manually on edit)
} from "@/app/actions/reimbursement";

// Define the schema for the reimbursement form
const reimbursementSchema = z
  .object({
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
    // Group mode: if true, at least one group member must be added
    isGroup: z.boolean().default(false),
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
    (data) => !data.isGroup || (data.isGroup && data.groupMembers.length > 0),
    {
      message:
        "If applying as a group, you must add at least one group member.",
      path: ["groupMembers"],
    }
  );

type ReimbursementFormData = z.infer<typeof reimbursementSchema>;

declare global {
  interface Window {
    google: typeof google;
  }
}

export default function EditReimbursementForm() {
  const router = useRouter();
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // For the group toggle and manual member additions
  const [isGroup, setIsGroup] = useState(false);
  const [groupMembers, setGroupMembers] = useState<
    { id: string; email: string; name: string }[]
  >([]);
  // Search state for inviting additional users
  const [searchResults, setSearchResults] = useState<
    { id: string; email: string; name: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  // For storing the reimbursement id (and other data)
  const [reimbursementId, setReimbursementId] = useState<string | null>(null);

  const form = useForm<ReimbursementFormData>({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: {
      transportationMethod: "Car",
      address: "",
      distance: undefined,
      estimatedCost: undefined,
      reason: "",
      isGroup: false,
      groupMembers: [],
    },
  });

  // Load existing reimbursement details (and invited users) on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getReimbursementDetails();
        if (!data) {
          toast.error("No existing reimbursement found to edit.");
          return;
        }
        setReimbursementId(data.id);
        // Update form values with fetched data
        form.reset({
          transportationMethod:
            data.transportationMethod as ReimbursementFormData["transportationMethod"],
          address: data.address,
          distance: data.distance,
          estimatedCost: data.estimatedCost,
          reason: data.reason,
          isGroup: Boolean(data.isGroup), // you might need to store isGroup in your DB
          groupMembers: data.groupMembers || [],
        });
        setIsGroup(Boolean(data.isGroup));
        setGroupMembers(data.groupMembers || []);

        // Optionally, fetch invited users if stored separately
        const invited = await getInvitedUsers(data.id);
        // Merge invited users into groupMembers if not already included
        if (invited && invited.length > 0) {
          setGroupMembers(invited);
          form.setValue("groupMembers", invited);
        }
      } catch (err) {
        console.error("Failed to load reimbursement details:", err);
        toast.error("Failed to load reimbursement details.");
      }
    })();
  }, [form]);

  // Google Maps autocomplete for the address field
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

  // Utility to remove leading zeros
  const removeLeadingZeros = (value: string) => {
    return value.replace(/^0+(?=\d)/, "");
  };

  // Memoized debounced search function for group members
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

  // Handler to add a member from search results
  const handleAddMember = (user: {
    id: string;
    email: string;
    name: string;
  }) => {
    // Prevent duplicates
    if (groupMembers.some((m) => m.id === user.id)) return;
    if (groupMembers.length >= 10) {
      toast.error("A group can have a maximum of 10 members.");
      return;
    }
    const updatedMembers = [...groupMembers, user];
    setGroupMembers(updatedMembers);
    form.setValue("groupMembers", updatedMembers);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  // Form submission handler (update reimbursement)
  const onSubmit = async (data: ReimbursementFormData) => {
    setIsSubmitting(true);
    try {
      await toast.promise(
        async () => {
          // Prepare payload; you may need to merge the groupMembers array if isGroup is true
          const result = await updateTravelReimbursement({
            reimbursementId: reimbursementId as string,
            transportationMethod: data.transportationMethod,
            address: data.address,
            distance: Number(data.distance),
            estimatedCost: Number(data.estimatedCost),
            reason: data.reason,
            groupMemberEmails: data.isGroup
              ? data.groupMembers.map((m) => m.email)
              : undefined,
          });

          if (!result.success) throw new Error("Update failed.");
        },
        {
          loading: "Saving changes...",
          success: "Reimbursement updated successfully!",
          error: "Failed to update reimbursement.",
        }
      );
      router.push("/profile");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for deleting the reimbursement
  async function handleDelete() {
    if (!reimbursementId) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this reimbursement?"
    );
    if (!confirmed) return;
    try {
      await toast.promise(
        async () => {
          const result = await deleteTravelReimbursement(reimbursementId);
          if (!result.success) throw new Error("Deletion failed.");
        },
        {
          loading: "Deleting reimbursement...",
          success: "Reimbursement deleted successfully!",
          error: "Failed to delete reimbursement.",
        }
      );
      router.push("/profile");
    } catch (err) {
      console.error("Deletion error:", err);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white my-6 rounded-lg md:shadow-sm md:border">
      {/* Load Google Maps script for address autocomplete */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      <h2 className="text-xl font-semibold text-center mb-4">
        Edit Travel Reimbursement Request
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Toggle for Group */}
          <div className="flex gap-2 items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isGroup}
                onChange={() => {
                  setIsGroup(!isGroup);
                  form.setValue("isGroup", !isGroup);
                }}
              />
              <span>Apply on behalf of a group</span>
            </label>
          </div>

          {/* Group Members Section */}
          {isGroup && (
            <>
              <div className="space-y-2">
                <p className="bg-yellow-200 p-2 rounded">
                  You are applying on behalf of a group. Please add group
                  members below.
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
                {isSearching && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <IconLoader className="animate-spin" size={16} />
                    Searching...
                  </div>
                )}
                {!isSearching &&
                  hasSearched &&
                  searchQuery.length >= 3 &&
                  searchResults.length === 0 && (
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
                  <div className="mt-2">
                    <h4 className="font-semibold">Selected Members:</h4>
                    {groupMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between py-1"
                      >
                        <span>
                          {member.name} ({member.email})
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updated = groupMembers.filter(
                              (m) => m.id !== member.id
                            );
                            setGroupMembers(updated);
                            form.setValue("groupMembers", updated);
                          }}
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
                <FormLabel>Transportation Method</FormLabel>
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
                <FormLabel>Travel From Address</FormLabel>
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
                  Distance to KU Engineering in miles{" "}
                  <Link
                    href="https://g.co/kgs/25TjzVB"
                    target="_blank"
                    className="underline"
                  >
                    (1536 W 15th St, Lawrence, KS)
                  </Link>
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
                    placeholder="Your reason..."
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit & Delete Buttons */}
          <div className="flex gap-4 mt-4">
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
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete Reimbursement
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            By submitting this form, you agree that the information provided is
            accurate and complete.
          </p>
        </form>
      </Form>
    </div>
  );
}
