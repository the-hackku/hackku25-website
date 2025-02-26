"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Import server actions
import {
  updateTravelReimbursement,
  getReimbursementDetails,
} from "@/app/actions/reimbursement";
import { IconLoader } from "@tabler/icons-react";

/**
 * Define the reimbursement type explicitly with reimbursementId.
 */
interface ReimbursementData {
  reimbursementId: string;
  transportationMethod: string;
  address: string;
  distance: number;
  estimatedCost: number;
  reason: string;
}

export default function EditReimbursementPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local form state
  const [reimbursement, setReimbursement] = useState<ReimbursementData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // ✅ On mount, load existing reimbursement using server action
  useEffect(() => {
    (async () => {
      try {
        const existingReimbursement = await getReimbursementDetails();

        if (!existingReimbursement) {
          setError("No existing reimbursement found to edit.");
          return;
        }

        setReimbursement({
          reimbursementId: existingReimbursement.id,
          transportationMethod: existingReimbursement.transportationMethod,
          address: existingReimbursement.address,
          distance: existingReimbursement.distance,
          estimatedCost: existingReimbursement.estimatedCost,
          reason: existingReimbursement.reason,
        });
      } catch (err) {
        console.error("Error loading reimbursement:", err);
        setError("Failed to load existing reimbursement.");
      }
    })();
  }, []);

  /**
   * ✅ Handle Form Submission
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reimbursement) return;

    setError(null);
    startTransition(async () => {
      try {
        const result = await updateTravelReimbursement(reimbursement);
        if (result.success) {
          router.push("/profile");
        } else {
          setError("Update failed.");
        }
      } catch (err) {
        console.error("Update failed:", err);
        setError("Update failed.");
      }
    });
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Reimbursement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transportation */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Transportation Method
          </label>
          <select
            value={reimbursement?.transportationMethod || ""}
            onChange={(e) =>
              setReimbursement((prev) =>
                prev ? { ...prev, transportationMethod: e.target.value } : prev
              )
            }
            className="border w-full p-2 rounded"
          >
            <option value="Car">Car</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Airplane">Airplane</option>
            <option value="Rideshare">Rideshare</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Travel From Address
          </label>
          <input
            type="text"
            value={reimbursement?.address || ""}
            onChange={(e) =>
              setReimbursement((prev) =>
                prev ? { ...prev, address: e.target.value } : prev
              )
            }
            className="border w-full p-2 rounded"
            required
          />
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Distance (miles)
          </label>
          <input
            type="number"
            step="0.1"
            value={reimbursement?.distance || 0}
            onChange={(e) =>
              setReimbursement((prev) =>
                prev ? { ...prev, distance: Number(e.target.value) } : prev
              )
            }
            className="border w-full p-2 rounded"
            required
          />
        </div>

        {/* Estimated Cost */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Estimated Cost ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={reimbursement?.estimatedCost || 0}
            onChange={(e) =>
              setReimbursement((prev) =>
                prev ? { ...prev, estimatedCost: Number(e.target.value) } : prev
              )
            }
            className="border w-full p-2 rounded"
            required
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium mb-1">Reason</label>
          <textarea
            value={reimbursement?.reason || ""}
            onChange={(e) =>
              setReimbursement((prev) =>
                prev ? { ...prev, reason: e.target.value } : prev
              )
            }
            className="border w-full p-2 rounded"
            rows={3}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <IconLoader size={16} className="animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
