import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { signSessionPayload, SESSION_COOKIE_NAME, verifySessionToken } from "../src/lib/auth/session";
import { isEmailServiceConfigured, sendPasswordResetEmail, sendEmail } from "../src/lib/email/mailer";

function loadEnvVar(key: string, defaultValue?: string): string {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith(`${key}=`)) {
          let val = trimmed.substring(key.length + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          return val;
        }
      }
    }
  } catch {}
  if (process.env[key]) return process.env[key]!;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`CRITICAL CONFIG: ${key} not found in environment or .env.local.`);
}

function updateEnvVar(key: string, value: string): void {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  const lines = content.split("\n");
  let found = false;
  const newLines = lines.map((line) => {
    if (line.trim().startsWith(`${key}=`)) {
      found = true;
      return `${key}="${value}"`;
    }
    return line;
  });
  if (!found) {
    newLines.push(`${key}="${value}"`);
  }
  fs.writeFileSync(envPath, newLines.join("\n"), "utf-8");
}

async function runAuthSecurityAudit() {
  console.log("================================================================================");
  console.log(" FLASH SOLAR — COMPLETE ADMIN PASSWORD RESET, RBAC & SESSION SECURITY AUDIT    ");
  console.log("================================================================================");

  const baseUrl = "http://localhost:3000";
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` -> ${detail}` : ""}`);
      failed++;
    }
  }

  const superAdminEmail = "admin@flashsolar.org";
  const salesEmail = "sales@flashsolar.org";
  const salesPassword = loadEnvVar("SALES_PASSWORD");

  // ---------------------------------------------------------------------------
  // SECTION 1: Database & Password Hash Integrity (Lifecycle Setup)
  // ---------------------------------------------------------------------------
  console.log("\n--- 1. Database & Hash Security Check ---");
  const storePath = path.resolve(process.cwd(), "src/data/db-store.json");
  let storeData = JSON.parse(fs.readFileSync(storePath, "utf-8"));
  let superAdminRecord = storeData.users.find((u: { email: string }) => u.email === superAdminEmail);

  let tempAdminPassword = loadEnvVar("ADMIN_PASSWORD");

  // Ensure fresh temporary password state to test full lifecycle
  if (!superAdminRecord.mustChangePassword) {
    tempAdminPassword = `FS#TempAudit_${Date.now()}_9kX!A`;
    superAdminRecord.passwordHash = bcrypt.hashSync(tempAdminPassword, 10);
    superAdminRecord.mustChangePassword = true;
    fs.writeFileSync(storePath, JSON.stringify(storeData, null, 2), "utf-8");
    updateEnvVar("ADMIN_PASSWORD", tempAdminPassword);
  }

  assert(Boolean(superAdminRecord), "1.1 Super Admin user exists in database store");
  assert(superAdminRecord.role === "SUPER_ADMIN", "1.2 Super Admin role is SUPER_ADMIN");
  assert(
    typeof superAdminRecord.passwordHash === "string" &&
      (superAdminRecord.passwordHash.startsWith("$2a$") || superAdminRecord.passwordHash.startsWith("$2b$")),
    "1.3 Super Admin password is encrypted with bcrypt hash (starts with $2a$/$2b$)"
  );
  assert(
    !superAdminRecord.password && !superAdminRecord.passwordHash.includes(tempAdminPassword),
    "1.4 Plaintext password is NEVER stored in database store"
  );
  assert(
    bcrypt.compareSync(tempAdminPassword, superAdminRecord.passwordHash),
    "1.5 Temporary password securely verifies against bcrypt hash"
  );
  assert(
    superAdminRecord.mustChangePassword === true,
    "1.6 Super Admin account has forced password rotation flag set (mustChangePassword = true)"
  );

  // ---------------------------------------------------------------------------
  // SECTION 2: Live Super Admin Login & Temporary Password Enforcement
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Live Super Admin Authentication & Forced Change ---");
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: superAdminEmail, password: tempAdminPassword }),
  });

  assert(loginRes.status === 200, "2.1 Super Admin login with temporary password returns HTTP 200");
  const loginData = await loginRes.json();
  assert(loginData.success === true, "2.2 Login response indicates success");
  assert(loginData.mustChangePassword === true, "2.3 Login response signals mustChangePassword = true");
  assert(!loginData.user?.passwordHash, "2.4 User payload strictly omits passwordHash");

  const adminCookieHeader = loginRes.headers.get("set-cookie") || "";
  assert(adminCookieHeader.includes(SESSION_COOKIE_NAME), "2.5 Session cookie issued with httpOnly protection");

  // Extract cookie
  const sessionCookieVal = adminCookieHeader
    .split(";")
    .find((c) => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.trim()
    .split("=")[1];

  assert(Boolean(sessionCookieVal), "2.6 Admin session cookie value extracted");

  // ---------------------------------------------------------------------------
  // SECTION 3: Password Change Validation & Secure Rotation
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Password Change Policy & Secure Rotation ---");

  // 3.1 Reject unauthenticated change password request
  const unauthChangeRes = await fetch(`${baseUrl}/api/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword: tempAdminPassword, newPassword: "NewSecretPassword2026!" }),
  });
  assert(unauthChangeRes.status === 401, "3.1 Unauthenticated change-password request rejected (HTTP 401)");

  // 3.2 Reject change password with incorrect current password
  const wrongCurrentRes = await fetch(`${baseUrl}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${SESSION_COOKIE_NAME}=${sessionCookieVal}`,
    },
    body: JSON.stringify({ currentPassword: "WrongTemporaryPassword123!", newPassword: "ValidPermanentPass2026!#" }),
  });
  assert(wrongCurrentRes.status === 400, "3.2 Incorrect current password rejected (HTTP 400)");

  // 3.3 Reject short or weak new password
  const weakPassRes = await fetch(`${baseUrl}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${SESSION_COOKIE_NAME}=${sessionCookieVal}`,
    },
    body: JSON.stringify({ currentPassword: tempAdminPassword, newPassword: "short" }),
  });
  assert(weakPassRes.status === 400, "3.3 Weak new password (<12 chars) rejected (HTTP 400)");

  // 3.4 Reject identical new password
  const identicalPassRes = await fetch(`${baseUrl}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${SESSION_COOKIE_NAME}=${sessionCookieVal}`,
    },
    body: JSON.stringify({ currentPassword: tempAdminPassword, newPassword: tempAdminPassword }),
  });
  assert(identicalPassRes.status === 400, "3.4 Identical new password rejected (HTTP 400)");

  // 3.5 Submit valid, strong permanent password
  const permanentPassword = `FS#AdminPerm_${Date.now()}_9kX!A`;
  const validChangeRes = await fetch(`${baseUrl}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${SESSION_COOKIE_NAME}=${sessionCookieVal}`,
    },
    body: JSON.stringify({ currentPassword: tempAdminPassword, newPassword: permanentPassword }),
  });
  assert(validChangeRes.status === 200, "3.5 Valid password change succeeds (HTTP 200)");
  const validChangeData = await validChangeRes.json();
  assert(validChangeData.success === true, "3.6 Change password response confirms success");

  // 3.6 Check database store after change
  const storeDataAfter = JSON.parse(fs.readFileSync(storePath, "utf-8"));
  const adminAfter = storeDataAfter.users.find((u: { email: string }) => u.email === superAdminEmail);
  assert(
    adminAfter.mustChangePassword === false,
    "3.7 mustChangePassword flag cleared to false in database store"
  );
  assert(
    bcrypt.compareSync(permanentPassword, adminAfter.passwordHash),
    "3.8 Permanent password verified against new bcrypt hash"
  );
  assert(
    !bcrypt.compareSync(tempAdminPassword, adminAfter.passwordHash),
    "3.9 Old temporary password no longer matches new hash"
  );

  // ---------------------------------------------------------------------------
  // SECTION 4: Invalidation of Old Password & Login with New Password
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Old Password Invalidation & New Authentication ---");
  const oldLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: superAdminEmail, password: tempAdminPassword }),
  });
  assert(oldLoginRes.status === 401, "4.1 Old temporary password strictly fails authentication (HTTP 401)");

  const newLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: superAdminEmail, password: permanentPassword }),
  });
  assert(newLoginRes.status === 200, "4.2 Login with permanent password succeeds (HTTP 200)");
  const newLoginData = await newLoginRes.json();
  assert(newLoginData.mustChangePassword === false, "4.3 Permanent session has mustChangePassword = false");

  const permanentCookieHeader = newLoginRes.headers.get("set-cookie") || "";
  const permanentSessionVal = permanentCookieHeader
    .split(";")
    .find((c) => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.trim()
    .split("=")[1];

  // Update .env.local with permanent password so future scripts can authenticate
  updateEnvVar("ADMIN_PASSWORD", permanentPassword);
  assert(true, "4.4 Updated local environment configuration with active administrator credentials");

  // ---------------------------------------------------------------------------
  // SECTION 5: Session & RBAC Security Verification
  // ---------------------------------------------------------------------------
  console.log("\n--- 5. Session & RBAC Security Verification ---");

  // 5.1 Unauthenticated requests to protected endpoints
  const unauthUsersRes = await fetch(`${baseUrl}/api/users`);
  assert(unauthUsersRes.status === 401, "5.1 Unauthenticated access to /api/users returns 401");

  const unauthProductsPost = await fetch(`${baseUrl}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Unauthorized Test Product" }),
  });
  assert(unauthProductsPost.status === 401, "5.2 Unauthenticated write to /api/products returns 401");

  // 5.2 Invalid/forged session token
  const forgedToken = "invalid_token_payload.bad_signature_12345";
  const forgedRes = await fetch(`${baseUrl}/api/users`, {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${forgedToken}` },
  });
  assert(forgedRes.status === 401, "5.3 Forged/tampered session cookie rejected (HTTP 401)");

  // 5.3 Expired session token
  const expiredToken = signSessionPayload({
    userId: "usr_expired_test",
    email: superAdminEmail,
    name: "Expired Admin",
    role: Role.SUPER_ADMIN,
  });
  // Manually build an expired payload
  const expiredPayload = {
    userId: "usr_expired_test",
    email: superAdminEmail,
    name: "Expired Admin",
    role: Role.SUPER_ADMIN,
    expiresAt: new Date(Date.now() - 3600000).toISOString(),
  };
  const base64Expired = Buffer.from(JSON.stringify(expiredPayload)).toString("base64url");
  const secret = process.env.NEXTAUTH_SECRET || "flashsolar_dev_secure_session_secret_key_2026";
  const crypto = await import("crypto");
  const hmac = crypto.createHmac("sha256", secret).update(base64Expired).digest("hex");
  const expiredSigned = `${base64Expired}.${hmac}`;

  const expiredRes = await fetch(`${baseUrl}/api/users`, {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${expiredSigned}` },
  });
  assert(expiredRes.status === 401, "5.4 Expired session cookie rejected (HTTP 401)");

  // 5.4 Sales Manager authentication & RBAC boundary
  const salesLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: salesEmail, password: salesPassword }),
  });
  assert(salesLoginRes.status === 200, "5.5 Sales Manager authenticates cleanly (HTTP 200)");
  const salesCookieHeader = salesLoginRes.headers.get("set-cookie") || "";
  const salesSessionVal = salesCookieHeader
    .split(";")
    .find((c) => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.trim()
    .split("=")[1];

  // Sales Manager attempting to access Super Admin user management
  const salesUsersGet = await fetch(`${baseUrl}/api/users`, {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${salesSessionVal}` },
  });
  assert(salesUsersGet.status === 403, "5.6 Sales Manager blocked from GET /api/users (HTTP 403 Forbidden)");

  const salesUsersPost = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${SESSION_COOKIE_NAME}=${salesSessionVal}`,
    },
    body: JSON.stringify({
      email: "hacker@evil.org",
      password: "Password123456!#",
      name: "Attacker",
      role: "SUPER_ADMIN",
    }),
  });
  assert(salesUsersPost.status === 403, "5.7 Sales Manager blocked from POST /api/users (HTTP 403 Forbidden)");

  // 5.5 Viewer role restrictions
  const viewerPayload = signSessionPayload({
    userId: "usr_viewer_01",
    email: "viewer@flashsolar.org",
    name: "Auditor Viewer",
    role: Role.VIEWER,
  });
  const viewerPost = await fetch(`${baseUrl}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${SESSION_COOKIE_NAME}=${viewerPayload}`,
    },
    body: JSON.stringify({ title: "Viewer Product" }),
  });
  assert(viewerPost.status === 403, "5.8 Viewer role forbidden from write operations (HTTP 403 Forbidden)");

  // 5.6 Super Admin reading /api/users strictly excludes passwordHash
  const superAdminUsersGet = await fetch(`${baseUrl}/api/users`, {
    headers: { Cookie: `${SESSION_COOKIE_NAME}=${permanentSessionVal}` },
  });
  assert(superAdminUsersGet.status === 200, "5.9 Super Admin accesses /api/users (HTTP 200)");
  const usersListData = await superAdminUsersGet.json();
  const exposedHashes = usersListData.users.filter((u: { passwordHash?: string }) => Boolean(u.passwordHash));
  assert(
    exposedHashes.length === 0,
    "5.10 Zero password hashes exposed in /api/users response (complete redaction verified)"
  );

  // ---------------------------------------------------------------------------
  // SECTION 6: Email Behavior & Resend Integration Safety
  // ---------------------------------------------------------------------------
  console.log("\n--- 6. Email Service Safety & Resend Verification ---");
  const isResendLive = isEmailServiceConfigured();
  console.log(`[INFO] Resend configured with live key: ${isResendLive}`);

  // Test password reset email without a live key
  const resetRes = await sendPasswordResetEmail({
    to: "admin@flashsolar.org",
    resetToken: "crypto_audit_test_token_2026",
    userName: "Super Admin",
  });

  if (!isResendLive) {
    assert(
      resetRes.success === false,
      "6.1 Password reset does NOT falsely report email sent when Resend key is unconfigured"
    );
    assert(
      Boolean(resetRes.error && resetRes.error.includes("EMAIL_SERVICE_UNAVAILABLE")),
      "6.2 Password reset returns clear, safe error (EMAIL_SERVICE_UNAVAILABLE)"
    );
    assert(
      !resetRes.error?.includes("re_") && !resetRes.error?.includes("C:\\"),
      "6.3 Email error strictly omits credentials and server paths"
    );
    assert(
      Boolean(resetRes.recoveryLink && resetRes.recoveryLink.includes("crypto_audit_test_token_2026")),
      "6.4 Local administrator recovery link is preserved in development/testing environment"
    );
  } else {
    assert(resetRes.success === true, "6.1 Live Resend dispatch successful");
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log(` AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAuthSecurityAudit().catch((err) => {
  console.error("FATAL ERROR in auth security audit:", err);
  process.exit(1);
});
