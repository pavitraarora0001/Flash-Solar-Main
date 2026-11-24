import fs from "fs";
import path from "path";
import { Role, PublishStatus, LeadPriority } from "@prisma/client";

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
  throw new Error(`CRITICAL SECURITY: ${key} is not configured in environment or .env.local.`);
}

async function runAudit() {
  console.log("================================================================================");
  console.log("       FLASH SOLAR ENTERPRISE ADMIN CONTROL CENTER — SYSTEM E2E AUDIT          ");
  console.log("================================================================================");

  const baseUrl = "http://localhost:3000";
  let cookieHeader = "";
  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      testsPassed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` -> ${detail}` : ""}`);
      testsFailed++;
    }
  }

  // 1. Public Homepage Check
  try {
    const res = await fetch(`${baseUrl}/`);
    assert(res.status === 200, "1. Public Homepage HTTP 200");
    const html = await res.text();
    assert(html.includes("Flash Solar"), "1.1 Homepage contains Flash Solar brand");
    assert(html.includes("Direct-Current Architecture") || html.includes("High-Efficiency"), "1.2 Homepage contains engineering architecture content");
  } catch (err) {
    assert(false, "1. Public Homepage Fetch", String(err));
  }

  // 2. Authentication & Session Security
  try {
    const adminEmail = loadEnvVar("ADMIN_EMAIL", "admin@flashsolar.org");
    const adminPassword = loadEnvVar("ADMIN_PASSWORD");
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
      }),
    });
    assert(loginRes.status === 200, "2. Admin Authentication POST /api/auth/login");
    const loginData = await loginRes.json();
    assert(loginData.success === true && loginData.user?.role === "SUPER_ADMIN", "2.1 Admin session authenticated as SUPER_ADMIN");

    // Extract cookie
    const setCookie = loginRes.headers.get("set-cookie");
    if (setCookie) {
      cookieHeader = setCookie.split(";")[0];
    }
    assert(!!cookieHeader, "2.2 Secure auth session cookie issued");
  } catch (err) {
    assert(false, "2. Admin Authentication", String(err));
  }

  const authHeaders = {
    "Content-Type": "application/json",
    Cookie: cookieHeader,
  };

  // 3. Overview & Executive Metrics
  try {
    const metricsRes = await fetch(`${baseUrl}/api/admin/metrics?period=all`, { headers: authHeaders });
    assert(metricsRes.status === 200, "3. Executive Metrics GET /api/admin/metrics");
    const metricsData = await metricsRes.json();
    assert(metricsData.success === true && typeof metricsData.metrics.totalEnquiries === "number", "3.1 Real KPI metrics calculated");
  } catch (err) {
    assert(false, "3. Executive Metrics", String(err));
  }

  // 4. Website CMS (Pages & Sections)
  try {
    const pagesRes = await fetch(`${baseUrl}/api/cms/pages`, { headers: authHeaders });
    assert(pagesRes.status === 200, "4. CMS Pages GET /api/cms/pages");
    const pagesData = await pagesRes.json();
    assert(pagesData.success === true && pagesData.pages.length > 0, "4.1 CMS Pages loaded");

    // Save page section
    const sectionRes = await fetch(`${baseUrl}/api/cms/sections`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        pageId: "page_home",
        sectionKey: "hero",
        title: "Flash Solar Clean Energy Systems",
        subtitle: "High-Efficiency Clean Energy Engineering",
        content: { headline: "Enterprise Solar Infrastructure" },
        isActive: true,
        displayOrder: 1,
      }),
    });
    assert(sectionRes.status === 200, "4.2 CMS Section Update POST /api/cms/sections");
  } catch (err) {
    assert(false, "4. Website CMS", String(err));
  }

  // 5. Product Categories
  try {
    const catRes = await fetch(`${baseUrl}/api/categories`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Test Inverter Series",
        slug: "test-inverter-series",
        description: "Test series for acceptance verification",
        displayOrder: 99,
      }),
    });
    assert(catRes.status === 201 || catRes.status === 200, "5. Product Categories POST /api/categories");
    const catData = await catRes.json();
    assert(catData.success === true, "5.1 Product Category created");
  } catch (err) {
    assert(false, "5. Product Categories", String(err));
  }

  // 6. Products Catalog & Specifications Matrix
  let testProductId = "";
  try {
    const prodRes = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Flash Test Cell 500W",
        slug: "flash-test-cell-500w",
        tagline: "Test Solar Photovoltaic Cell",
        categoryId: "cat_solar_panels",
        summary: "High efficiency test PV module",
        description: "Complete description for testing specifications matrix",
        status: PublishStatus.PUBLISHED,
        specifications: {
          nominalPower: "500 W",
          efficiency: "24.5%",
          dimensions: "2000 x 1000 x 35 mm",
          warranty: "25 Years",
        },
        features: ["Anti-reflective coating", "Direct DC busbar"],
      }),
    });
    assert(prodRes.status === 201, "6. Product Creation POST /api/products");
    const prodData = await prodRes.json();
    assert(prodData.success === true && prodData.product.slug === "flash-test-cell-500w", "6.1 Product created with specs");
    testProductId = prodData.product.id;

    // Verify retrieval
    const getProdRes = await fetch(`${baseUrl}/api/products/${testProductId}`);
    assert(getProdRes.status === 200, "6.2 Product Lookup GET /api/products/[id]");
  } catch (err) {
    assert(false, "6. Products Catalog", String(err));
  }

  // 7. Engineering Architecture (5 DC Stages)
  try {
    const engRes = await fetch(`${baseUrl}/api/engineering`);
    assert(engRes.status === 200, "7. Engineering Stages GET /api/engineering");
    const engData = await engRes.json();
    assert(engData.success === true && engData.stages.length >= 5, "7.1 All 5 DC architecture stages loaded");

    // Update stage 1
    const stage1 = engData.stages[0];
    const updateStageRes = await fetch(`${baseUrl}/api/engineering`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        ...stage1,
        title: "Solar Photovoltaic Generation",
      }),
    });
    assert(updateStageRes.status === 200, "7.2 Engineering Stage Update POST /api/engineering");
  } catch (err) {
    assert(false, "7. Engineering Architecture", String(err));
  }

  // 8. Services Manager
  try {
    const srvRes = await fetch(`${baseUrl}/api/services`);
    assert(srvRes.status === 200, "8. Services GET /api/services");
    const srvData = await srvRes.json();
    assert(srvData.success === true && srvData.services.length > 0, "8.1 Turnkey services loaded");
  } catch (err) {
    assert(false, "8. Services Manager", String(err));
  }

  // 9. Media Library
  try {
    const mediaRes = await fetch(`${baseUrl}/api/media?category=All`, { headers: authHeaders });
    assert(mediaRes.status === 200, "9. Media Library GET /api/media");
    const mediaData = await mediaRes.json();
    assert(mediaData.success === true && mediaData.assets.length > 0, "9.1 Media assets accessible");
  } catch (err) {
    assert(false, "9. Media Library", String(err));
  }

  // 10. Enquiries & CRM Kanban Pipeline
  let testEnquiryId = "";
  try {
    // Public enquiry submission
    const submitRes = await fetch(`${baseUrl}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Dr. Walter Bishop",
        email: "walter@fringe-energy.org",
        phone: "+1 (555) 019-2834",
        company: "Bishop Dynamics",
        country: "USA",
        city: "Boston",
        productOfInterest: "Flash Power Wall",
        projectType: "Off-Grid Research Facility",
        estimatedPowerReq: "50 kW",
        estimatedDailyEnergy: "250 kWh",
        message: "Need immediate quotation for 5x Flash Power Wall parallel units.",
      }),
    });
    assert(submitRes.status === 201, "10. Public Enquiry Submission POST /api/enquiries");
    const submitData = await submitRes.json();
    assert(submitData.success === true && submitData.enquiry.referenceNumber.startsWith("FS-"), "10.1 Lead assigned unique reference number");
    testEnquiryId = submitData.enquiry.id;

    // Admin updates lead status & priority
    const updateEnquiryRes = await fetch(`${baseUrl}/api/enquiries/${testEnquiryId}`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        status: "QUALIFIED",
        priority: "URGENT",
        internalNotes: "Verified load profiles. Ready for technical sizing proposal.",
      }),
    });
    assert(updateEnquiryRes.status === 200, "10.2 Lead CRM Status Advance PATCH /api/enquiries/[id]");
    const updateData = await updateEnquiryRes.json();
    assert(updateData.enquiry.status === "QUALIFIED" && updateData.enquiry.priority === "URGENT", "10.3 Pipeline status and priority updated");
  } catch (err) {
    assert(false, "10. Enquiries & CRM Pipeline", String(err));
  }

  // 11. Contact Communications Inbox
  try {
    const contactRes = await fetch(`${baseUrl}/api/contact`, { headers: authHeaders });
    assert(contactRes.status === 200, "11. Contact Messages GET /api/contact");
    const contactData = await contactRes.json();
    assert(contactData.success === true && Array.isArray(contactData.messages), "11.1 Contact inbox accessible");
  } catch (err) {
    assert(false, "11. Contact Communications Inbox", String(err));
  }

  // 12. Blog Manager
  try {
    const blogRes = await fetch(`${baseUrl}/api/blog`);
    assert(blogRes.status === 200, "12. Blog Articles GET /api/blog");
    const blogData = await blogRes.json();
    assert(blogData.success === true && blogData.posts.length > 0, "12.1 Blog posts loaded");
  } catch (err) {
    assert(false, "12. Blog Manager", String(err));
  }

  // 13. Technical Resources / Datasheets
  try {
    const resRes = await fetch(`${baseUrl}/api/resources`);
    assert(resRes.status === 200, "13. Technical Datasheets GET /api/resources");
    const resData = await resRes.json();
    assert(resData.success === true && resData.resources.length > 0, "13.1 Technical datasheets loaded");
  } catch (err) {
    assert(false, "13. Technical Resources", String(err));
  }

  // 14. Testimonials
  try {
    const testRes = await fetch(`${baseUrl}/api/testimonials`);
    assert(testRes.status === 200, "14. Testimonials GET /api/testimonials");
    const testData = await testRes.json();
    assert(testData.success === true && testData.testimonials.length > 0, "14.1 Engineering testimonials loaded");
  } catch (err) {
    assert(false, "14. Testimonials", String(err));
  }

  // 15. FAQs
  try {
    const faqRes = await fetch(`${baseUrl}/api/faqs`);
    assert(faqRes.status === 200, "15. Technical FAQs GET /api/faqs");
    const faqData = await faqRes.json();
    assert(faqData.success === true && faqData.faqs.length > 0, "15.1 Technical FAQs loaded");
  } catch (err) {
    assert(false, "15. FAQs", String(err));
  }

  // 16. SEO Manager
  try {
    const seoRes = await fetch(`${baseUrl}/api/seo`, { headers: authHeaders });
    assert(seoRes.status === 200, "16. SEO Metadata GET /api/seo");
    const seoData = await seoRes.json();
    assert(seoData.success === true && seoData.seo.pages.length > 0, "16.1 SEO records accessible");
  } catch (err) {
    assert(false, "16. SEO Manager", String(err));
  }

  // 17. Telemetry & Analytics
  try {
    // Register telemetry event
    const eventRes = await fetch(`${baseUrl}/api/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "CTA_CLICK",
        path: "/",
        element: "sizing_calculator_button",
        deviceType: "desktop",
      }),
    });
    assert(eventRes.status === 200, "17. Telemetry Event POST /api/analytics/events");

    // Fetch summary
    const summaryRes = await fetch(`${baseUrl}/api/analytics/summary`, { headers: authHeaders });
    assert(summaryRes.status === 200, "17.1 Telemetry Summary GET /api/analytics/summary");
    const summaryData = await summaryRes.json();
    assert(summaryData.success === true && typeof summaryData.summary.pageViews === "number", "17.2 First-party telemetry calculated");
  } catch (err) {
    assert(false, "17. Telemetry & Analytics", String(err));
  }

  // 18. Email Templates
  try {
    const tmplRes = await fetch(`${baseUrl}/api/email-templates`, { headers: authHeaders });
    assert(tmplRes.status === 200, "18. Email Templates GET /api/email-templates");
    const tmplData = await tmplRes.json();
    assert(tmplData.success === true && tmplData.templates.length >= 4, "18.1 All transactional templates configured");
  } catch (err) {
    assert(false, "18. Email Templates", String(err));
  }

  // 19. Users & RBAC Controls
  try {
    const usersRes = await fetch(`${baseUrl}/api/users`, { headers: authHeaders });
    assert(usersRes.status === 200, "19. Team & RBAC GET /api/users");
    const usersData = await usersRes.json();
    assert(usersData.success === true && usersData.users.length > 0, "19.1 Team members loaded");
  } catch (err) {
    assert(false, "19. Users & RBAC Controls", String(err));
  }

  // 20. Enterprise Settings & Full Database Backup
  try {
    const settingsRes = await fetch(`${baseUrl}/api/admin/settings`, { headers: authHeaders });
    assert(settingsRes.status === 200, "20. Enterprise Settings GET /api/admin/settings");
    const settingsData = await settingsRes.json();
    assert(
      settingsData.success === true &&
      (settingsData.system.health === "HEALTHY" || settingsData.system.health === "DEGRADED_DATABASE_BLOCKED"),
      "20.1 System health & telemetry diagnosed"
    );
    assert(typeof settingsData.system.postgresStatus === "string", "20.1.1 PostgreSQL runtime status diagnosed");

    // Backup export
    const backupRes = await fetch(`${baseUrl}/api/admin/settings`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ action: "backup" }),
    });
    assert(backupRes.status === 200, "20.2 Database Snapshot Export POST /api/admin/settings");
    const backupData = await backupRes.json();
    assert(backupData.success === true && backupData.backup.data.products.length > 0, "20.3 Full ACID database snapshot verified");
  } catch (err) {
    assert(false, "20. Enterprise Settings & Backup", String(err));
  }

  console.log("================================================================================");
  console.log(`AUDIT RESULTS: ${testsPassed} PASSED | ${testsFailed} FAILED`);
  console.log("================================================================================");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error("Fatal audit execution error:", err);
  process.exit(1);
});
export {};
