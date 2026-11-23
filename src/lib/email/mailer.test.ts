import { describe, it, expect, vi } from "vitest";
import {
  sendEmail,
  sendNewEnquiryNotification,
  sendCustomerEnquiryConfirmation,
  sendContactMessageAlert,
  sendPasswordResetEmail,
  sendLeadAssignmentNotification,
} from "./mailer";
import { DBEnquiry, DBContactMessage } from "../db/store";
import { EnquiryStatus } from "@prisma/client";

describe("Flash Solar Transactional Mailer Dispatcher", () => {
  it("dispatches and logs emails cleanly in development simulator mode", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const result = await sendEmail({
      to: "client@example.com",
      subject: "Flash Solar Test Subject",
      text: "Plain text solar sizing notification",
      html: "<p>HTML solar sizing notification</p>",
    });

    expect(result.success).toBe(true);
    expect(result.mode).toBe("development_logged");
    expect(result.messageId).toBeDefined();

    consoleSpy.mockRestore();
  });

  it("formats new enquiry notifications with complete engineering fields", async () => {
    const mockEnquiry: DBEnquiry = {
      id: "enq_test_01",
      referenceNumber: "FS-2026-9999",
      fullName: "Sarah Connor",
      email: "sarah@cyberdyne.org",
      phone: "+1-555-0100",
      company: "Resistance Tech",
      country: "USA",
      city: "Los Angeles",
      productOfInterest: "Flash Power Wall",
      projectType: "Off-Grid Bunker",
      estimatedPowerReq: "10 kW",
      estimatedDailyEnergy: "45 kWh",
      message: "Need 6,000+ cycle endurance for continuous off-grid operation.",
      privacyConsent: true,
      status: EnquiryStatus.NEW,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await sendNewEnquiryNotification(mockEnquiry);
    expect(res.success).toBe(true);

    const confRes = await sendCustomerEnquiryConfirmation(mockEnquiry);
    expect(confRes.success).toBe(true);
  });

  it("formats contact message alerts properly", async () => {
    const mockMsg: DBContactMessage = {
      id: "msg_test_01",
      referenceNumber: "MSG-2026-101",
      name: "Alexander Gray",
      email: "alex@engineering.com",
      phone: "+44 20 7946 0991",
      subject: "Wholesale Battery Inverter Supply",
      message: "Requesting distributor catalog for Flash Power Wall parallel units.",
      status: "UNREAD",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await sendContactMessageAlert(mockMsg);
    expect(res.success).toBe(true);
  });

  it("dispatches password reset security notifications", async () => {
    const res = await sendPasswordResetEmail({
      to: "admin@flashsolar.org",
      resetToken: "sample_crypto_reset_token_test",
      userName: "Lead Electrical Architect",
    });
    expect(res.success).toBe(true);
  });

  it("dispatches engineering lead assignment notifications", async () => {
    const mockEnquiry: DBEnquiry = {
      id: "enq_test_02",
      referenceNumber: "FS-2026-8888",
      fullName: "Dr. Rachel Ward",
      email: "rachel@ward-cleanpower.com",
      phone: "+1-415-555-0188",
      productOfInterest: "Flash DC House Microgrid",
      message: "Direct DC wiring consultation.",
      privacyConsent: true,
      status: EnquiryStatus.NEW,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await sendLeadAssignmentNotification({
      to: "sales.engineer@flashsolar.org",
      engineerName: "Toby Henderson",
      enquiry: mockEnquiry,
    });
    expect(res.success).toBe(true);
  });
});
