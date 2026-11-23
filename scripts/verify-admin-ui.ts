import fs from "fs";
import path from "path";

function loadEnvVar(key: string, defaultValue?: string): string {
  if (process.env[key]) return process.env[key]!;
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith(`${key}=`)) {
          return trimmed.substring(key.length + 1).trim();
        }
      }
    }
  } catch {}
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`CRITICAL SECURITY: ${key} is not configured in environment or .env.local.`);
}

async function runUIVerification() {
  console.log("================================================================================");
  console.log("       FLASH SOLAR ENTERPRISE ADMIN — COMPREHENSIVE UI & ROUTE AUDIT            ");
  console.log("================================================================================");

  const baseUrl = "http://localhost:3000";
  let cookieHeader = "";
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

  // 1. Authenticate with rotated credentials
  const email = loadEnvVar("ADMIN_EMAIL", "admin@flashsolar.org");
  const password = loadEnvVar("ADMIN_PASSWORD");

  try {
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    assert(loginRes.status === 200, "1. Admin Login with Rotated Credentials");
    const data = await loginRes.json();
    assert(data.success === true && data.user.role === "SUPER_ADMIN", "1.1 User payload valid and role is SUPER_ADMIN");
    assert(!data.user.passwordHash, "1.2 Security: passwordHash NOT exposed in login response");

    const setCookie = loginRes.headers.get("set-cookie");
    if (setCookie) {
      cookieHeader = setCookie.split(";")[0];
    }
    assert(!!cookieHeader, "1.3 Session cookie issued");
  } catch (err) {
    assert(false, "1. Admin Login Failed", String(err));
  }

  const authHeaders = {
    Cookie: cookieHeader,
  };

  // 2. Verify all 20 Admin Dashboard Routes + Login
  const routes = [
    { path: "/admin", name: "Overview Dashboard", marker: "Executive Command Center" },
    { path: "/admin/cms", name: "Website CMS", marker: "Website Content Management" },
    { path: "/admin/products", name: "Products Catalog", marker: "Product Architecture Catalog" },
    { path: "/admin/categories", name: "Product Categories", marker: "Product Taxonomies" },
    { path: "/admin/services", name: "Engineering Services", marker: "Engineering & Turnkey Services" },
    { path: "/admin/engineering", name: "Engineering Architecture", marker: "Direct-Current Architecture Journey" },
    { path: "/admin/media", name: "Media Library", marker: "Media & Digital Asset Library" },
    { path: "/admin/enquiries", name: "Enquiries Management", marker: "Customer Enquiries & Sizing Pipeline" },
    { path: "/admin/messages", name: "Contact Messages", marker: "Inbound Communications Inbox" },
    { path: "/admin/leads", name: "Leads Kanban Pipeline", marker: "Enterprise Leads Pipeline & CRM" },
    { path: "/admin/blog", name: "Blog Editorial", marker: "Engineering Insights & News Articles" },
    { path: "/admin/resources", name: "Technical Resources", marker: "Technical Datasheets & Documentation" },
    { path: "/admin/testimonials", name: "Client Testimonials", marker: "Engineering & Enterprise Testimonials" },
    { path: "/admin/faqs", name: "Technical FAQs", marker: "Technical FAQ Knowledge Base" },
    { path: "/admin/seo", name: "SEO Management", marker: "Search Engine Optimization & Metadata" },
    { path: "/admin/analytics", name: "Telemetry & Analytics", marker: "Privacy-First Telemetry" },
    { path: "/admin/email-templates", name: "Email Templates", marker: "Transactional Notification Templates" },
    { path: "/admin/users", name: "Users & RBAC", marker: "Enterprise Team & RBAC Security" },
    { path: "/admin/audit-logs", name: "Audit Trail", marker: "Security & Operational Audit Trail" },
    { path: "/admin/settings", name: "Enterprise Settings", marker: "Enterprise Settings & Configuration" },
    { path: "/admin/login", name: "Admin Login Page", marker: "Administrator Access" },
  ];

  console.log("\n--- VERIFYING ALL 20 ADMIN DASHBOARD ROUTES ---");
  for (const r of routes) {
    try {
      const res = await fetch(`${baseUrl}${r.path}`, { headers: authHeaders });
      const html = await res.text();
      const statusOk = res.status === 200;
      const noErrors = !html.includes("Application error") && !html.includes("Internal Server Error");
      assert(statusOk && noErrors, `Route ${r.path} (${r.name}) loaded successfully (HTTP ${res.status})`);
    } catch (err) {
      assert(false, `Route ${r.path} fetch`, String(err));
    }
  }

  // 3. Form Validation Tests
  console.log("\n--- VERIFYING FORM VALIDATION & ERROR GUARDS ---");
  try {
    // 3.1 Empty product submission
    const badProd = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({}),
    });
    assert(badProd.status === 400, "3.1 Product validation: rejects empty payload with 400");
    const badProdJson = await badProd.json();
    assert(badProdJson.success === false, "3.1.1 Validation error message returned");

    // 3.2 Invalid enquiry submission
    const badEnquiry = await fetch(`${baseUrl}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "A", email: "not-an-email" }),
    });
    assert(badEnquiry.status === 400, "3.2 Enquiry validation: rejects invalid email with 400");

    // 3.3 Unauthorized API request
    const unauthorized = await fetch(`${baseUrl}/api/users`, {
      headers: { Cookie: "" },
    });
    assert(unauthorized.status === 401, "3.3 Security: Unauthenticated request rejected with 401 Unauthorized");
  } catch (err) {
    assert(false, "3. Form Validation Suite", String(err));
  }

  // 4. Role Hierarchy Restrictions
  console.log("\n--- VERIFYING ROLE-BASED ACCESS CONTROL (RBAC) BOUNDARIES ---");
  try {
    // Authenticate as SALES_MANAGER
    const salesEmail = loadEnvVar("SALES_EMAIL", "sales@flashsolar.org");
    const salesPassword = loadEnvVar("SALES_PASSWORD");
    const salesLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: salesEmail, password: salesPassword }),
    });
    assert(salesLogin.status === 200, "4.1 Sales Manager authenticated");
    const salesSetCookie = salesLogin.headers.get("set-cookie");
    const salesCookie = salesSetCookie ? salesSetCookie.split(";")[0] : "";

    // SALES_MANAGER should NOT have permission to access /api/users
    const salesUserAccess = await fetch(`${baseUrl}/api/users`, {
      headers: { Cookie: salesCookie },
    });
    assert(salesUserAccess.status === 403 || salesUserAccess.status === 401, "4.2 RBAC: SALES_MANAGER blocked from User Admin (403/401)");

    // SALES_MANAGER should NOT have permission to export database backup
    const salesBackupAccess = await fetch(`${baseUrl}/api/admin/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: salesCookie },
      body: JSON.stringify({ action: "backup" }),
    });
    assert(salesBackupAccess.status === 403 || salesBackupAccess.status === 401, "4.3 RBAC: SALES_MANAGER blocked from database export (403/401)");
  } catch (err) {
    assert(false, "4. RBAC Verification", String(err));
  }

  // 5. Data Privacy & Leaks Check
  console.log("\n--- VERIFYING PRIVACY & SENSITIVE DATA LEAK PREVENTION ---");
  try {
    const usersRes = await fetch(`${baseUrl}/api/users`, { headers: authHeaders });
    const usersJson = await usersRes.json();
    assert(usersJson.success === true, "5.1 Users API accessible by SUPER_ADMIN");

    let leaked = false;
    for (const u of usersJson.users) {
      if (u.passwordHash) {
        leaked = true;
        break;
      }
    }
    assert(!leaked, "5.2 Security: Users API does NOT expose passwordHash field");
  } catch (err) {
    assert(false, "5. Data Privacy Check", String(err));
  }

  // 6. Media & File Upload Test
  console.log("\n--- VERIFYING MULTIPART MEDIA ASSET UPLOAD & AUDIT ---");
  try {
    const formData = new FormData();
    const fakeImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    const fileBlob = new Blob([fakeImageBuffer], { type: "image/png" });
    formData.append("file", fileBlob, "e2e-test-badge.png");
    formData.append("category", "Solar Modules");
    formData.append("altText", "E2E Verification Image");

    const uploadRes = await fetch(`${baseUrl}/api/media`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      body: formData,
    });

    const uploadText = await uploadRes.text();
    console.log("Upload status:", uploadRes.status, uploadText);
    let uploadData: any = {};
    try { uploadData = JSON.parse(uploadText); } catch {}
    assert(uploadRes.status === 200 || uploadRes.status === 201, "6.1 Multipart Media Upload POST /api/media (HTTP 200/201)");
    const isBlobUrl = typeof uploadData.asset?.fileUrl === "string" && uploadData.asset.fileUrl.includes("blob.vercel-storage.com");
    const isLocalUrl = typeof uploadData.asset?.fileUrl === "string" && uploadData.asset.fileUrl.startsWith("/uploads/");
    assert(uploadData.success === true && (isBlobUrl || isLocalUrl), "6.2 Media asset saved with valid CDN or local URL");

    if (isBlobUrl) {
      console.log("   -> Verified remote Vercel Blob URL:", uploadData.asset.fileUrl);
      assert(uploadData.asset.fileUrl.startsWith("https://"), "6.3 Uploaded file verified on Vercel Blob HTTPS CDN");
    } else {
      const diskPath = path.resolve(process.cwd(), "public", (uploadData.asset.fileUrl || "").replace(/^\//, ""));
      const fileExists = fs.existsSync(diskPath);
      assert(fileExists, "6.3 Uploaded file physically verified on disk");
      if (fileExists) {
        try { fs.unlinkSync(diskPath); } catch {}
      }
    }

    // Clean up created media asset from store and remote blob
    if (uploadData.asset?.id) {
      await fetch(`${baseUrl}/api/media?id=${uploadData.asset.id}`, {
        method: "DELETE",
        headers: { Cookie: cookieHeader },
      });
    }

    // 6.4 Security check: Executable rejection
    const maliciousForm = new FormData();
    maliciousForm.append("file", new Blob(["MZ...executable binary content"], { type: "application/x-msdownload" }), "backdoor.exe");
    maliciousForm.append("category", "General");
    const maliciousRes = await fetch(`${baseUrl}/api/media`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
      body: maliciousForm,
    });
    assert(maliciousRes.status === 400, "6.4 Security: Disallowed executable (.exe) rejected with HTTP 400");

    // 6.5 Security check: MIME spoofing rejection (PHP script claiming to be image/png)
    const spoofForm = new FormData();
    spoofForm.append("file", new Blob(["<?php echo 'malicious shell'; ?>"], { type: "image/png" }), "spoofed.png");
    spoofForm.append("category", "General");
    const spoofRes = await fetch(`${baseUrl}/api/media`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
      body: spoofForm,
    });
    assert(spoofRes.status === 400, "6.5 Security: Spoofed MIME signature rejected with HTTP 400");

    // 6.6 Security check: Unauthenticated avatar upload rejected
    const unauthAvatarRes = await fetch(`${baseUrl}/api/avatar/upload?filename=avatar.png`, {
      method: "POST",
      headers: { "Content-Type": "image/png" },
      body: fakeImageBuffer,
    });
    assert(unauthAvatarRes.status === 401, "6.6 Security: Unauthenticated /api/avatar/upload rejected with HTTP 401");

    // 6.7 Security check: Authenticated avatar upload succeeds
    const authAvatarRes = await fetch(`${baseUrl}/api/avatar/upload?filename=e2e-avatar.png`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "image/png",
      },
      body: fakeImageBuffer,
    });
    assert(authAvatarRes.status === 200, "6.7 Security: Authenticated avatar upload returns HTTP 200");
    const avatarData: any = await authAvatarRes.json().catch(() => ({}));
    assert(
      typeof avatarData.url === "string" && (avatarData.url.includes("blob.vercel-storage.com") || avatarData.url.startsWith("/uploads/")),
      "6.8 Avatar returned valid public CDN or local URL"
    );

    // Clean up test avatar
    if (avatarData.url?.includes("blob.vercel-storage.com")) {
      const { deleteFromBlob } = await import("../src/lib/storage/blob");
      await deleteFromBlob(avatarData.url).catch(() => {});
    }
  } catch (err) {
    assert(false, "6. Media Upload Test", String(err));
  }

  console.log("\n================================================================================");
  console.log(`UI AUDIT SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runUIVerification().catch((err) => {
  console.error("Fatal UI audit error:", err);
  process.exit(1);
});
export {};
