"use client";

import { Event, EventType } from "@prisma/client";
import { useState } from "react";
import { updateEvent } from "@/app/actions/events";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { IconLoader } from "@tabler/icons-react";

type Props = {
  events: Event[];
};

function toLocalISOString(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function AdminEventEditor({ events }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedEvent = events.find((e) => e.id === selectedId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    eventType: "",
    startDate: "",
    endDate: "",
  });

  function handleSelectChange(id: string) {
    const ev = events.find((e) => e.id === id);
    if (ev) {
      setSelectedId(id);
      setFormData({
        name: ev.name,
        description: ev.description ?? "",
        location: ev.location ?? "",
        eventType: ev.eventType ?? "",
        startDate: toLocalISOString(new Date(ev.startDate)),
        endDate: toLocalISOString(new Date(ev.endDate)),
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;

    setIsSubmitting(true);

    try {
      await toast.promise(
        updateEvent(selectedId, {
          ...formData,
          eventType: formData.eventType as EventType,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        }),
        {
          loading: "Updating event...",
          success: "Event updated successfully!",
          error: "Failed to update event.",
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border p-4 rounded-xl w-full max-w-2xl mx-auto text-sm">
      <h2 className="text-lg font-semibold mb-4 text-center bg-yellow-200">
        Edit Existing Event
      </h2>
      <select
        className="mb-4 p-2 border rounded w-full"
        value={selectedId ?? ""}
        onChange={(e) => handleSelectChange(e.target.value)}
      >
        <option value="" disabled>
          Select an event
        </option>
        {[...events]
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
          .map((ev) => {
            const date = new Date(ev.startDate);
            const weekday = date.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const time = date.toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
            });

            return (
              <option key={ev.id} value={ev.id}>
                {ev.name} – {weekday} @ {time}
              </option>
            );
          })}
      </select>

      {selectedEvent && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
          <select
            className="w-full p-2 border rounded"
            value={formData.eventType}
            onChange={(e) =>
              setFormData({ ...formData, eventType: e.target.value })
            }
          >
            {Object.values(EventType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label className="mb-1 text-sm">Start Date/Time</label>
              <input
                className="p-2 border rounded"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="mb-1 text-sm">End Date/Time</label>
              <input
                className="p-2 border rounded"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-yellow-400 text-black w-full rounded hover:bg-yellow-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <IconLoader className="animate-spin" size={20} />
                Saving...
              </span>
            ) : (
              "Save Event Changes"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
