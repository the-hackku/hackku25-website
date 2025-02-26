"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const OneKUPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("oneku_popup_seen");

    // Show popup only if it's Feb 20, 2025, and the user hasn't seen it yet
    if (!hasSeenPopup) {
      setOpen(true);
      localStorage.setItem("oneku_popup_seen", "true");
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <DialogTitle>🎉 One Day One KU is Happening!</DialogTitle>
          <DialogDescription>
            Join us for <b>One Day One KU</b>, the university&apos;s annual 24
            hours of giving! Click below to learn more.
          </DialogDescription>
        </DialogHeader>
        <Link
          href="https://onedayoneku.org/campaign_search?search=hackku&?referral_id=679d2285a2281757f2670b19"
          target="_blank"
        >
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Visit our One Day One KU Page
          </Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
};

export default OneKUPopup;
