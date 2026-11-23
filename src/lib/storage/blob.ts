import { put, del, list, type PutBlobResult, type ListBlobResult } from "@vercel/blob";
import fs from "fs";
import path from "path";

/**
 * Retrieves the active Vercel Blob read-write token from the environment.
 */
export function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

/**
 * Indicates whether Vercel Blob remote object storage is configured and active.
 */
export function isBlobConfigured(): boolean {
  return !!getBlobToken();
}

/**
 * Validates production runtime readiness for Vercel Blob.
 * In production, local filesystem fallback is strictly forbidden.
 */
export function assertProductionBlobReadiness(): void {
  if (process.env.NODE_ENV === "production" && !isBlobConfigured()) {
    throw new Error(
      "CRITICAL_STORAGE_CONFIG_ERROR: BLOB_READ_WRITE_TOKEN is not configured in production environment. Local filesystem fallback is disabled in production."
    );
  }
}

export interface BlobUploadOptions {
  access?: "public";
  contentType?: string;
  addRandomSuffix?: boolean;
  folder?: string;
}

export interface StoredBlobResult {
  url: string;
  downloadUrl?: string;
  pathname: string;
  contentType?: string;
  sizeBytes?: number;
  storageProvider: "VERCEL_BLOB" | "LOCAL_DISK";
}

/**
 * Uploads a file buffer, string, or stream to Vercel Blob.
 * In production: Strictly requires Vercel Blob and fails safely without local fallback.
 * In development: Gracefully falls back to local disk storage if token is unconfigured.
 */
export async function uploadToBlob(
  filename: string,
  body: Buffer | ArrayBuffer | ReadableStream | Blob | string,
  options?: BlobUploadOptions
): Promise<StoredBlobResult> {
  const isProduction = process.env.NODE_ENV === "production";
  const token = getBlobToken();
  const folder = options?.folder ? `${options.folder.replace(/^\/+|\/+$/g, "")}/` : "";
  const targetPath = `${folder}${filename.replace(/^\/+/, "")}`;

  // Production requirement check
  if (isProduction && !token) {
    throw new Error(
      "PRODUCTION_STORAGE_ERROR: BLOB_READ_WRITE_TOKEN is missing in production environment. Local filesystem fallback is disabled in production."
    );
  }

  if (token) {
    try {
      const blob: PutBlobResult = await put(targetPath, body, {
        access: options?.access || "public",
        token,
        contentType: options?.contentType,
        addRandomSuffix: options?.addRandomSuffix ?? true,
      });

      return {
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        pathname: blob.pathname,
        contentType: blob.contentType,
        storageProvider: "VERCEL_BLOB",
      };
    } catch (err: unknown) {
      console.error("[Storage] Vercel Blob upload failed:", err);
      if (isProduction) {
        throw new Error(
          `PRODUCTION_STORAGE_ERROR: Failed to upload asset to Vercel Blob: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
      console.warn("[Storage DEV Fallback] Attempting local disk fallback in development mode...");
    }
  }

  // Local disk storage fallback (ONLY allowed in non-production environments)
  if (isProduction) {
    throw new Error("PRODUCTION_STORAGE_ERROR: Local disk fallback reached unexpectedly in production mode.");
  }

  const ext = path.extname(filename) || ".jpg";
  const base = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniqueFilename = `${base}_${Date.now()}${ext.toLowerCase()}`;
  const uploadDir = path.resolve(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, uniqueFilename);
  const buffer = Buffer.isBuffer(body)
    ? body
    : body instanceof ArrayBuffer
    ? Buffer.from(body)
    : typeof body === "string"
    ? Buffer.from(body)
    : Buffer.from(await (body as Blob).arrayBuffer());

  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${uniqueFilename}`,
    pathname: uniqueFilename,
    contentType: options?.contentType,
    sizeBytes: buffer.length,
    storageProvider: "LOCAL_DISK",
  };
}

/**
 * Deletes a stored asset from Vercel Blob or local disk.
 * In production: Strictly rejects local disk paths and fails safely if remote deletion fails.
 */
export async function deleteFromBlob(urlOrPathname: string): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === "production";
  const token = getBlobToken();

  if (urlOrPathname.startsWith("http")) {
    if (!token) {
      if (isProduction) {
        throw new Error("PRODUCTION_STORAGE_ERROR: Cannot delete remote blob: BLOB_READ_WRITE_TOKEN is missing in production.");
      }
      return false;
    }

    try {
      await del(urlOrPathname, { token });
      return true;
    } catch (err: unknown) {
      console.error("[Storage] Failed to delete blob from Vercel storage:", err);
      if (isProduction) {
        throw new Error(
          `PRODUCTION_STORAGE_ERROR: Failed to delete remote blob from Vercel storage: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
      return false;
    }
  }

  if (urlOrPathname.startsWith("/uploads/")) {
    if (isProduction) {
      throw new Error("PRODUCTION_STORAGE_ERROR: Local filesystem paths (/uploads/) are forbidden in production.");
    }
    try {
      const localPath = path.resolve(process.cwd(), `public${urlOrPathname}`);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      return true;
    } catch (err: unknown) {
      console.error("[Storage] Failed to delete local file:", err);
      return false;
    }
  }

  return false;
}

/**
 * Lists blobs in the Vercel Blob store.
 */
export async function listStoredBlobs(options?: {
  prefix?: string;
  limit?: number;
}): Promise<ListBlobResult | null> {
  const isProduction = process.env.NODE_ENV === "production";
  const token = getBlobToken();

  if (!token) {
    if (isProduction) {
      throw new Error("PRODUCTION_STORAGE_ERROR: BLOB_READ_WRITE_TOKEN is required to list stored blobs in production.");
    }
    return null;
  }

  try {
    return await list({
      token,
      prefix: options?.prefix,
      limit: options?.limit || 50,
    });
  } catch (err: unknown) {
    console.error("[Storage] Failed to list Vercel blobs:", err);
    if (isProduction) {
      throw new Error(
        `PRODUCTION_STORAGE_ERROR: Failed to list Vercel blobs: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
    return null;
  }
}
