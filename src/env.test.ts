import { describe, it, expect, vi } from "vitest";

// Mock server-only so tests can run in a non-Next.js bundler environment
vi.mock("server-only", () => ({}));

import { clientEnvSchema, serverEnvSchema, validateEnv } from "./env";
import { assertServerOnly } from "./lib/server-only";

describe("Environment Validation & Server Security", () => {
  it("should validate client default application url gracefully", () => {
    const parsed = clientEnvSchema.safeParse({
      NEXT_PUBLIC_APP_URL: "https://flashsolar.org",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.NEXT_PUBLIC_APP_URL).toBe("https://flashsolar.org");
    }
  });

  it("should reject invalid client application url", () => {
    const parsed = clientEnvSchema.safeParse({
      NEXT_PUBLIC_APP_URL: "not-a-valid-url",
    });
    expect(parsed.success).toBe(false);
  });

  it("should accept development server environment without production keys", () => {
    const parsed = serverEnvSchema.safeParse({
      NODE_ENV: "development",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.NODE_ENV).toBe("development");
    }
  });

  it("should execute validateEnv function without throwing in test environment", () => {
    const result = validateEnv();
    expect(result.isServer).toBe(true);
    expect(result.client.NEXT_PUBLIC_APP_URL).toBeDefined();
  });

  it("should enforce assertServerOnly in node environment without throwing", () => {
    expect(() => assertServerOnly()).not.toThrow();
  });
});


