"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation"; // updated import
import React, { useState, useEffect, useCallback, useRef } from "react";

const tableOfContents = [
  { title: "Wi-Fi", id: "wifi" },
  { title: "Discord", id: "discord" },
  { title: "Travel", id: "travel" },
  { title: "Schedule", id: "schedule" },
  { title: "Competition Details", id: "competition-details" },
  { title: "Tracks, Challenges & Prizes", id: "tracks-challenges-prizes" },
  { title: "Workshops & Events", id: "workshops-events" },
  { title: "Food", id: "food" },
  { title: "Venue", id: "venue" },
  { title: "Parking", id: "parking" },
  { title: "Code of Conduct", id: "code-of-conduct" },
  { title: "Resources", id: "resources" },
];

interface SectionContainerProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const SectionContainer = ({ id, title, children }: SectionContainerProps) => (
  <section
    id={id}
    className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-sm"
  >
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    {children}
  </section>
);

export default function HackKUInfoPage() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Combined manual scroll and URL update.
  const handleScrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      // Update URL query param when user clicks a TOC item.
      const currentUrl = window.location.pathname;
      window.history.replaceState(null, "", `${currentUrl}?section=${id}`);
    }
  }, []);

  // On initial mount: if a section query param exists, scroll to that section.
  useEffect(() => {
    const sectionQuery = searchParams.get("section");
    if (sectionQuery) {
      // Delay slightly to ensure elements are rendered.
      setTimeout(() => {
        handleScrollToSection(sectionQuery);
      }, 100);
    }
  }, [searchParams, handleScrollToSection]);

  useEffect(() => {
    // Populate refs for each section.
    tableOfContents.forEach(({ id }) => {
      sectionRefs.current[id] = document.getElementById(id);
    });

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="px-4 md:px-36 py-8 flex flex-col md:flex-row gap-8">
      {/* Table of Contents Sidebar */}
      <div className="w-full md:w-1/4 border border-gray-200 rounded-lg p-4 md:sticky top-4 self-start shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-3">Table of Contents</h2>
        <ul className="space-y-2 text-sm">
          {tableOfContents.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => handleScrollToSection(section.id)}
                className={`underline block py-1 px-2 rounded transition-colors duration-200 text-gray-600 ${
                  activeSection === section.id
                    ? "bg-blue-100 font-bold"
                    : "hover:bg-gray-100"
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <main className="md:w-3/4 w-full">
        <div className="w-full pt-16 sticky top-0 self-start bg-white"></div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">HackKU25 Information</h1>
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
            🚨 <strong>Need to add map</strong>
          </p>
          <p className="mb-2">
            HackKU25 will take place throughout the University of Kansas School
            of Engineering, which includes LEEP2, Eaton, and Learned Halls. The
            Opening Ceremony will take place across campus in{" "}
            <strong>Budig Hall 120 Auditorium</strong>
          </p>
          <h4 className="text-lg font-medium mt-4 mb-2">Accommodations</h4>
          <p className="mb-4">
            🚨 <strong>Need to be edited</strong>
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
          <h3 className="text-xl font-semibold mt-4 mb-2">Theme Track</h3>
          <p>
            The theme will be announced during <strong>OPENING CEREMONY</strong>
            !
          </p>

          <ul className="list-disc list-inside ml-6 mt-2 space-y-4">
            <li>
              <strong>1st Place:</strong>{" "}
              <a
                href="https://www.amazon.com/Nintendo-Switch-Lite-Turquoise/dp/B07V4GCFP9"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Nintendo Switch Lite (Turquoise)
              </a>
            </li>
            <li>
              <strong>2nd Place:</strong>{" "}
              <a
                href="https://www.amazon.com/Fujifilm-Instax-Mini-Instant-Camera/dp/B0852844YB"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Fujifilm Instax Mini 11
              </a>
            </li>
            <li>
              <strong>3rd Place:</strong> $50 Gift Cards
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">General Track</h3>
          <ul className="list-disc list-inside ml-6 space-y-4">
            <li>
              <strong>1st Place:</strong>{" "}
              <a
                href="https://www.amazon.com/SAMSUNG-Android-Speakers-Upgraded-Graphite/dp/B0CLF3VPMV"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Samsung Galaxy Tab A9+ (2024)
              </a>
            </li>
            <li>
              <strong>2nd Place:</strong>{" "}
              <a
                href="https://www.amazon.com/Keychron-Wireless-Bluetooth-Mechanical-Keyboard/dp/B07YB32H52"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Keychron K2 Wireless Mechanical Keyboard
              </a>
            </li>
            <li>
              <strong>3rd Place:</strong> $50 Gift Cards
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">Challenge Prizes</h3>
          <ul className="list-disc list-inside ml-6 space-y-4">
            <li>
              <strong>Best High School Project:</strong>{" "}
              <a
                href="https://www.amazon.com/dp/B0D5CLSMFB"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Anker Power Bank
              </a>
            </li>
            <li>
              <strong>Best Beginner Project (College/University):</strong>{" "}
              <a
                href="https://www.amazon.com/dp/B0DD12R7MY"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Air Fryer
              </a>
            </li>
            <li>
              <strong>Best Hardware Project:</strong>{" "}
              <a
                href="https://www.amazon.com/dp/B07TD42S27"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Raspberry Pi 4 Model B (2GB)
              </a>
            </li>
            <li>
              <strong>Most Creative UI/UX:</strong>{" "}
              <a
                href="https://www.amazon.com/dp/B07S1RR3FR"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800"
              >
                Wacom Drawing Tablet
              </a>
            </li>
            <li>
              <strong>Hacker’s Choice Award:</strong>{" "}
              <a
                href="https://www.amazon.com/dp/B08KW1KR5H"
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800"
              >
                JBL Go 3 Bluetooth Speaker
              </a>
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">Sponsor Tracks</h3>
          <ul className="list-disc list-inside ml-6 space-y-2">
            <li>
              <strong>Patient Safety Technology Challenge</strong> — announced
              at opening ceremony
              <ul className="list-disc list-inside ml-6">
                <li>
                  1st:{" "}
                  <a
                    href="https://www.beatsbydre.com/headphones/solo4-wireless"
                    className="underline text-blue-600 hover:text-blue-800"
                    target="_blank"
                  >
                    Beats Solo 4
                  </a>
                </li>
                <li>
                  2nd:{" "}
                  <a
                    href="https://www.logitechg.com/en-us/products/gaming-mice/g305-lightspeed-wireless-gaming-mouse.910-005280.html"
                    className="underline text-blue-600 hover:text-blue-800"
                    target="_blank"
                  >
                    Logitech G305 Wireless Mouse
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <strong>Niantic Sponsor Track:</strong> Prize announced at opening
              ceremony
            </li>
            <li>
              <strong>Pella Sponsor Track:</strong> Prize announced at opening
              ceremony
            </li>
            <li>
              <strong>Ripple Sponsor Track:</strong> Prize announced at opening
              ceremony
            </li>
            <li>
              <strong>Major League Hacking Prizes:</strong> Visit MLH table or
              check Discord for details
            </li>
          </ul>
        </SectionContainer>

        <SectionContainer id="workshops-events" title="🧑‍💻 Workshops & Events">
          <p className="mb-2">
            No hackathon experience would be complete without workshops and
            events! Learn new skills at workshops, and take a break from coding
            to meet other hackers at social events.
          </p>
          <p className="mb-2">
            More info:{" "}
            <Link
              href="/schedule"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800 transition-colors"
            >
              Schedule
            </Link>
          </p>
          <h3 className="text-xl font-medium mt-4 mb-2">Bingo Card</h3>
          <p>
            Participate and complete the challenges on your{" "}
            <strong>HackKU25 Bingo Card</strong> to win awesome prizes! Each
            completed square brings you closer to victory.{" "}
            <em>Prizes coming soon!</em>
          </p>
        </SectionContainer>

        <SectionContainer id="food" title="🍽️ Food">
          <p className="mb-4">
            All meals are provided free of charge, and assorted snacks and
            drinks will be available throughout the weekend!
          </p>

          <h3 className="text-xl font-medium mt-4 mb-2">Friday</h3>
          <p>
            <strong>Dinner:</strong> <em>Red Pepper</em>
          </p>
          <ul className="list-disc list-inside ml-6 mb-2">
            <li>Egg Rolls</li>
            <li>Crab Rangoons</li>
            <li>Vegetable Lo Mein</li>
            <li>Vegetable Fried Rice</li>
            <li>Sesame Chicken</li>
            <li>Beef Broccoli</li>
            <li>Cold Noodles</li>
            <li>Vegetable</li>
          </ul>

          <p>
            <strong>Late Night Snack:</strong>{" "}
            <em>Bubble Box / Eileens Colossal Cookies</em>
          </p>
          <ul className="list-disc list-inside ml-6 mb-2">
            <li>Mango with crystal bubbles (vegan)</li>
            <li>Thai milk with oatmilk (no bubbles) (vegan / DF)</li>
            <li>Thai milk with crystal bubbles</li>
            <li>Cookies</li>
            <li>“Gluten free” cookie cake</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Saturday</h3>
          <p>
            <strong>Breakfast:</strong> <em>Wheatfields Bakery</em>
          </p>
          <ul className="list-disc list-inside ml-6">
            <li>Empanada trays (burgundy mushroom/swiss and chicken fajita)</li>
            <li>Quiche trays (ham/onion/gouda and tomato/basil/mozzarella)</li>
            <li>
              Breads and spreads:
              <ul className="list-disc list-inside ml-6">
                <li>Hummus (vegan)</li>
                <li>Roasted red pepper</li>
                <li>Whipped chev and blueberry compote</li>
                <li>Dill and chive compound butter</li>
              </ul>
            </li>
            <li>Croissants (plain / chocolate)</li>
            <li>Danish trays (cherry almond)</li>
            <li>Scone trays (apple cinnamon / cherry chocolate)</li>
          </ul>

          <p className="mt-2">
            <em>McClains</em>
          </p>
          <ul className="list-disc list-inside ml-6 mb-6">
            <li>Pastry Box</li>
            <li>Very Berry Sunflower Toast</li>
            <li>Market Bowl (halal chicken, sausage, other options)</li>
            <li>Coffee Carafe</li>
          </ul>

          <p>
            <strong>Lunch:</strong> <em>La Estrella</em>
          </p>
          <ul className="list-disc list-inside ml-6 mb-6">
            <li>Tacos: steak, carnitas, pollo, birria</li>
            <li>Rice</li>
            <li>Beans</li>
          </ul>

          <p>
            <strong>Dinner:</strong> <em>Globe Indian</em>
          </p>
          <ul className="list-disc list-inside ml-6 mb-6">
            <li>Veggie Pakora</li>
            <li>Channa Masala</li>
            <li>Chicken 65</li>
            <li>Naan pieces</li>
            <li>Tikka Masala</li>
            <li>Rice</li>
          </ul>

          <p>
            <strong>Late Night Snack:</strong> <em>Bubble Box</em>
          </p>
          <ul className="list-disc list-inside ml-6 mb-2">
            <li>Mango with crystal bubbles (vegan)</li>
            <li>Thai milk with oatmilk (no bubbles) (vegan / DF)</li>
            <li>Thai milk with crystal bubbles</li>
          </ul>

          <p>
            <em>Eileens Colossal Cookies</em>
          </p>
          <ul className="list-disc list-inside ml-6 mb-6">
            <li>Cookies</li>
            <li>“Gluten free” cookie cake</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Sunday</h3>
          <p>
            <strong>Breakfast:</strong> <em>McClains</em>
          </p>
          <ul className="list-disc list-inside ml-6 mb-6">
            <li>Pastry Box</li>
            <li>Very Berry Sunflower Toast</li>
            <li>Market Bowl (halal chicken, sausage, other options)</li>
            <li>Coffee Carafe</li>
          </ul>

          <aside className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg text-sm">
            ⚠️{" "}
            <strong>
              Please bring your own reusable water bottle to reduce waste!
            </strong>
          </aside>
        </SectionContainer>

        <SectionContainer id="venue" title="🗺️ Venue">
          <p className="mb-2">
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
            . Rooms for hacking, workshops, and other events are listed below. A
            map of LEEP2 can be found{" "}
            <a
              href="https://engr.ku.edu/m2sec-maps"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800 transition-colors"
            >
              here
            </a>
            .
          </p>
          <h3 className="text-xl font-medium mt-4 mb-2">Hacking Rooms</h3>
          <ul className="list-disc list-inside ml-6 mb-2">
            <li>
              <strong>Available for everyone:</strong> LEEP2: 2415, 2425;
              Learned: 1131, 1136, 2111, 2112, 2115, 2133, 3150, 3151, 3152,
              3153, 3154
            </li>
            <li>
              <strong>Themed rooms (for registered):</strong> LEEP2: 2324, 2326,
              2328
            </li>
            <li>
              <strong>Give away rooms:</strong> LEEP2: 2322 & 2320
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
              If you arrive before 5PM on Friday, park in the Allen Fieldhouse
              garage (first hour fee $1.75 + $1.50/hr until 5PM).
            </li>
            <li>
              If you arrive after 5PM, we recommend parking in Lots 41, 54, 72,
              or 90 for free, shown on KU’s{" "}
              <a
                href="https://parking.ku.edu/sites/parking/files/documents/parkingmap.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800 transition-colors"
              >
                parking map
              </a>
              .
            </li>
          </ul>
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

        <SectionContainer id="resources" title="📚 Resources">
          <p className="mb-2">
            📌{" "}
            <a
              href="https://drive.google.com/drive/folders/1XEw_IFyhPRxq8SnmnvyU6RsD3__itkr9"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800 transition-colors"
            >
              Intro to Git/GitHub/VCS
            </a>
          </p>
          <p>More information coming soon!</p>
        </SectionContainer>
      </main>
    </div>
  );
}
