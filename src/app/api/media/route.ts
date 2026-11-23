import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import path from "path";
import { uploadToBlob, deleteFromBlob, isBlobConfigured } from "@/lib/storage/blob";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "video/mp4",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

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
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Content upload permissions required." }, { status: 403 });
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

    // MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: `Disallowed file type: ${file.type}. Allowed: JPG, PNG, WebP, SVG, PDF, MP4.`,
      }, { status: 400 });
    }

    // Size limit check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({
        success: false,
        error: `File size exceeds the 10MB limit (uploaded: ${(file.size / 1024 / 1024).toFixed(2)} MB).`,
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const sanitizedFilename = `${baseName}_${Date.now()}${ext.toLowerCase()}`;

    // Upload to Vercel Blob (with local fallback if offline)
    const stored = await uploadToBlob(sanitizedFilename, buffer, {
      folder: "media",
      contentType: file.type,
      access: "public",
      addRandomSuffix: true,
    });

    const newAsset = db.saveMediaAsset({
      id: `med_${Date.now()}`,
      filename: file.name,
      fileUrl: stored.url,
      mimeType: file.type,
      sizeBytes: file.size,
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

    return NextResponse.json({
      success: true,
      asset: newAsset,
      storageProvider: stored.storageProvider,
    });
  } catch (err: unknown) {
    console.error("Media upload error:", err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Internal server upload failure",
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== Role.SUPER_ADMIN && session.role !== Role.ADMIN)) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Super Admin or Admin role required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Asset ID is required" }, { status: 400 });
    }

    const asset = db.getMediaAssets().find((a) => a.id === id);
    if (asset) {
      // Remove from Vercel Blob or local storage
      await deleteFromBlob(asset.fileUrl);
      db.deleteMediaAsset(id);

      db.addAuditLog({
        userId: session.userId,
        userName: session.name,
        action: "MEDIA_DELETED",
        entityType: "MediaAsset",
        entityId: id,
        metadata: { filename: asset.filename, fileUrl: asset.fileUrl },
      });
    }

    return NextResponse.json({ success: true, message: "Asset removed successfully." });
  } catch (err: unknown) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete asset",
    }, { status: 500 });
  }
}
