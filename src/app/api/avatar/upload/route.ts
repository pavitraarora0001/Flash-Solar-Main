import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { uploadToBlob } from "@/lib/storage/blob";
import { validateUploadFile, checkUploadRateLimit } from "@/lib/storage/upload-security";

export const dynamic = "force-dynamic";

const ALLOWED_AVATAR_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ALLOWED_AVATAR_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2MB limit for user avatars
const AVATAR_RATE_LIMIT = 10; // Max 10 avatar updates
const AVATAR_RATE_WINDOW_MS = 10 * 60 * 1000; // 10-minute sliding window

/**
 * Direct file upload handler via Vercel Blob for user avatars.
 * Query param: ?filename=<name>
 * Body: Raw binary or Blob stream
 * Requirements: Authenticated session, image MIME, magic bytes, 2MB size cap, rate-limited.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Step 1: Authentication Guard
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "UNAUTHORIZED: Authentication is required to upload profile avatars." },
      { status: 401 }
    );
  }

  // Step 2: Rate Limiting Guard
  const rateLimitKey = `avatar:${session.userId}`;
  const rateCheck = checkUploadRateLimit(rateLimitKey, AVATAR_RATE_LIMIT, AVATAR_RATE_WINDOW_MS);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: "RATE_LIMIT_EXCEEDED: Too many avatar uploads. Please wait before updating your avatar again.",
        resetTimeMs: rateCheck.resetTimeMs,
      },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawFilename = searchParams.get("filename");

  if (!rawFilename) {
    return NextResponse.json(
      { error: "Filename parameter is required (?filename=avatar.png)" },
      { status: 400 }
    );
  }

  if (!request.body) {
    return NextResponse.json({ error: "No file payload body provided." }, { status: 400 });
  }

  try {
    const declaredMime = request.headers.get("content-type") || "image/png";
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ error: "Uploaded file is empty (0 bytes)." }, { status: 400 });
    }

    // Step 3: Security & Content Validation (MIME, magic bytes, size cap, extension)
    const validation = validateUploadFile(rawFilename, buffer, declaredMime, {
      maxSizeBytes: MAX_AVATAR_SIZE_BYTES,
      allowedMimeTypes: ALLOWED_AVATAR_MIMES,
      allowedExtensions: ALLOWED_AVATAR_EXTENSIONS,
    });

    if (!validation.valid || !validation.sanitizedFilename) {
      return NextResponse.json(
        { error: validation.error || "Avatar validation failed." },
        { status: 400 }
      );
    }

    // Secure target filename scoped to user ID
    const targetFilename = `avatar_${session.userId}_${Date.now()}${validation.extension}`;

    // Step 4: Upload via storage adapter
    const stored = await uploadToBlob(targetFilename, buffer, {
      folder: "avatars",
      contentType: declaredMime,
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: stored.url,
      downloadUrl: stored.downloadUrl || stored.url,
      pathname: stored.pathname,
      contentType: stored.contentType || declaredMime,
      size: buffer.length,
    });
  } catch (err: unknown) {
    console.error("[Avatar Upload] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
