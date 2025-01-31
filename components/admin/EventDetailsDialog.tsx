"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventById } from "@/app/actions/admin"; // We will create this server action

interface EventDetailsDialogProps {
  eventId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailsDialog({
  eventId,
  onOpenChange,
}: EventDetailsDialogProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (eventId) {
        setIsLoading(true);
        try {
          const event = await getEventById(eventId);
          setEventDetails(event);
        } catch (error) {
          console.error("Failed to fetch event details:", error);
          setEventDetails(null);
        }
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  return (
    <Dialog open={!!eventId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : eventDetails ? (
          <>
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Name:</p>
                    <p>{eventDetails.name}</p>
                  </div>
                  <div>
                    <p className="font-medium">Start Date:</p>
                    <p>{new Date(eventDetails.startDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">End Date:</p>
                    <p>{new Date(eventDetails.endDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Location:</p>
                    <p>{eventDetails.location || "No location specified"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Description:</p>
                    <p>{eventDetails.description}</p>
                  </div>
                  <div>
                    <p className="font-medium">Event Type:</p>
                    <Badge variant="outline">{eventDetails.eventType}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center">Event not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
