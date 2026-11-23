import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getBlobToken } from "@/lib/storage/blob";

export const dynamic = "force-dynamic";

/**
 * Direct file upload handler via Vercel Blob.
 * Query param: ?filename=<name>
 * Body: Raw binary or Blob stream
 */
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Filename parameter is required (?filename=...)" }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: "No file body provided" }, { status: 400 });
  }

  try {
    const token = getBlobToken();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

    const blob = await put(`avatars/${cleanFilename}`, request.body, {
      access: "public",
      token,
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (err: unknown) {
    console.error("[Avatar Upload] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
