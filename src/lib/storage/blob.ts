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
 * Uploads a file buffer, string, or stream to Vercel Blob with automatic local fallback.
 */
export async function uploadToBlob(
  filename: string,
  body: Buffer | ArrayBuffer | ReadableStream | Blob | string,
  options?: BlobUploadOptions
): Promise<StoredBlobResult> {
  const token = getBlobToken();
  const folder = options?.folder ? `${options.folder.replace(/^\/+|\/+$/g, "")}/` : "";
  const targetPath = `${folder}${filename.replace(/^\/+/, "")}`;

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
    } catch (err) {
      console.error("[Storage] Vercel Blob upload failed, attempting local fallback:", err);
    }
  }

  // Local disk storage fallback (offline development or unconfigured token)
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
 */
export async function deleteFromBlob(urlOrPathname: string): Promise<boolean> {
  const token = getBlobToken();

  if (urlOrPathname.startsWith("http") && token) {
    try {
      await del(urlOrPathname, { token });
      return true;
    } catch (err) {
      console.error("[Storage] Failed to delete blob from Vercel storage:", err);
      return false;
    }
  }

  if (urlOrPathname.startsWith("/uploads/")) {
    try {
      const localPath = path.resolve(process.cwd(), `public${urlOrPathname}`);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      return true;
    } catch (err) {
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
  const token = getBlobToken();
  if (!token) return null;

  try {
    return await list({
      token,
      prefix: options?.prefix,
      limit: options?.limit || 50,
    });
  } catch (err) {
    console.error("[Storage] Failed to list Vercel blobs:", err);
    return null;
  }
}
