"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TravelReimbursementInfo() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white my-6 border-gray-200 rounded-lg md:shadow-sm md:border">
      <h2 className="text-2xl font-bold text-center mb-4">
        HackKU 2025 - Travel Reimbursement Guidelines
      </h2>

      {/* Intro */}
      <p className="text-sm mb-4">
        We’re excited for you to join us at HackKU 2025! Below you’ll find all
        the information you need regarding travel reimbursement, eligibility
        requirements, and how to apply.
      </p>

      <hr className="border-gray-300 my-4" />

      {/* Apply */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Apply</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>
            <strong>Individual Applications:</strong> If you’re applying with a
            team,{" "}
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

      {/* Eligibility */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
        <ol className="list-decimal pl-5 text-sm space-y-1">
          <li>
            You must be a <strong>non-KU student</strong>.
          </li>
          <li>
            Your travel must exceed one of the following distances{" "}
            <strong>from the University of Kansas School of Engineering</strong>
            :
            <ul className="list-disc pl-5">
              <li>
                <strong>250+ miles</strong> if you’re flying
              </li>
              <li>
                <strong>75+ miles</strong> if you’re driving
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

      {/* Terms of Reimbursement */}
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
            from the HackKU team (hackku@ku.edu) if your travel reimbursement is
            approved.
          </li>
          <li>
            <strong>Decision Timeline:</strong> We will notify you by March 22,
            2025 if your travel reimbursement application has been approved.
          </li>
          <li>
            <strong>Allowed Expenses:</strong> Reimbursement can only be used
            for a combination of gas, bus tickets, or flight tickets.
          </li>
        </ul>
      </section>

      <hr className="border-gray-300 my-4" />

      {/* Reimbursement Categories */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Reimbursement Categories</h3>

        {/* Gas Reimbursements */}
        <div className="space-y-2 text-sm">
          <p className="font-semibold">1. Gas Reimbursements:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Typical Cap:</strong> Generally capped at $50 per person.
            </li>
            <li>
              <strong>Group Travel:</strong> If traveling as a group, the
              maximum is $50 per person up to $200 total. If your group has more
              than 4 people, reimbursement is subject to HackKU’s discretion.
            </li>
            <li>
              <strong>Acceptance Email:</strong> Your acceptance email will
              state the exact amount you qualify for. Full reimbursement is not
              guaranteed.
            </li>
          </ul>

          <h4 className="font-semibold">Gas Eligibility</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>You must attend HackKU in person.</li>
            <li>You must submit and present a project at HackKU.</li>
            <li>
              You must be traveling <strong>75+ miles</strong> to the University
              of Kansas School of Engineering.
            </li>
            <li>
              You must provide images of paper or digital receipts for any
              purchase(s), showing proof of payment (e.g., last four digits of a
              card) dated between 04/03/2025 – 04/07/2025.
            </li>
          </ol>

          <hr className="border-gray-300 my-4" />

          {/* Bus Reimbursements */}
          <p className="font-semibold">2. Bus Reimbursements:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Reimbursement Limit:</strong> We will reimburse up to $50
              for a bus ticket (Greyhound, etc.) if you choose to take a bus.
            </li>
            <li>
              <strong>No Provided Service:</strong> HackKU does not provide bus
              services from any university to our campus.
            </li>
          </ul>

          <h4 className="font-semibold">Bus Eligibility</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>You must attend HackKU in person.</li>
            <li>You must submit and present a project at HackKU.</li>
            <li>
              You must be traveling <strong>75+ miles</strong> to the University
              of Kansas School of Engineering.
            </li>
            <li>
              Your bus ticket must include your first and last name as listed on
              your application.
            </li>
            <li>
              You must provide images of paper receipts showing proof of payment
              (e.g., last four digits of a card) dated within 04/03/2025 –
              04/07/2025.
            </li>
          </ol>

          <hr className="border-gray-300 my-4" />

          {/* Flight Reimbursements */}
          <p className="font-semibold">3. Flight Reimbursements:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Case-by-Case Basis:</strong> Typical reimbursements range
              from $50 – $150 per person, but larger amounts may be considered
              for team travel.
            </li>
            <li>
              <strong>Encouraged to Apply with a Team:</strong> If requesting
              flight reimbursements, group applications are highly recommended.
            </li>
            <li>
              <strong>Acceptance Email:</strong> Your acceptance email will
              confirm the amount you qualify for. Full reimbursement is not
              guaranteed.
            </li>
          </ul>

          <h4 className="font-semibold">Flight Eligibility</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>You must attend HackKU in person.</li>
            <li>You must submit and present a project at HackKU.</li>
            <li>
              You must be traveling <strong>250+ miles</strong> to the
              University of Kansas School of Engineering.
            </li>
            <li>
              You must book a regular economy seat; upgrades and extra fees are
              not covered.
            </li>
            <li>
              Your flight ticket must include your first and last name as on
              your application, show a round trip to MCI (Kansas City
              International Airport), and be dated within 04/03/2025 –
              04/07/2025.
            </li>
            <li>
              You must provide images of paper or digital receipts showing proof
              of payment (e.g., last four digits of a card).
            </li>
          </ol>
        </div>
      </section>

      <hr className="border-gray-300 my-4" />

      {/* Reimbursement Process */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Reimbursement Process</h3>
        <ol className="list-decimal pl-5 text-sm space-y-1">
          <li>
            <strong>Verification of Attendance:</strong> We will begin
            processing and disbursing reimbursements starting April 11, 2025,
            after confirming that you submitted and presented your project at
            HackKU.
          </li>
          <li>
            <strong>Payment Method:</strong> Once approved, you’ll receive a
            form via the email you applied with. You’ll be asked to confirm your
            reimbursement information and upload receipts.
          </li>
          <li>
            <strong>Processing Time:</strong> Reimbursements will be sent via
            ACH or physical check and may take up to 3 weeks to ship to your
            address.
          </li>
        </ol>
      </section>

      <hr className="border-gray-300 my-4" />

      {/* Timeline */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Timeline</h3>
        <div className="text-sm space-y-4">
          <div>
            <h4 className="font-semibold">Reimbursement Application Window</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Opens:</strong> Now
              </li>
              <li>
                <strong>Closes:</strong> March 15, 2025
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Reimbursement Applications Close</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Deadline:</strong> March 15, 2025 (11:59 PM CST)
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">
              Application Approval/Rejection Response Window
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>From:</strong> March 16, 2025
              </li>
              <li>
                <strong>To:</strong> March 22, 2025
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Travel to/from HackKU</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Recommended Travel Dates:</strong> April 3, 2025 – April
                7, 2025
              </li>
              <li>
                (This allows attendees to arrive the day before HackKU begins
                and depart the day after it ends.)
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">
              Upload Receipts and Confirm Payment Information
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Deadline:</strong> April 10, 2025
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Reimbursal Window</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Begins:</strong> April 11, 2025
              </li>
              <li>
                <strong>Ends:</strong> May 2, 2025
              </li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="border-gray-300 my-4" />

      {/* Questions */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Questions?</h3>
        <p className="text-sm mb-4">
          If you have any questions or concerns, please email us at{" "}
          <a href="mailto:hackku@ku.edu" className="underline">
            hackku@ku.edu
          </a>
          . We’re here to help make your HackKU experience as smooth as
          possible!
        </p>
      </section>

      <p className="text-sm">We look forward to seeing you at HackKU 2025!</p>

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
