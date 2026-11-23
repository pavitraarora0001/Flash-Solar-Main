import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "./password";
import {
  signSessionPayload,
  verifySessionToken,
  hasPermission,
  ROLE_HIERARCHY,
} from "./session";
import { Role } from "@prisma/client";

describe("Flash Solar Authentication & Session Security", () => {
  it("correctly hashes and verifies passwords using bcryptjs", async () => {
    const raw = "SecureRandomTestPassword2026!#";
    const hash = await hashPassword(raw);

    expect(hash).not.toBe(raw);
    expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);

    const matches = await comparePassword(raw, hash);
    expect(matches).toBe(true);

    const wrong = await comparePassword("WrongPassword123", hash);
    expect(wrong).toBe(false);
  });

  it("signs and verifies tamper-evident HMAC session tokens", () => {
    const payload = {
      userId: "usr_admin_test",
      email: "test@flashsolar.org",
      name: "Test Admin",
      role: Role.ADMIN,
    };

    const token = signSessionPayload(payload);
    expect(typeof token).toBe("string");
    expect(token.includes(".")).toBe(true);

    const decoded = verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe("usr_admin_test");
    expect(decoded?.email).toBe("test@flashsolar.org");
    expect(decoded?.role).toBe(Role.ADMIN);

    // Tampered token rejection
    const tampered = token.slice(0, -4) + "abcd";
    const invalid = verifySessionToken(tampered);
    expect(invalid).toBeNull();
  });

  it("enforces strict role-based access control (RBAC)", () => {
    expect(ROLE_HIERARCHY.SUPER_ADMIN).toBeGreaterThan(ROLE_HIERARCHY.ADMIN);
    expect(ROLE_HIERARCHY.ADMIN).toBeGreaterThan(ROLE_HIERARCHY.CONTENT_MANAGER);
    expect(ROLE_HIERARCHY.CONTENT_MANAGER).toBeGreaterThan(ROLE_HIERARCHY.SALES_MANAGER);
    expect(ROLE_HIERARCHY.SALES_MANAGER).toBeGreaterThan(ROLE_HIERARCHY.VIEWER);

    // SUPER_ADMIN can perform actions requiring VIEWER or ADMIN
    expect(hasPermission(Role.SUPER_ADMIN, Role.ADMIN)).toBe(true);
    expect(hasPermission(Role.SUPER_ADMIN, Role.VIEWER)).toBe(true);

    // SALES_MANAGER cannot perform actions requiring ADMIN
    expect(hasPermission(Role.SALES_MANAGER, Role.ADMIN)).toBe(false);

    // VIEWER cannot perform actions requiring SALES_MANAGER
    expect(hasPermission(Role.VIEWER, Role.SALES_MANAGER)).toBe(false);
  });
});
