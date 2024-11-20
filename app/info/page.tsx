"use client";

import { useEffect, useState } from "react";
import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";

import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

import Image from "next/image";

const Page = () => {
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/notion?pageId=a878deccbb114cb6846253137c85ee74`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Notion page data.");
        }
        const data = await response.json();
        setRecordMap(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch Notion page. Please try again later.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!recordMap) {
    return <div></div>;
  }

  return (
    <div>
      <NotionRenderer
        recordMap={recordMap}
        darkMode={false}
        components={{
          nextImage: Image,
        }}
        className="mx-auto max-w-[800px] px-4 notion-custom"
      />
    </div>
  );
};

export default Page;
