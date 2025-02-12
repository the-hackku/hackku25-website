"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TravelReimbursementInfo() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white my-6 border-gray-200 rounded-lg md:shadow-sm  md:border">
      <h2 className="text-2xl font-bold text-center mb-4">
        HackKU 2025 - Travel Reimbursement Guidelines
      </h2>

      <p className="text-sm mb-4">
        We&apos;re excited for you to join us at HackKU 2025! Below you&apos;ll
        find all the information you need regarding travel reimbursement,
        eligibility requirements, and how to apply.
      </p>

      <hr className="border-gray-300 my-4" />

      <section>
        <h3 className="text-lg font-semibold mb-2">Apply</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>
            <strong>Individual Applications:</strong> If you&apos;re applying
            with a team,{" "}
            <strong>each member must submit an individual application</strong>{" "}
            for travel reimbursement.
          </li>
          <li>
            <strong>Deadline:</strong> Make sure to submit your travel
            reimbursement application before{" "}
            <span className="bg-yellow-300">March 15, 2025 (11:59 PM CST)</span>
            .
          </li>
        </ul>
      </section>

      <hr className="border-gray-300 my-4" />

      <section>
        <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
        <ol className="list-decimal pl-5 text-sm space-y-1">
          <li>
            You must be a <strong>non-KU student</strong>.
          </li>
          <li>
            Your travel must exceed one of the following distances:
            <ul className="list-disc pl-5">
              <li>
                <strong>250+ miles</strong> if you&apos;re flying
              </li>
              <li>
                <strong>75+ miles</strong> if you&apos;re driving
              </li>
            </ul>
          </li>
          <li>
            The University of Kansas School of Engineering is located at{" "}
            <strong>1536 W 15th St, Lawrence, KS 66045</strong>.
          </li>
        </ol>
      </section>

      <hr className="border-gray-300 my-4" />

      <section>
        <h3 className="text-lg font-semibold mb-2">Terms of Reimbursement</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>
            <strong>Written Permission:</strong> Unless you have explicit,
            written permission from{" "}
            <a href="mailto:hackku@ku.edu" className="underline">
              hackku@ku.edu
            </a>
            , you must adhere to the guidelines below.
          </li>
          <li>
            <strong>Policy Changes:</strong> HackKU reserves the right to modify
            these terms at will.
          </li>
          <li>
            <strong>First-Come, First-Serve:</strong> All travel assistance is
            granted on a first-come, first-serve basis.
          </li>
          <li>
            <strong>Approval Email:</strong> You will receive a notification
            from the HackKU team if your travel reimbursement is approved.
          </li>
          <li>
            <strong>Decision Timeline:</strong> Notification by March 22, 2025.
          </li>
          <li>
            <strong>Allowed Expenses:</strong> Reimbursement can only be used
            for gas, bus tickets, or flight tickets.
          </li>
        </ul>
      </section>

      <hr className="border-gray-300 my-4" />

      <section>
        <h3 className="text-lg font-semibold mb-2">Reimbursement Categories</h3>

        <div className="space-y-2 text-sm">
          <p>
            <strong>1. Gas Reimbursements:</strong>
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Typical Cap:</strong> Generally capped at $50 per person.
            </li>
            <li>
              <strong>Group Travel:</strong> $50 per person, up to $200 total
              (4+ people subject to discretion).
            </li>
            <li>
              <strong>Acceptance Email:</strong> States the exact amount you
              qualify for. Full reimbursement is not guaranteed.
            </li>
          </ul>

          <p>
            <strong>2. Bus Reimbursements:</strong>
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Reimbursement Limit:</strong> Up to $50 for a bus ticket
              (e.g., Greyhound).
            </li>
            <li>
              <strong>No Provided Service:</strong> HackKU does not provide bus
              services from any university to our campus.
            </li>
          </ul>

          <p>
            <strong>3. Flight Reimbursements:</strong>
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Case-by-Case Basis:</strong> Typically $50-$150; larger
              amounts considered for team travel.
            </li>
            <li>
              <strong>Encouraged to Apply with a Team:</strong> Group
              applications are recommended.
            </li>
            <li>
              <strong>Acceptance Email:</strong> Confirms the amount you qualify
              for. Full reimbursement is not guaranteed.
            </li>
          </ul>
        </div>
      </section>

      <hr className="border-gray-300 my-4" />

      <section>
        <h3 className="text-lg font-semibold mb-2">Reimbursement Process</h3>
        <ol className="list-decimal pl-5 text-sm space-y-1">
          <li>
            <strong>Verification of Attendance:</strong> Processing starts April
            11, 2025, after confirming project submission and presentation.
          </li>
          <li>
            <strong>Payment Method:</strong> A form will be sent to confirm
            reimbursement details and upload receipts.
          </li>
          <li>
            <strong>Processing Time:</strong> Reimbursements sent via ACH or
            check, taking up to 3 weeks for delivery.
          </li>
        </ol>
      </section>

      <hr className="border-gray-300 my-4" />

      <section>
        <h3 className="text-lg font-semibold mb-2">Timeline</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>
            <strong>Application Closes:</strong> March 15, 2025 (11:59 PM CST).
          </li>
          <li>
            <strong>Approval Notification:</strong> March 16 - March 22, 2025.
          </li>
          <li>
            <strong>Recommended Travel Dates:</strong> April 3 - April 7, 2025.
          </li>
          <li>
            <strong>Receipts Submission Deadline:</strong> April 10, 2025.
          </li>
          <li>
            <strong>Reimbursal Period:</strong> April 11 - May 2, 2025.
          </li>
        </ul>
      </section>

      <hr className="border-gray-300 my-4" />

      <p className="text-sm text-muted-foreground">
        If you have any questions or concerns, please email us at{" "}
        <a href="mailto:hackku@ku.edu" className="underline">
          hackku@ku.edu
        </a>
        . We&apos;re here to help make your HackKU experience as smooth as
        possible!
      </p>

      <div className="mt-6">
        <Link href="/reimbursement/form">
          <Button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Apply for Reimbursement
          </Button>
        </Link>
      </div>
    </div>
  );
}
