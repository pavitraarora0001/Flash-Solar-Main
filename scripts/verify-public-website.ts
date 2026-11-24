import fs from "fs";
import path from "path";

async function runWebsiteAudit() {
  console.log("================================================================================");
  console.log("       FLASH SOLAR — COMPLETE PUBLIC WEBSITE & DESIGN SYSTEM AUDIT              ");
  console.log("================================================================================");

  const baseUrl = "http://localhost:3000";
  let passed = 0;
  let failed = 0;

  function assert(cond: boolean, name: string, detail?: string) {
    if (cond) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}${detail ? ` -> ${detail}` : ""}`);
      failed++;
    }
  }

  // 1. Core Public Routes Inventory
  const publicRoutes = [
    { path: "/", title: "Homepage", marker: "Flash Solar" },
    { path: "/products", title: "Core Systems Catalog", marker: "Energy Storage Systems" },
    { path: "/products/flash-power-wall", title: "Product: Flash Power Wall", marker: "Flash Power Wall" },
    { path: "/products/flash-dc-house", title: "Product: Flash DC House", marker: "Flash DC House" },
    { path: "/products/flash-ac-house", title: "Product: Flash AC House", marker: "Flash AC House" },
    { path: "/products/flash-container-0537", title: "Product: Container Storage", marker: "Flash Container Storage" },
    { path: "/categories/energy-storage", title: "Category: Energy Storage", marker: "Battery Energy Storage Systems" },
    { path: "/categories/dc-microgrid", title: "Category: DC Microgrid", marker: "Direct-Current Architecture" },
    { path: "/categories/hybrid-solar", title: "Category: Hybrid Solar", marker: "Hybrid AC Solar Systems" },
    { path: "/engineering", title: "DC Engineering Architecture", marker: "Direct-Current Microgrid Engineering" },
    { path: "/specifications", title: "Hardware Specification Matrix", marker: "Hardware Specification Matrix" },
    { path: "/solutions", title: "Turnkey Engineering Solutions", marker: "Clean Energy Solutions" },
    { path: "/industries", title: "Industry Topologies", marker: "Engineered Industry Topologies" },
    { path: "/resources", title: "Technical Resources", marker: "Technical Documentation" },
    { path: "/blog", title: "Engineering Insights Blog", marker: "Engineering Insights" },
    { path: "/blog/direct-current-microgrids-thermodynamic-advantage", title: "Blog Post: DC vs AC Solar", marker: "Thermodynamic Comparison" },
    { path: "/about", title: "About Flash Solar", marker: "Architects of Direct-Current Clean Energy" },
    { path: "/contact", title: "Engineering Consultation Desk", marker: "Direct Technical Communications" },
    { path: "/enquiry", title: "Project Sizing Intake", marker: "Project Sizing" },
    { path: "/warranty", title: "Warranty Framework", marker: "Performance Guarantee" },
    { path: "/privacy", title: "Privacy Policy", marker: "Privacy Policy" },
    { path: "/terms", title: "Terms of Service", marker: "Terms of Service" },
  ];

  console.log(`\n--- 1. AUDITING ALL ${publicRoutes.length} PUBLIC ROUTES ---`);
  for (const r of publicRoutes) {
    try {
      const res = await fetch(`${baseUrl}${r.path}`);
      assert(res.status === 200, `Route ${r.path} (${r.title}) returns HTTP 200`);
      const html = await res.text();

      // Check design system elements:
      // Global Header: Logo, Nav Links, Spec Matrix, Explore Platform
      assert(html.includes("FLASH") && html.includes("SOLAR"), `  ${r.path}: Contains Flash Solar brand mark`);
      assert(html.includes("Core Systems") && html.includes("DC Engineering"), `  ${r.path}: Contains global navigation links`);
      assert(html.includes("Spec Matrix"), `  ${r.path}: Contains Spec Matrix action button`);
      assert(html.includes("Explore Platform"), `  ${r.path}: Contains Explore Platform CTA`);

      // Global Footer: Contact hotline, email, address
      assert(html.includes("+91 8824536524"), `  ${r.path}: Contains official engineering hotline`);
      assert(html.includes("info@flashsolar.org"), `  ${r.path}: Contains official engineering email`);
      assert(html.includes("Rajasthan"), `  ${r.path}: Contains headquarters location`);

      // Page-specific marker
      assert(html.includes(r.marker), `  ${r.path}: Contains page-specific content marker ("${r.marker}")`);
    } catch (err) {
      assert(false, `Route ${r.path} fetch failed`, String(err));
    }
  }

  // 2. Legacy WordPress URL Redirects
  console.log("\n--- 2. AUDITING LEGACY WORDPRESS REDIRECTS ---");
  const redirects = [
    { from: "/flash-power-wall", to: "/products/flash-power-wall" },
    { from: "/flash-dc-house", to: "/products/flash-dc-house" },
    { from: "/flash-ac-house", to: "/products/flash-ac-house" },
    { from: "/contact-us", to: "/contact" },
    { from: "/about-us", to: "/about" },
    { from: "/our-services-2", to: "/solutions" },
    { from: "/inquiry", to: "/enquiry" },
    { from: "/flash-warranty-and-guarantee", to: "/warranty" },
  ];

  for (const red of redirects) {
    try {
      const res = await fetch(`${baseUrl}${red.from}`, { redirect: "manual" });
      const statusOk = res.status === 307 || res.status === 308;
      const location = res.headers.get("location");
      assert(statusOk && location === red.to, `Redirect ${red.from} -> ${red.to} (HTTP ${res.status})`);
    } catch (err) {
      assert(false, `Redirect ${red.from} failed`, String(err));
    }
  }

  // 3. Image Assets Audit
  console.log("\n--- 3. AUDITING CRITICAL PHOTOREALISTIC & SCHEMATIC IMAGES ---");
  const images = [
    "/images/logo.jpg",
    "/images/flash-power-wall.jpg",
    "/images/solar-photovoltaic-generation.jpg",
    "/images/hero-solar.jpg",
    "/images/dc-house.svg",
    "/images/ac-house.svg",
    "/images/commercial-facility.svg",
    "/images/agricultural-solar.svg",
  ];

  for (const img of images) {
    try {
      const res = await fetch(`${baseUrl}${img}`);
      assert(res.status === 200, `Image asset ${img} returns HTTP 200`);
    } catch (err) {
      assert(false, `Image asset ${img} failed`, String(err));
    }
  }

  // 4. Form Submissions Audit
  console.log("\n--- 4. AUDITING PUBLIC FORM SUBMISSIONS ---");
  // 4.1 Contact Form
  try {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Audit Specialist",
        email: "audit@test-flashsolar.org",
        phone: "+91 99999 88888",
        subject: "Website Audit Verification",
        message: "Automated test verifying inbound communications reach the database store.",
      }),
    });
    assert(res.status === 200, "Contact form POST /api/contact returns HTTP 200");
    const data = await res.json();
    assert(data.success === true && !!data.referenceNumber, "Contact form returns success and assigns reference number");
  } catch (err) {
    assert(false, "Contact form submission failed", String(err));
  }

  // 4.2 Sizing Enquiry Form
  try {
    const res = await fetch(`${baseUrl}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Dr. Elena Rostova",
        email: "elena.rostova@microgrid-test.org",
        phone: "+91 98765 12345",
        company: "Rostova Advanced Energy",
        country: "India",
        city: "Jodhpur",
        productOfInterest: "Flash Power Wall",
        projectType: "Residential DC Microgrid",
        estimatedPowerReq: "12 kW",
        estimatedDailyEnergy: "35 kWh",
        message: "Testing project intake portal for full automated sizing proposal.",
        privacyConsent: true,
      }),
    });
    const statusOk = res.status === 200 || res.status === 201;
    assert(statusOk, `Sizing enquiry form POST /api/enquiries returns HTTP ${res.status}`);
    const data = await res.json();
    assert(data.success === true && !!data.referenceNumber, "Sizing enquiry returns success and assigned reference number");
  } catch (err) {
    assert(false, "Sizing enquiry submission failed", String(err));
  }

  console.log(`\n================================================================================`);
  console.log(`AUDIT RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log(`================================================================================`);

  if (failed > 0) process.exit(1);
}

runWebsiteAudit();
