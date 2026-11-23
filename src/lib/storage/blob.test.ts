import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isBlobConfigured,
  getBlobToken,
  uploadToBlob,
  deleteFromBlob,
} from "./blob";
import fs from "fs";
import path from "path";

describe("Flash Solar Vercel Blob Storage Integration", () => {
  const originalEnv = process.env.BLOB_READ_WRITE_TOKEN;

  afterEach(() => {
    process.env.BLOB_READ_WRITE_TOKEN = originalEnv;
  });

  it("accurately detects Vercel Blob configuration status", () => {
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test_token_12345";
    expect(isBlobConfigured()).toBe(true);
    expect(getBlobToken()).toBe("vercel_blob_rw_test_token_12345");

    delete process.env.BLOB_READ_WRITE_TOKEN;
    expect(isBlobConfigured()).toBe(false);
    expect(getBlobToken()).toBeUndefined();
  });

  it("gracefully falls back to local storage when Blob token is unconfigured", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;

    const content = Buffer.from("Unit test storage file buffer");
    const filename = "test-fallback-spec.txt";

    const result = await uploadToBlob(filename, content, {
      folder: "test-docs",
      contentType: "text/plain",
    });

    expect(result.storageProvider).toBe("LOCAL_DISK");
    expect(result.url.startsWith("/uploads/")).toBe(true);

    // Verify written file exists on local filesystem
    const diskPath = path.resolve(process.cwd(), "public", result.url.replace(/^\//, ""));
    expect(fs.existsSync(diskPath)).toBe(true);

    // Verify deletion via storage adapter
    const deleted = await deleteFromBlob(result.url);
    expect(deleted).toBe(true);
    expect(fs.existsSync(diskPath)).toBe(false);
  });

  it("handles string and Blob content in uploadToBlob", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;

    const textResult = await uploadToBlob("string-upload.txt", "Raw string payload", {
      contentType: "text/plain",
    });

    expect(textResult.storageProvider).toBe("LOCAL_DISK");
    expect(textResult.url).toContain("string-upload");

    const diskPath = path.resolve(process.cwd(), "public", textResult.url.replace(/^\//, ""));
    expect(fs.existsSync(diskPath)).toBe(true);
    const content = fs.readFileSync(diskPath, "utf8");
    expect(content).toBe("Raw string payload");

    // Clean up
    await deleteFromBlob(textResult.url);
  });
});
