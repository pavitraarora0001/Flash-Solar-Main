import path from "path";

/**
 * High-risk executable or dangerous file extensions explicitly blocked.
 */
const FORBIDDEN_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".sh", ".bash", ".zsh",
  ".php", ".phtml", ".php3", ".php4", ".php5", ".phps",
  ".js", ".mjs", ".cjs", ".ts", ".jsx", ".tsx",
  ".py", ".pyc", ".pl", ".cgi",
  ".scr", ".vbs", ".vbe", ".wsf", ".ps1", ".ps2",
  ".jar", ".war", ".ear",
  ".asp", ".aspx", ".cer", ".csr", ".jsp",
  ".htm", ".html", ".xhtml", ".shtml",
  ".bin", ".elf", ".iso", ".img", ".dmg", ".apk",
]);

/**
 * Checks whether a given filename has a forbidden or executable extension.
 */
export function isExecutableOrDangerous(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return FORBIDDEN_EXTENSIONS.has(ext);
}

/**
 * Checks magic byte signatures for allowed file types to prevent MIME spoofing.
 */
export function verifyMagicBytes(buffer: Buffer, declaredMimeType: string): boolean {
  if (buffer.length < 4) return false;

  const mime = declaredMimeType.toLowerCase().trim();

  // JPEG: FF D8 FF
  if (mime === "image/jpeg" || mime === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47
  if (mime === "image/png") {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }

  // WebP: RIFF ... WEBP
  if (mime === "image/webp") {
    if (buffer.length < 12) return false;
    const riff = buffer.subarray(0, 4).toString("ascii");
    const webp = buffer.subarray(8, 12).toString("ascii");
    return riff === "RIFF" && webp === "WEBP";
  }

  // PDF: %PDF
  if (mime === "application/pdf") {
    return buffer.subarray(0, 4).toString("ascii") === "%PDF";
  }

  // SVG: <?xml or <svg
  if (mime === "image/svg+xml") {
    const head = buffer.subarray(0, Math.min(buffer.length, 512)).toString("utf8").toLowerCase().trim();
    return head.includes("<svg") || head.includes("<?xml");
  }

  // MP4: ... ftyp
  if (mime === "video/mp4") {
    if (buffer.length < 12) return false;
    return buffer.subarray(4, 8).toString("ascii") === "ftyp";
  }

  return false;
}

export interface FileValidationOptions {
  maxSizeBytes: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
  extension?: string;
}

/**
 * Validates a file against allowed extensions, MIME types, magic bytes, size limits, and sanitizes its filename.
 */
export function validateUploadFile(
  filename: string,
  buffer: Buffer,
  declaredMimeType: string,
  options: FileValidationOptions
): FileValidationResult {
  // Prevent path traversal
  const basename = path.basename(filename);
  const ext = path.extname(basename).toLowerCase();

  if (!ext) {
    return { valid: false, error: "File must have a valid extension." };
  }

  if (isExecutableOrDangerous(basename)) {
    return { valid: false, error: `Forbidden executable or script file extension: "${ext}".` };
  }

  if (!options.allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `File extension "${ext}" is not allowed. Allowed extensions: ${options.allowedExtensions.join(", ")}.`,
    };
  }

  const mime = declaredMimeType.toLowerCase().trim();
  if (!options.allowedMimeTypes.includes(mime)) {
    return {
      valid: false,
      error: `MIME type "${mime}" is not allowed. Allowed types: ${options.allowedMimeTypes.join(", ")}.`,
    };
  }

  if (buffer.length > options.maxSizeBytes) {
    const maxMb = (options.maxSizeBytes / (1024 * 1024)).toFixed(1);
    const actualMb = (buffer.length / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${actualMb} MB) exceeds maximum allowed limit of ${maxMb} MB.`,
    };
  }

  if (!verifyMagicBytes(buffer, mime)) {
    return {
      valid: false,
      error: `File signature does not match declared MIME type "${mime}". Potential file spoofing detected.`,
    };
  }

  // Sanitize filename base to alphanumeric + underscore/hyphen
  const nameWithoutExt = path.basename(basename, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  const sanitizedFilename = `${nameWithoutExt || "asset"}_${Date.now()}${ext}`;

  return {
    valid: true,
    sanitizedFilename,
    extension: ext,
  };
}

// -----------------------------------------------------------------------------
// In-Memory Sliding Window Rate Limiter
// -----------------------------------------------------------------------------
interface RateLimitBucket {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitBucket>();

// Sweep stale buckets periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateLimitStore.entries()) {
      bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < 15 * 60 * 1000);
      if (bucket.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 1000).unref();
}

/**
 * Checks whether an action exceeds the rate limit for a given identifier key.
 */
export function checkUploadRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTimeMs: number } {
  const now = Date.now();
  let bucket = rateLimitStore.get(key);

  if (!bucket) {
    bucket = { timestamps: [] };
    rateLimitStore.set(key, bucket);
  }

  // Filter timestamps within the current sliding window
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const resetTimeMs = oldest + windowMs;
    return {
      allowed: false,
      remaining: 0,
      resetTimeMs,
    };
  }

  bucket.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - bucket.timestamps.length,
    resetTimeMs: now + windowMs,
  };
}
