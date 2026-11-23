import { describe, it, expect } from "vitest";
import {
  isExecutableOrDangerous,
  verifyMagicBytes,
  validateUploadFile,
  checkUploadRateLimit,
} from "./upload-security";

describe("Upload Security & Hardening Suite", () => {
  it("strictly detects and blocks dangerous or executable file extensions", () => {
    expect(isExecutableOrDangerous("shell.php")).toBe(true);
    expect(isExecutableOrDangerous("malware.exe")).toBe(true);
    expect(isExecutableOrDangerous("script.sh")).toBe(true);
    expect(isExecutableOrDangerous("exploit.bat")).toBe(true);
    expect(isExecutableOrDangerous("payload.js")).toBe(true);
    expect(isExecutableOrDangerous("backdoor.py")).toBe(true);
    expect(isExecutableOrDangerous("dangerous.html")).toBe(true);

    expect(isExecutableOrDangerous("solar-panel.jpg")).toBe(false);
    expect(isExecutableOrDangerous("datasheet.pdf")).toBe(false);
    expect(isExecutableOrDangerous("badge.png")).toBe(false);
    expect(isExecutableOrDangerous("diagram.svg")).toBe(false);
  });

  it("accurately verifies magic byte signatures and prevents MIME spoofing", () => {
    // Valid PNG signature: 89 50 4E 47
    const validPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(verifyMagicBytes(validPng, "image/png")).toBe(true);

    // Valid JPEG signature: FF D8 FF
    const validJpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    expect(verifyMagicBytes(validJpg, "image/jpeg")).toBe(true);

    // Valid PDF signature: %PDF
    const validPdf = Buffer.from("%PDF-1.7\nsample pdf header content");
    expect(verifyMagicBytes(validPdf, "application/pdf")).toBe(true);

    // Spoofed file: text content claiming to be PNG
    const fakePng = Buffer.from("<?php echo 'malicious script'; ?>");
    expect(verifyMagicBytes(fakePng, "image/png")).toBe(false);
    expect(verifyMagicBytes(fakePng, "image/jpeg")).toBe(false);
  });

  it("validates files against size, MIME, extension and sanitizes filenames", () => {
    const validBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]);

    // Valid upload
    const validResult = validateUploadFile(
      "../../traversal_photo.png",
      validBuffer,
      "image/png",
      {
        maxSizeBytes: 5 * 1024 * 1024,
        allowedMimeTypes: ["image/png", "image/jpeg"],
        allowedExtensions: [".png", ".jpg"],
      }
    );

    expect(validResult.valid).toBe(true);
    expect(validResult.sanitizedFilename).toBeDefined();
    expect(validResult.sanitizedFilename?.includes("..")).toBe(false);
    expect(validResult.sanitizedFilename?.startsWith("traversal_photo_")).toBe(true);

    // Disallowed extension
    const badExtResult = validateUploadFile(
      "bad.php",
      validBuffer,
      "image/png",
      {
        maxSizeBytes: 5 * 1024 * 1024,
        allowedMimeTypes: ["image/png"],
        allowedExtensions: [".png"],
      }
    );
    expect(badExtResult.valid).toBe(false);
    expect(badExtResult.error).toContain("Forbidden");

    // Oversized buffer
    const largeBuffer = Buffer.alloc(1024 * 1024 + 10);
    const oversizedResult = validateUploadFile(
      "large.png",
      largeBuffer,
      "image/png",
      {
        maxSizeBytes: 1024 * 1024,
        allowedMimeTypes: ["image/png"],
        allowedExtensions: [".png"],
      }
    );
    expect(oversizedResult.valid).toBe(false);
    expect(oversizedResult.error).toContain("exceeds maximum allowed limit");
  });

  it("enforces sliding-window rate limiting", () => {
    const key = `test_rate_user_${Date.now()}`;
    const limit = 3;
    const windowMs = 1000;

    expect(checkUploadRateLimit(key, limit, windowMs).allowed).toBe(true);
    expect(checkUploadRateLimit(key, limit, windowMs).allowed).toBe(true);
    expect(checkUploadRateLimit(key, limit, windowMs).allowed).toBe(true);

    // 4th call exceeds limit
    const blocked = checkUploadRateLimit(key, limit, windowMs);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetTimeMs).toBeGreaterThan(Date.now());
  });
});
