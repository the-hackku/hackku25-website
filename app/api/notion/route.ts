import { NextResponse } from "next/server";
import { NotionAPI } from "notion-client";

const notion = new NotionAPI();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
  }

  try {
    const recordMap = await notion.getPage(pageId);
    return NextResponse.json(recordMap);
  } catch (error) {
    console.error("Failed to fetch Notion page:", error);
    return NextResponse.json(
      { error: "Failed to fetch Notion page" },
      { status: 500 }
    );
  }
}
