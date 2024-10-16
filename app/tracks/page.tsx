"use client";

import React from "react";
import Link from "next/link";

const TracksPage = () => {
  const tracks = [
    {
      id: 1,
      name: "Web Development",
      description: "Build amazing websites using the latest technologies.",
    },
    {
      id: 2,
      name: "Machine Learning",
      description:
        "Dive into artificial intelligence and learn to build models.",
    },
    {
      id: 3,
      name: "Mobile Apps",
      description: "Create mobile experiences with cross-platform frameworks.",
    },
    {
      id: 4,
      name: "Game Development",
      description: "Develop fun games and explore interactive storytelling.",
    },
    {
      id: 5,
      name: "Cybersecurity",
      description: "Learn the essentials of protecting systems and data.",
    },
    {
      id: 6,
      name: "Data Science",
      description: "Analyze data and extract insights using powerful tools.",
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold mb-6">Event Tracks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="border p-4 rounded-lg bg-white text-black"
          >
            <h2 className="text-lg font-bold">{track.name}</h2>
            <p>{track.description}</p>
            <Link href={`/tracks/${track.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TracksPage;
