"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";

const tableOfContents = [
  { title: "Wi-Fi", id: "wifi" },
  { title: "What to Bring", id: "what-to-bring" },
  { title: "Discord", id: "discord" },
  { title: "Travel", id: "travel" },
  { title: "Schedule", id: "schedule" },
  { title: "Competition Details", id: "competition-details" },
  { title: "Tracks, Challenges & Prizes", id: "tracks-challenges-prizes" },
  { title: "Workshops & Events", id: "workshops-events" },
  { title: "Food", id: "food" },
  {
    title: "Venue / Maps",
    id: "venue",
    children: [
      { title: "LEEP2", id: "venue-leep2" },
      { title: "Learned", id: "venue-learned" },
      { title: "Opening Ceremony Map", id: "venue-opening" },
    ],
  },
  { title: "Parking", id: "parking" },
  { title: "Resources", id: "resources" },
  { title: "Code of Conduct", id: "code-of-conduct" },
];

interface SectionContainerProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const SectionContainer = ({ id, title, children }: SectionContainerProps) => (
  <section
    id={id}
    className="scroll-mt-20 bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-sm"
  >
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    {children}
  </section>
);

export default function HackKUInfoPage() {
  const [currentHash, setCurrentHash] = useState<string>("");

  const handleScrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleClick = useCallback(
    (id: string) => {
      handleScrollToSection(id);

      // Wait for scroll animation before updating hash and currentHash
      setTimeout(() => {
        window.history.replaceState(null, "", `#${id}`);
        setCurrentHash(`#${id}`);
      }, 1000); // adjust this duration to match scroll speed
    },
    [handleScrollToSection]
  );

  useEffect(() => {
    const hash = window.location.hash.slice(1); // remove #
    if (hash) {
      setTimeout(() => {
        handleScrollToSection(hash);
        setCurrentHash(`#${hash}`);
      }, 50);
    }
  }, [handleScrollToSection]);

  useEffect(() => {
    const onScroll = () => {
      const flatTOC = tableOfContents.flatMap((item) =>
        item.children ? [item, ...item.children] : [item]
      );

      const offsets = flatTOC.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id, top: Math.abs(rect.top - 100) };
      });

      const closest = offsets.reduce((prev, curr) =>
        curr.top < prev.top ? curr : prev
      );

      if (`#${closest.id}` !== currentHash) {
        window.history.replaceState(null, "", `#${closest.id}`);
        setCurrentHash(`#${closest.id}`);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentHash]);

  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", updateHash);
    updateHash(); // set initial

    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  return (
    <div className="px-4 md:px-36 py-8 flex flex-col md:flex-row gap-8">
      {/* Table of Contents Sidebar */}
      <div className="w-full md:w-1/4 border border-gray-200 rounded-lg p-4 md:sticky top-4 shadow-sm h-fit flex flex-col">
        <h2
          className="text-xl font-semibold mb-3 hover:cursor-pointer"
          onClick={() => handleClick("top")}
        >
          Table of Contents
        </h2>
        <ul className="text-sm flex-1 flex flex-col justify-between gap-1">
          {tableOfContents.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className={`underline w-full text-left py-1 px-2 rounded transition-colors duration-200 text-gray-600 ${
                  currentHash === `#${section.id}`
                    ? "bg-blue-100 font-bold"
                    : "hover:bg-gray-100"
                }`}
              >
                {section.title}
              </button>
              {section.children && (
                <ul className="ml-4 mt-1 space-y-1">
                  {section.children.map((sub) => (
                    <li key={sub.id}>
                      <button
                        onClick={() => handleClick(sub.id)}
                        className={`text-left w-full text-gray-600 px-2 py-1 text-sm rounded-md underline ${
                          currentHash === `#${sub.id}`
                            ? "bg-blue-100 font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {sub.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <main className="md:w-3/4 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4" id="top">
            ℹ️ HackKU25 Information
          </h1>
          <p className="text-gray-600">
            Welcome to HackKU25! Below you’ll find info on Wi-Fi, Discord,
            schedule, venue details, and more.
          </p>
        </div>

        {/* Sections */}
        <SectionContainer id="wifi" title="📶 Wi-Fi">
          <p className="mb-4">
            KU students should be able to log in to the <strong>JAYHAWK</strong>{" "}
            Wi-Fi network as usual. Non-KU students may use the Wi-Fi network
            called <strong>KU GUEST</strong>, which should be available
            campus-wide. Please contact an organizer if you are having issues
            using the Wi-Fi.
          </p>
        </SectionContainer>

        <SectionContainer id="what-to-bring" title="🧳 What to Bring">
          <p className="mb-4">
            Here’s a handy checklist to help you pack for HackKU25! Be prepared
            for comfort, productivity, and overnight hacking!
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Tech & Tools:</strong>
              <ul className="list-disc list-inside ml-6">
                <li>Laptop</li>
                <li>Headphones/earbuds</li>
                <li>Chargers & extension cords</li>
                <li>Notebook and pens/pencils</li>
                <li>Any specific hardware or devices (e.g., Raspberry Pi)</li>
                <li>Mouse</li>
              </ul>
            </li>

            <li>
              <strong>Comfort:</strong>
              <ul className="list-disc list-inside ml-6">
                <li>Comfortable clothing (layers are great!)</li>
                <li>Pillows, blankets, or sleeping bag</li>
                <li>Reusable water bottle</li>
                <li>18+ chaperone for minors</li>
              </ul>
            </li>

            <li>
              <strong>Personal Care:</strong>
              <ul className="list-disc list-inside ml-6">
                <li>Toothbrush and toothpaste</li>
                <li>Deodorant</li>
                <li>Toiletries</li>
                <li>Towel (if applicable)</li>
                <li>Medications (if applicable)</li>
              </ul>
            </li>
          </ul>
        </SectionContainer>

        <SectionContainer id="discord" title="👾 Discord">
          <p>
            <strong>
              <a
                href="https://discord.com/invite/AJXm3k6xWq"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
              >
                Join the HackKU 2025 Discord!
              </a>
            </strong>
          </p>
          <p className="mt-2 mb-2">
            Discord will be the main form of communication during the event.
            There will be channels for announcements, meeting team members, and
            reaching out to sponsors, mentors, and organizers.
          </p>
          <p>
            <strong>Helper Duck</strong> <br />
            This year we have created a Discord Bot, Helper Duck, to quickly and
            easily get help from mentors! For more information on how to use
            Helper Duck, see below:{" "}
            <a
              href="https://www.notion.so/Helper-Duck-1a5226862b5381008024fa27a4a218de?pvs=21"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800 transition-colors"
            >
              Helper Duck
            </a>
            .
          </p>
        </SectionContainer>

        <SectionContainer id="travel" title="🧳 Travel">
          <h3 className="text-xl font-medium mt-2 mb-2">🌤️ Weather</h3>
          <p className="mb-4">
            The average April weather in Lawrence, Kansas can be anywhere
            between 40–80°F and is generally sunny, but be prepared for the
            possibility of rain as well!
          </p>
          <h3 className="text-xl font-medium mt-6 mb-2">
            🗺️ Venue Information
          </h3>

          <p className="mb-2">
            HackKU25 will take place throughout the University of Kansas School
            of Engineering, which includes LEEP2, Eaton, and Learned Halls. The
            Opening Ceremony will take place across campus in{" "}
            <strong>Budig Hall 120 Auditorium</strong>
          </p>
          <h4 className="text-lg font-medium mt-4 mb-2">Accommodations</h4>
          <p className="mb-4">
            <br />
            HackKU will NOT be providing specific sleeping accommodations,
            however, all participants are welcome to sleep in the venue if they
            wish, and the room <strong>LEEP2 2420</strong> will be a designated
            de-stressing room with movie screening and board games. There are
            several affordable hotels near KU’s campus as well.
          </p>
          <h3 className="text-xl font-medium mt-6 mb-2">
            ✈️ For Flying Travelers
          </h3>
          <h4 className="text-lg font-medium mt-2">Airport</h4>
          <p className="mb-2">
            The closest airport is <strong>MCI</strong> (often colloquially
            called Kansas City International or KCI).
          </p>
          <h4 className="text-lg font-medium mt-2">
            Airport to Lawrence, Kansas
          </h4>
          <p className="mb-2">
            MCI is about 50 miles northeast of Lawrence, Kansas. The best way to
            get from MCI to Lawrence is via Uber or Lyft.
          </p>
          <h4 className="text-lg font-medium mt-2">Getting around Town</h4>
          <ul className="list-disc list-inside ml-6 mb-4">
            <li>
              Lawrence has a free bus system! The maps and schedules can be
              found{" "}
              <a
                href="https://lawrencetransit.org/routes/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
              >
                here
              </a>
              .
            </li>
            <li>Uber and Lyft are also reasonably priced.</li>
            <li>
              Much of Lawrence’s downtown is within a ~20–30 min walk from
              campus.
            </li>
          </ul>
          <h3 className="text-xl font-medium mt-6 mb-2">🌻 More Information</h3>
          <p>
            If you have any questions about KU, Lawrence, or Kansas, feel free
            to reach out to an organizer! We are happy to help and provide some
            recommendations.
          </p>
        </SectionContainer>

        <SectionContainer id="schedule" title="🗓️ Schedule">
          <h3 className="text-xl font-medium mt-4 mb-2">Check-in Process</h3>
          <p>
            We will be checking in at the{" "}
            <strong>front doors on the ground floor of LEEP2</strong> starting
            at <strong>5PM on Friday, April 4</strong>. You must check-in to
            pick up your ID badge, which gets you access to food and swag. If
            you are unable to check-in during this time, stop by the Organizer’s
            HQ when you do arrive.
          </p>
          <h3 className="text-xl font-medium mt-4 mb-2">Schedule</h3>
          <p>
            The full schedule can be found in the{" "}
            <Link href="/schedule" className="underline">
              Schedule
            </Link>{" "}
            tab. The schedule may be updated throughout the Hackathon, so be
            sure to check the Discord for any updates.
          </p>
        </SectionContainer>

        <SectionContainer
          id="competition-details"
          title="💻 Competition Details"
        >
          <h3 className="text-xl font-medium mt-4 mb-2">Team Formation</h3>
          <ul className="list-disc list-inside ml-6 mb-2">
            <li>Your team may consist of up to four participants.</li>
            <li>
              All team members must be registered participants of HackKU25,
              check in, and be present at the event.
            </li>
            <li>
              Don’t worry if you don’t have a team yet! There will be a team
              formation event after the opening ceremony, and a teambuilding
              channel on Discord to find teammates.
            </li>
          </ul>
          <h3 className="text-xl font-medium mt-4 mb-2">Competition Rules</h3>
          <ul className="list-disc list-inside ml-6 mb-2">
            <li>
              All code for your project <strong>MUST</strong> be written during
              HackKU, between 8PM on April 4th and 8AM on April 6th.
            </li>
            <li>
              Your entire project must be created only by the participants on
              your team.
            </li>
            <li>
              Your code must be made public on GitHub for judging purposes.
            </li>
          </ul>
        </SectionContainer>

        <SectionContainer
          id="tracks-challenges-prizes"
          title="🏆 Tracks, Challenges & Prizes"
        >
          <p>
            The official HackKU theme and track details will be announced during
            the <strong>Opening Ceremony</strong>. Track rules, guidelines, and
            judging criteria will be revealed afterwards.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Theme Track</h3>
          <p>Challenge Details: Health and Well-Being</p>
          <Link href="" className="underline" target="_blank">
            <p>View Slides from Presentation</p>
          </Link>
          <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
            <li>
              <strong>1st Place:</strong> Nintendo Switch Lite (Turquoise)
            </li>
            <li>
              <strong>2nd Place:</strong> Fujifilm Instax Mini 11
            </li>
            <li>
              <strong>3rd Place:</strong> $50 Gift Cards
            </li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">General Track</h3>
          <ul className="list-disc list-inside ml-6 space-y-2">
            <li>
              <strong>1st Place:</strong> Samsung Galaxy Tab A9+ (2024)
            </li>
            <li>
              <strong>2nd Place:</strong> Keychron K2 Wireless Mechanical
              Keyboard
            </li>
            <li>
              <strong>3rd Place:</strong> $50 Gift Cards
            </li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">Challenge Prizes</h3>
          <ul className="list-disc list-inside ml-6 space-y-2">
            <li>
              <strong>Best High School Project:</strong> Anker PowerCore 10K
            </li>
            <li>
              <strong>Best Beginner Project (College/University):</strong> 3 Qt
              Air Fryer
            </li>
            <li>
              <strong>Best Hardware Project:</strong> Raspberry Pi 4 Model B
              (2GB)
            </li>
            <li>
              <strong>Most Creative UI/UX:</strong> Wacom “One” Drawing Tablet
            </li>
            <li>
              <strong>Hacker’s Choice Award:</strong> JBL Go 3 Bluetooth Speaker
            </li>
          </ul>
          <hr className="my-6 border-gray-300" />
          <h2 className="text-2xl font-semibold mb-4">🎯 Sponsor Tracks</h2>
          {/* PSTC */}
          <h3 className="text-lg font-semibold mt-4 mb-1">
            Patient Safety Technology Challenge
          </h3>
          <p className="text-gray-700 mb-2">
            Have you or someone you know experienced receiving incorrect
            medication, developed an infection within a healthcare facility, or
            faced a delay in treatment due to a new diagnosis not being
            communicated timely? These are exactly the types of patient safety
            issues we are challenging you to tackle this weekend. Your
            innovative hack could not only become a viable business but also
            significantly benefit humanity and save lives!
            <br />
            Go to{" "}
            <Link
              href="https://www.patientsafetytech.com/"
              target="_blank"
              className="underline"
            >
              Patient Safety Tech
            </Link>{" "}
            to learn more about this track!
            <Link
              href="https://docs.google.com/presentation/d/1_IId9C6fipiO480l2SqmUyYe7qcUn4pU/edit#slide=id.p2"
              className="underline"
              target="_blank"
            >
              <p>View Slides from Presentation</p>
            </Link>
          </p>
          <p className="font-medium">Prizes:</p>
          <ul className="list-disc list-inside ml-6 mb-6">
            <li>
              <b>First Place</b>: Beats Solo 4
            </li>
            <li>
              <b>Second Place</b>: Logitech G305 Wireless Mouse
            </li>
          </ul>
          {/* Pella */}
          <h3 className="text-lg font-semibold mt-4 mb-1">
            Pella Sponsor Track
          </h3>
          <p className="text-gray-700 mb-2">
            This award recognizes the team that develops the most groundbreaking
            solution in the realm of home innovation. The winning hack will
            showcase originality, creativity, and a forward-thinking approach.
            <br />
            Example ideas: Home automation, Recipe Finder and Meal Planner, Home
            Energy Efficiency Calculator, Apartment Finder.
          </p>
          <p className="font-medium">Prizes:</p>
          <ul className="list-disc list-inside ml-6 mb-6">
            <li>
              <b>1st Place</b>: Keychron K3 Mechanical Keyboard and Logitech
              Bluetooth Computer Speakers with Subwoofer
            </li>
            <li>
              <b>2nd Place</b>: Keychron K3 Mechanical Keyboard and Logitech
              Bluetooth Computer Speakers with Subwoofer
            </li>
          </ul>
          {/* Ripple */}
          <h3 className="text-lg font-semibold mt-4 mb-1">
            Ripple Sponsor Track
          </h3>
          <p className="text-gray-700 mb-2">
            Use RLUSD on the XRP Ledger to build an innovative finance app.
            Explore applications such as DeFi, cross-border payments,
            micropayments, digital wallets, RWA Tokenization, InsurTech,
            RegTech, financial inclusion, crowdfunding, and more.
          </p>
          <p className="font-medium">Requirements:</p>
          <ul className="list-disc ml-6 mb-2 text-sm">
            <li>Operations must run on XRPL testnet</li>
            <li>Transactions verifiable via explorer</li>
            <li>Public GitHub repo with MIT License</li>
            <li>2-minute demo video</li>
            <li>Majority of project must be built during HackKU</li>
          </ul>
          <p className="font-medium">Prizes:</p>
          <ul className="list-disc list-inside ml-6 mb-6">
            <li>
              <b>Winning Team:</b> $1,000
            </li>
            <li>
              <b>Runner-up</b>: $500
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-1">
            Niantic Sponsor Track
          </h3>
          <p className="text-gray-700 mb-2">
            Create a WebXR experience utilizing Niantic Studio’s beta visual
            editor to create an immersive experience that transforms the world
            around you.
            <br />
            Go to the <em>Niantic workshop</em> to learn more about this track!
            <p>
              <Link
                href="https://docs.google.com/presentation/d/1yiq1Gij8f2XZuNgzdn-0e_cPj141bdEHyPtQvuyNvTI/edit#slide=id.g1ddd9163b76_0_173"
                target="_blank"
                className="underline"
              >
                View Slides from Presentation
              </Link>
            </p>
          </p>
          <p className="font-medium">Prize:</p>
          <ul className="list-disc list-inside ml-6 mb-6">
            <li>
              <b>Prize:</b> $100 Amazon Gift Card per team member
            </li>
          </ul>
          {/* MLH */}
          <h3 className="text-lg font-semibold mt-4 mb-1">
            Major League Hacking (MLH) Prizes
          </h3>
          <ul className="list-disc list-inside ml-6 mb-2">
            <li>
              <strong>Best Use of Gemini API:</strong> Assorted Prizes (Visit
              MLH Booth)
            </li>
            <li>
              <strong>Best Use of Midnight:</strong> JBL Tune 510BT Wireless
              Headphones
            </li>
            <li>
              <strong>Best Use of MongoDB Atlas:</strong> M5GO IoT Starter Kit
            </li>
            <li>
              <strong>Best Domain Name from GoDaddy Registry:</strong> Digital
              Gift Card
            </li>
          </ul>
        </SectionContainer>

        <SectionContainer id="workshops-events" title="🧑‍💻 Workshops & Events">
          <p className="mb-2">
            No hackathon experience would be complete without workshops and
            events! Learn new skills at workshops, and take a break from coding
            to meet other hackers at social events.
          </p>

          <h3 className="text-xl font-medium mt-4 mb-2">Bingo Card</h3>
          <p>
            Participate and complete the challenges on your{" "}
            <strong>HackKU25 Bingo Card</strong> to win awesome prizes! Each
            completed square brings you closer to victory.{" "}
            <em>Prizes coming soon!</em>
          </p>
          <h3 className="text-xl font-medium mt-4 mb-2">
            Event / Workshop Schedule
          </h3>
          <p>
            The full schedule of workshops and events will be available on the{" "}
            <Link href="/schedule" className="underline">
              Schedule
            </Link>{" "}
            page. Be sure to check it out! All Workshops and Events will be
            posted here.
          </p>
        </SectionContainer>

        <SectionContainer id="food" title="🍽️ Food">
          <p className="mb-4">
            All meals are provided free of charge, and assorted snacks and
            drinks will be available throughout the weekend!
          </p>

          {[
            {
              day: "Friday",
              meals: [
                {
                  label: "Dinner",
                  vendor: "Globe Indian",
                  items: [
                    "Veggie Pakora",
                    "Channa Masala",
                    "Chicken 65",
                    "Naan pieces",
                    "Tikka Masala",
                    "Rice",
                  ],
                },
                {
                  label: "Late Night Snack",
                  vendor: "Eileens Colossal Cookies",
                  items: [
                    "Cookies",
                    "“Gluten free” cookie cake",
                    "Thai milk with crystal bubbles",
                  ],
                },
              ],
            },
            {
              day: "Saturday",
              meals: [
                {
                  label: "Breakfast",
                  vendor: "Wheatfields Bakery",
                  items: [
                    "Empanada trays (burgundy mushroom/swiss and chicken fajita)",
                    "Quiche trays (ham/onion/gouda and tomato/basil/mozzarella)",
                    "Breads and spreads:",
                    [
                      "Hummus (vegan)",
                      "Roasted red pepper",
                      "Whipped chev and blueberry compote",
                      "Dill and chive compound butter",
                    ],
                    "Croissants (plain / chocolate)",
                    "Danish trays (cherry almond)",
                    "Scone trays (apple cinnamon / cherry chocolate)",
                  ],
                },
                {
                  label: "Lunch",
                  vendor: "Red Pepper",
                  items: [
                    "Egg Rolls",
                    "Crab Rangoons",
                    "Vegetable Lo Mein",
                    "Vegetable Fried Rice",
                    "Sesame Chicken",
                    "Beef Broccoli",
                    "Cold Noodles",
                    "Vegetable",
                  ],
                },
                {
                  label: "Dinner",
                  vendor: "La Estrella",
                  items: [
                    "Tacos: steak, carnitas, pollo, birria",
                    "Rice",
                    "Beans",
                  ],
                },

                {
                  label: "Late Night Snack",
                  vendor: "Bubble Box",
                  items: [
                    "Mango with crystal bubbles (vegan)",
                    "Thai milk with oatmilk (no bubbles) (vegan / DF)",
                    "Thai milk with crystal bubbles",
                  ],
                },
              ],
            },
            {
              day: "Sunday",
              meals: [
                {
                  label: "Breakfast",
                  vendor: "McClains",
                  items: [
                    "Pastry Box",
                    "Very Berry Sunflower Toast",
                    "Market Bowl (halal chicken, sausage, other options)",
                    "Coffee Carafe",
                  ],
                },
              ],
            },
          ].map((day) => (
            <div key={day.day} className="mb-8">
              <h3 className="text-xl font-medium mb-4">{day.day}</h3>
              {day.meals.map((meal, i) => (
                <div key={i} className="mb-4">
                  <p className="font-semibold">
                    {meal.label}: <em>{meal.vendor}</em>
                  </p>
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    {meal.items.map((item, j) =>
                      Array.isArray(item) ? (
                        <ul key={j} className="list-disc ml-6 space-y-1">
                          {item.map((subItem, k) => (
                            <li key={k}>{subItem}</li>
                          ))}
                        </ul>
                      ) : (
                        <li key={j}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              ))}
              <hr />
            </div>
          ))}

          <aside className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg text-sm mt-6">
            ⚠️{" "}
            <strong>
              Please bring your own reusable water bottle to reduce waste!
            </strong>
          </aside>
        </SectionContainer>

        <SectionContainer id="venue" title="🗺️ Venue / Maps">
          <p className="mb-4">
            HackKU will be hosted at the University of Kansas School of
            Engineering. The main building (Learned Engineering Expansion 2,
            LEEP2) is located at{" "}
            <a
              href="https://goo.gl/maps/gFWLzxbcRSVTgijQ9"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800 transition-colors"
            >
              1536 W 15th St, Lawrence, KS 66045
            </a>
            . Rooms for hacking, workshops, and other events are listed below.
          </p>

          <div className="space-y-6">
            <h2 id="venue-leep2" className="text-lg font-semibold mb-2">
              LEEP2 Maps
            </h2>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                LEEP2 Ground Floor (LEEP2 G...)
              </h3>
              <div className="relative w-full h-auto aspect-[500/300]">
                {" "}
                {/* maintains aspect ratio */}
                <Image
                  src="/images/maps/leep2_ground.svg"
                  alt="LEEP2 Ground Floor Map"
                  fill
                  className="object-contain rounded border border-gray-300"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                LEEP2 First Floor (LEEP2 1...)
              </h3>
              <div className="relative w-full h-auto aspect-[500/300]">
                <Image
                  src="/images/maps/leep2_first.svg"
                  alt="LEEP2 Second Floor Map"
                  fill
                  className="object-contain rounded border border-gray-300"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                LEEP2 Second Floor (LEEP2 2...)
              </h3>
              <div className="relative w-full h-auto aspect-[500/300]">
                <Image
                  src="/images/maps/leep2_second.svg"
                  alt="LEEP2 Second Floor Map"
                  fill
                  className="object-contain rounded border border-gray-300"
                />
              </div>
            </div>
            <hr />
            <h2 id="venue-learned" className="text-lg font-semibold mb-2">
              Learned Hall Maps
            </h2>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Learned First Floor
              </h3>
              <div className="relative w-full h-auto aspect-[500/300]">
                {" "}
                {/* maintains aspect ratio */}
                <Image
                  src="/images/maps/learned_first.svg"
                  alt="Learned First Floor"
                  fill
                  className="object-contain rounded border border-gray-300"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Learned Second Floor
              </h3>
              <div className="relative w-full h-auto aspect-[500/300]">
                {" "}
                {/* maintains aspect ratio */}
                <Image
                  src="/images/maps/learned_second.svg"
                  alt="Learned Second Floor"
                  fill
                  className="object-contain rounded border border-gray-300"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Learned Third Floor
              </h3>
              <div className="relative w-full h-auto aspect-[500/300]">
                {" "}
                {/* maintains aspect ratio */}
                <Image
                  src="/images/maps/learned_third.svg"
                  alt="Learned First Floor"
                  fill
                  className="object-contain rounded border border-gray-300"
                />
              </div>
            </div>
            <hr />
            <h2 id="venue-opening" className="text-lg font-semibold mb-2">
              Map to Opening Ceremony (Budig Hall)
            </h2>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Map to Opening Ceremony (Budig Hall) from Engineering
              </h3>
              <div className="relative w-full h-auto aspect-[500/300]">
                <Image
                  src="/images/maps/maptobudig.png"
                  alt="Map to budig"
                  fill
                  className="object-contain rounded border border-gray-300"
                />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-medium mt-8 mb-2">Hacking Rooms</h3>
          <ul className="list-disc list-inside ml-6 mb-2">
            <li>
              <strong>Available for everyone:</strong> LEEP2: 2415, 2425;
              Learned: 1136, 2111, 2115, 2133, 3150, 3151, 3152, 3153, 3154
            </li>
            <li>
              <strong>Themed rooms (for registered):</strong> LEEP2: 2324, 2326,
              2328
            </li>
            <li>
              <strong>Giveaway rooms:</strong> LEEP2: 2322 & 2320
            </li>
            <li>
              <strong>Rooms for high-schoolers & out-of-state:</strong> LEEP2:
              1320, 1322, 1324, 1326, 1328
            </li>
          </ul>
        </SectionContainer>

        <SectionContainer id="parking" title="🚗 Parking">
          <p className="mb-2">
            Participants should plan to arrive on the afternoon of Friday, April
            4th to check in.
          </p>
          <ul className="list-disc list-inside ml-6">
            <li>
              If you arrive before 5:00 PM on Friday, park in the Allen
              Fieldhouse garage (first hour fee $1.75 + $1.50/hr until 5PM).
            </li>
            <li>
              If you arrive after 5:00 PM, we recommend parking in Lots 41, 54,
              72, or 90. All lots are free to park in <b>after 5:00</b> on
              Friday, shown below or on KU’s full{" "}
              <a
                href="https://parking.ku.edu/sites/parking/files/documents/parkingmap.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
              >
                parking map
              </a>
              . Don&apos;t hesitate to reach out to an organizer if you have any
              questions about parking.
            </li>
            <div className="relative w-full h-auto aspect-[500/300]">
              {" "}
              {/* maintains aspect ratio */}
              <Image
                src="/images/maps/parking.png"
                alt="LEEP2 Ground Floor Map"
                fill
                className="object-contain rounded border border-gray-300"
              />
            </div>
          </ul>
        </SectionContainer>

        <SectionContainer id="resources" title="📚 Resources">
          <div>
            <h1 className="text-lg">Beginner Workshops:</h1>
            <Link
              href="https://drive.google.com/drive/folders/1XEw_IFyhPRxq8SnmnvyU6RsD3__itkr9"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800 transition-colors"
            >
              Intro to Git/GitHub/VCS
            </Link>

            <p>
              <Link
                href="https://drive.google.com/file/d/1iJo7iFkrbryY8aTh-_Q1bzt__WXHjJ2V/view"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
              >
                Intro to Javascript
              </Link>
            </p>
          </div>
          <div>
            <h1 className="text-lg">Day-Of Slides:</h1>
            <p>
              <Link
                href=" https://kansas-my.sharepoint.com/:p:/g/personal/w412w955_home_ku_edu/EZD1-3KaJG5Go1uvjjsLDH0BtDT-vVXdQ4SyFRJaaRsIXw?e=wTJJAe"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
              >
                Opening Ceremony Slides!
              </Link>
            </p>
            <Link
              href="https://docs.google.com/presentation/d/1yiq1Gij8f2XZuNgzdn-0e_cPj141bdEHyPtQvuyNvTI/edit#slide=id.g1ddd9163b76_0_173"
              target="_blank"
              className="underline text-blue-600 hover:text-blue-800 transition-colors"
            >
              Niantic Workshop Slides
            </Link>
            <p>
              <Link
                href="https://docs.google.com/presentation/d/1_IId9C6fipiO480l2SqmUyYe7qcUn4pU/edit#slide=id.p2"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
              >
                PSTC Workshop Slides
              </Link>
            </p>
            <p>
              <Link
                href="https://events.mlh.io/events/12507"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
              >
                Github Copilot Slides
              </Link>
            </p>
            <p>
              <Link
                href="https://docs.google.com/presentation/d/1lgPUK2apuhM18cgXXciGh1j6Omuc1ztAvlo_aDn9fvg/edit#slide=id.p"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
              >
                Deep Learning Slides
              </Link>
            </p>
            <p>
              <Link
                href="https://docs.google.com/presentation/d/1RJNW17w4BIYRUkFPHy9NzkpWtSAShK1a/edit#slide=id.p1"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
              >
                Arduino 101 Slides
              </Link>
            </p>
            <p>
              <Link
                href="https://docs.google.com/presentation/d/1AveBkrW2aHg120iPJiDdVAqSUFxOr43J_oasujKxELM/edit#slide=id.g17fcb9d1cb3_0_4149"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
              >
                APIs Workshop Slides
              </Link>
            </p>
            <p>
              <Link
                href="https://docs.google.com/presentation/d/1ErblOpkiyxrWbs9ScEU-BU7-DYvkts7nhMC9WSu-PxQ/edit#slide=id.g26e6ee47073_1_111"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
              >
                Exploring Hardware Designs Workshop Slides
              </Link>
            </p>
          </div>
        </SectionContainer>
        <SectionContainer id="code-of-conduct" title="📜 Code of Conduct">
          <p>
            Please review the HackKU Code of Conduct here:{" "}
            <Link
              href="/legal/code-of-conduct"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800 transition-colors"
            >
              Code of Conduct
            </Link>
            .
          </p>
        </SectionContainer>
      </main>
    </div>
  );
}
