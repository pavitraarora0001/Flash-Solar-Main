import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { uploadToBlob, deleteFromBlob, isBlobConfigured } from "@/lib/storage/blob";
import { validateUploadFile, checkUploadRateLimit } from "@/lib/storage/upload-security";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "video/mp4",
];

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
  ".pdf",
  ".mp4",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit
const RATE_LIMIT_COUNT = 30; // Max 30 uploads per window
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5-minute sliding window

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const assets = db.getMediaAssets(category || undefined);
  return NextResponse.json({
    success: true,
    assets,
    storageEngine: isBlobConfigured() ? "VERCEL_BLOB" : "LOCAL_DISK",
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === Role.VIEWER) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED: Content upload permissions required." },
      { status: 403 }
    );
  }

  // Rate Limiting
  const rateLimitKey = `media:${session.userId}`;
  const rateCheck = checkUploadRateLimit(rateLimitKey, RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW_MS);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "RATE_LIMIT_EXCEEDED: Too many uploads. Please wait before submitting additional files.",
        resetTimeMs: rateCheck.resetTimeMs,
      },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "General";
    const altText = (formData.get("altText") as string) || "";
    const caption = (formData.get("caption") as string) || "";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file was uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Comprehensive security, extension, MIME, magic-bytes, and size validation
    const validation = validateUploadFile(file.name, buffer, file.type, {
      maxSizeBytes: MAX_FILE_SIZE_BYTES,
      allowedMimeTypes: ALLOWED_MIME_TYPES,
      allowedExtensions: ALLOWED_EXTENSIONS,
    });

    if (!validation.valid || !validation.sanitizedFilename) {
      return NextResponse.json(
        { success: false, error: validation.error || "File validation failed." },
        { status: 400 }
      );
    }

    // Step 1: Upload to Vercel Blob (or dev fallback)
    const stored = await uploadToBlob(validation.sanitizedFilename, buffer, {
      folder: "media",
      contentType: file.type,
      access: "public",
      addRandomSuffix: true,
    });

    // Step 2: Persist metadata with orphan protection
    let newAsset;
    try {
      newAsset = db.saveMediaAsset({
        id: `med_${Date.now()}`,
        filename: file.name,
        fileUrl: stored.url,
        mimeType: file.type,
        sizeBytes: buffer.length,
        category,
        altText: altText || file.name,
        caption: caption || undefined,
        createdAt: new Date().toISOString(),
      });

      db.addAuditLog({
        userId: session.userId,
        userName: session.name,
        action: "MEDIA_UPLOADED",
        entityType: "MediaAsset",
        entityId: newAsset.id,
        metadata: {
          filename: newAsset.filename,
          fileUrl: newAsset.fileUrl,
          sizeBytes: newAsset.sizeBytes,
          provider: stored.storageProvider,
        },
      });
    } catch (dbErr: unknown) {
      console.error("[Storage] Database persistence failed, cleaning up uploaded blob:", dbErr);
      // Orphan prevention: delete the uploaded blob if database write fails
      try {
        await deleteFromBlob(stored.url);
      } catch (cleanErr) {
        console.error("[Storage] Failed to cleanup orphaned blob:", cleanErr);
      }
      throw new Error(
        `DATABASE_PERSISTENCE_ERROR: Failed to save media asset metadata: ${
          dbErr instanceof Error ? dbErr.message : String(dbErr)
        }`
      );
    }

    return NextResponse.json({
      success: true,
      asset: newAsset,
      storageProvider: stored.storageProvider,
    });
  } catch (err: unknown) {
    console.error("Media upload error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal server upload failure",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== Role.SUPER_ADMIN && session.role !== Role.ADMIN)) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED: Super Admin or Admin role required." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Asset ID is required" }, { status: 400 });
    }

    const asset = db.getMediaAssets().find((a) => a.id === id);
    if (!asset) {
      return NextResponse.json({ success: false, error: "Asset not found" }, { status: 404 });
    }

    // Step 1: Delete remote blob or local file
    try {
      await deleteFromBlob(asset.fileUrl);
    } catch (storageErr: unknown) {
      console.error("[Storage] Blob deletion failed:", storageErr);
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            success: false,
            error: `STORAGE_DELETION_FAILED: Failed to remove remote blob: ${
              storageErr instanceof Error ? storageErr.message : String(storageErr)
            }`,
          },
          { status: 502 }
        );
      }
    }

    // Step 2: Remove database record and create audit log
    db.deleteMediaAsset(id);

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "MEDIA_DELETED",
      entityType: "MediaAsset",
      entityId: id,
      metadata: { filename: asset.filename, fileUrl: asset.fileUrl },
    });

    return NextResponse.json({ success: true, message: "Asset removed successfully." });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete asset",
      },
      { status: 500 }
    );
  }
}
