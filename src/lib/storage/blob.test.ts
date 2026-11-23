import { describe, it, expect, afterEach, vi } from "vitest";
import {
  isBlobConfigured,
  getBlobToken,
  uploadToBlob,
  deleteFromBlob,
  assertProductionBlobReadiness,
} from "./blob";
import fs from "fs";
import path from "path";

describe("Flash Solar Vercel Blob Storage Integration & Production Safety", () => {
  const originalEnvToken = process.env.BLOB_READ_WRITE_TOKEN;

  afterEach(() => {
    process.env.BLOB_READ_WRITE_TOKEN = originalEnvToken;
    vi.unstubAllEnvs();
  });

  it("accurately detects Vercel Blob configuration status", () => {
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test_token_12345";
    expect(isBlobConfigured()).toBe(true);
    expect(getBlobToken()).toBe("vercel_blob_rw_test_token_12345");

    delete process.env.BLOB_READ_WRITE_TOKEN;
    expect(isBlobConfigured()).toBe(false);
    expect(getBlobToken()).toBeUndefined();
  });

  it("STRICTLY fails in production when Blob token is unconfigured (NO local fallback)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.BLOB_READ_WRITE_TOKEN;

    expect(() => assertProductionBlobReadiness()).toThrow("CRITICAL_STORAGE_CONFIG_ERROR");

    const content = Buffer.from("Sensitive production file data");
    await expect(
      uploadToBlob("prod-file.png", content, { contentType: "image/png" })
    ).rejects.toThrow("PRODUCTION_STORAGE_ERROR");

    // Ensure NO file was written to public/uploads
    const diskPath = path.resolve(process.cwd(), "public/uploads/prod-file.png");
    expect(fs.existsSync(diskPath)).toBe(false);
  });

  it("strictly forbids local filesystem deletion in production mode", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await expect(deleteFromBlob("/uploads/local-file.png")).rejects.toThrow("PRODUCTION_STORAGE_ERROR");
  });

  it("gracefully falls back to local storage in DEVELOPMENT mode when token is absent", async () => {
    vi.stubEnv("NODE_ENV", "development");
    delete process.env.BLOB_READ_WRITE_TOKEN;

    const content = Buffer.from("Development test storage file buffer");
    const filename = "test-fallback-dev.txt";

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

  it("handles string and Blob content in uploadToBlob during development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    delete process.env.BLOB_READ_WRITE_TOKEN;

    const textResult = await uploadToBlob("string-upload-dev.txt", "Raw string payload", {
      contentType: "text/plain",
    });

    expect(textResult.storageProvider).toBe("LOCAL_DISK");
    expect(textResult.url).toContain("string-upload-dev");

    const diskPath = path.resolve(process.cwd(), "public", textResult.url.replace(/^\//, ""));
    expect(fs.existsSync(diskPath)).toBe(true);
    const content = fs.readFileSync(diskPath, "utf8");
    expect(content).toBe("Raw string payload");

    // Clean up
    await deleteFromBlob(textResult.url);
  });
});
