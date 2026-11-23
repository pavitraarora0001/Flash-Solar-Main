import { describe, it, expect } from "vitest";
import { db } from "./store";
import { EnquiryStatus, Role } from "@prisma/client";

describe("Flash Solar Persistence Store & Lead Management", () => {
  it("provides seed administrative users and verified catalog products", () => {
    const products = db.getProducts();
    expect(products.length).toBeGreaterThanOrEqual(1);

    const powerWall = products.find((p) => p.slug === "flash-power-wall");
    expect(powerWall).toBeDefined();
    expect(powerWall?.specifications["Cell Chemistry"]).toBe("Lithium Iron Phosphate (LiFePO4)");

    const admin = db.getUserByEmail("admin@flashsolar.org");
    expect(admin).toBeDefined();
    expect(admin?.role).toBe(Role.SUPER_ADMIN);
  });

  it("saves a new enquiry with unique tracking reference and timestamp", () => {
    const enquiry = db.saveEnquiry({
      fullName: "Marcus Vance",
      email: "marcus.vance@example.com",
      phone: "+1-415-555-0199",
      company: "Vance Industrial Microgrid",
      country: "United States",
      city: "San Francisco",
      productOfInterest: "Flash DC House Microgrid",
      projectType: "Commercial Rooftop",
      estimatedPowerReq: "15 kW DC Peak",
      estimatedDailyEnergy: "60 kWh",
      message: "Direct DC industrial line setup for server room backup.",
      privacyConsent: true,
      status: EnquiryStatus.NEW,
    });

    expect(enquiry.id).toBeDefined();
    expect(enquiry.referenceNumber).toMatch(/^FS-2026-\d{4}$/);
    expect(enquiry.status).toBe(EnquiryStatus.NEW);

    // Retrieve by ID
    const found = db.getEnquiryById(enquiry.id);
    expect(found).toBeDefined();
    expect(found?.fullName).toBe("Marcus Vance");
  });

  it("updates enquiry status lifecycle and stores internal engineering notes", () => {
    const list = db.getEnquiries();
    const target = list[0];
    expect(target).toBeDefined();

    const updated = db.updateEnquiryStatus(
      target.id,
      EnquiryStatus.QUALIFIED,
      "Engineering desk verified 48V DC bus compatibility. Proposal sent."
    );

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe(EnquiryStatus.QUALIFIED);
    expect(updated?.internalNotes).toContain("Engineering desk verified");
  });

  it("records tamper-evident audit logs and analytics events", () => {
    const log = db.addAuditLog({
      action: "TEST_VERIFICATION",
      entityType: "TestSuite",
      entityId: "test_01",
      metadata: { passed: true },
    });

    expect(log.id).toBeDefined();
    expect(log.action).toBe("TEST_VERIFICATION");

    const evt = db.addAnalyticsEvent({
      eventType: "PAGE_VIEW",
      path: "/#enquiry",
      deviceType: "desktop",
    });

    expect(evt.id).toBeDefined();
    expect(evt.eventType).toBe("PAGE_VIEW");
  });
});
