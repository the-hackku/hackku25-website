import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  // Ensure filename is provided
  if (!filename) {
    return NextResponse.json(
      { error: "Filename is required" },
      { status: 400 }
    );
  }

  // Ensure request body is not null
  if (!request.body) {
    return NextResponse.json(
      { error: "File data is required" },
      { status: 400 }
    );
  }

  try {
    // Upload the blob
    const blob = await put(
      filename,
      request.body as ReadableStream<Uint8Array>,
      {
        access: "public",
      }
    );

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
