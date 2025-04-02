"use client";

import React, { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

// Actions
import { searchUsersByEmail } from "@/app/actions/reimbursement";
import { createThemedRoomReservation } from "../actions/reservationRequest";
import { RoomTheme } from "@prisma/client";

// Enums (should match your Prisma schema)
const THEMES = [
  {
    value: "DUNGEONS_AND_DRAGONS",
    label: "🐉 Dungeons and Dragons",
    room: "ROOM_2324",
  },
  {
    value: "HOW_TO_TRAIN_YOUR_DRAGON",
    label: "🐲 How to Train Your Dragon",
    room: "ROOM_2326",
  },
  {
    value: "DARK_FAIRY",
    label: "🧚 Dark Fairy",
    room: "ROOM_2328",
  },
] as const;

const ALL_TIMESLOTS = [
  "FRI_8_11PM",
  "FRI_11PM_2AM",
  "SAT_2_5AM",
  "SAT_5_8AM",
  "SAT_8_11AM",
  "SAT_11AM_2PM",
  "SAT_2_5PM",
  "SAT_5_8PM",
  "SAT_8_11PM",
  "SAT_11PM_2AM",
  "SUN_2_5AM",
  "SUN_5_8AM",
] as const;

const reservationSchema = z.object({
  teamName: z.string().min(1),
  timeSlot: z.enum(ALL_TIMESLOTS),
  theme: z.enum(THEMES.map((t) => t.value) as [string, ...string[]]),
  groupMembers: z
    .array(
      z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
      })
    )
    .min(1, "Please add at least one group member."),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

export default function ThemedRoomReservationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; email: string; name: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [takenSlots, setTakenSlots] = useState<
    { theme: string; timeSlot: string }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTaken = async () => {
      const { getTakenThemeTimeCombos } = await import(
        "../actions/reservationRequest"
      );
      const result = await getTakenThemeTimeCombos();
      setTakenSlots(result);
    };

    fetchTaken();
  }, []);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      teamName: "",
      timeSlot: "FRI_8_11PM",
      theme: "DUNGEONS_AND_DRAGONS",
      groupMembers: [],
    },
  });

  const groupMembers = form.watch("groupMembers");
  const selectedTheme = form.watch("theme");

  const availableTimeSlots = ALL_TIMESLOTS.filter((slot) => {
    return !(takenSlots ?? []).some(
      (r) => r.theme === selectedTheme && r.timeSlot === slot // ✅ updated
    );
  });

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
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      }, 300),
    []
  );

  const handleAddMember = (user: {
    id: string;
    email: string;
    name: string;
  }) => {
    if (groupMembers.some((m) => m.id === user.id)) return;
    if (groupMembers.length >= 10) {
      toast.error("Max 10 members.");
      return;
    }
    form.setValue("groupMembers", [...groupMembers, user]);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleRemoveMember = (userId: string) => {
    const updated = groupMembers.filter((m) => m.id !== userId);
    form.setValue("groupMembers", updated);
  };

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    try {
      await toast.promise(
        createThemedRoomReservation({
          teamName: data.teamName,
          timeSlot: data.timeSlot,
          theme: data.theme as RoomTheme,
          memberEmails: data.groupMembers.map((m) => m.email),
        }),
        {
          loading: "Submitting...",
          success: "Reservation submitted!",
          error: "That slot was just taken. Try a different one.",
        }
      );

      form.reset();
      router.push("/profile"); // 👈 Navigate after successful reservation
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border shadow-sm my-6">
      <h1 className="text-xl font-bold mb-4">
        ⚡ Reserve a Themed Room for Deep Focus Hacking
      </h1>
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg text-sm mb-6 space-y-3">
        <p className="text-base font-medium">
          Need a quiet, magical zone to power through your hack? ⚡️
        </p>
        <p>
          We&apos;ve got you covered with exclusive Themed Rooms in LEEP2 (
          <strong>Rooms 2324, 2326, and 2328</strong>) 🛋️. These are decked out
          with vibes to boost your creativity and focus for some serious
          late-night coding. 💻🌙
        </p>
        <p>
          <strong>Pick your vibe:</strong>
          <br />
          🐉 <strong>Dungeons and Dragons</strong> – for the brave and bold
          adventurers
          <br />
          🐲 <strong>How to Train Your Dragon</strong> – for dreamers and dragon
          tamers
          <br />
          🧚 <strong>Dark Fairy</strong> – for those who code best in a
          whimsical realm
        </p>
        <p>
          Reserve your spot for a{" "}
          <strong>3-hour deep-focus hacking session</strong> anytime between{" "}
          <strong>8 PM, April 4 – 8 AM, April 6</strong>.
        </p>
        <p className="text-red-500 font-medium">
          🚨 Note: You can only choose one theme per time frame. Choose wisely!
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Team Name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Group Members */}
          <div>
            <FormLabel>Team Members</FormLabel>
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                debouncedSearch(e.target.value);
              }}
            />
            {isSearching && (
              <div className="text-sm mt-2 flex gap-1 items-center">
                <IconLoader className="animate-spin" size={16} />
                Searching...
              </div>
            )}
            {!isSearching &&
              hasSearched &&
              searchResults.length === 0 &&
              searchQuery.trim().length >= 3 && (
                <div className="text-red-500 text-sm mt-2">No user found.</div>
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
              <div className="mt-2 space-y-1">
                {groupMembers.map((member) => (
                  <div key={member.id} className="flex justify-between text-sm">
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

          {/* Theme */}
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Which theme would you like to reserve? (One per team)
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border p-2 rounded text-sm"
                  >
                    {THEMES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Time Slot */}
          <FormField
            control={form.control}
            name="timeSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Time Slots</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border p-2 rounded text-sm"
                  >
                    {availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {(() => {
                          const [day, start, end] = slot.split("_");
                          const dayLabel =
                            day === "FRI"
                              ? "Fri"
                              : day === "SAT"
                              ? "Sat"
                              : "Sun";
                          const timeRange = `${start}–${end.replace(
                            /([AP]M)$/,
                            " $1"
                          )}`;
                          return `${dayLabel}: ${timeRange}`;
                        })()}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <IconLoader className="animate-spin" size={20} />
                Submitting...
              </span>
            ) : (
              "Submit Reservation"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
