import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  sendEmail,
  sendNewEnquiryNotification,
  sendCustomerEnquiryConfirmation,
  sendContactMessageAlert,
  sendPasswordResetEmail,
  sendLeadAssignmentNotification,
  isEmailServiceConfigured,
} from "./mailer";
import { DBEnquiry, DBContactMessage } from "../db/store";
import { EnquiryStatus } from "@prisma/client";

describe("Flash Solar Transactional Mailer Dispatcher", () => {
  const originalEnv = { ...process.env };

  const setNodeEnv = (val: string) => {
    (process.env as Record<string, string | undefined>).NODE_ENV = val;
  };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("identifies unconfigured Resend credentials accurately", () => {
    delete process.env.RESEND_API_KEY;
    expect(isEmailServiceConfigured()).toBe(false);

    process.env.RESEND_API_KEY = "re_dev_placeholder_simulator_2026";
    expect(isEmailServiceConfigured()).toBe(false);

    process.env.RESEND_API_KEY = "re_validLiveSecret123456789";
    expect(isEmailServiceConfigured()).toBe(true);
  });

  it("dispatches and logs emails cleanly in development simulator mode", async () => {
    delete process.env.RESEND_API_KEY;
    setNodeEnv("development");
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

  it("fails safely without claiming success in production if Resend key is missing", async () => {
    delete process.env.RESEND_API_KEY;
    setNodeEnv("production");

    const result = await sendEmail({
      to: "client@example.com",
      subject: "Flash Solar Production Alert",
      text: "Plain text",
      html: "<p>HTML</p>",
    });

    expect(result.success).toBe(false);
    expect(result.mode).toBe("resend");
    expect(result.error).toContain("EMAIL_SERVICE_UNAVAILABLE");
    // Ensure no sensitive paths or credentials leaked
    expect(result.error).not.toContain("re_");
    expect(result.error).not.toContain("C:\\");
  });

  it("fails safely and preserves local admin recovery when Resend key is missing for password reset", async () => {
    delete process.env.RESEND_API_KEY;
    setNodeEnv("development");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const res = await sendPasswordResetEmail({
      to: "admin@flashsolar.org",
      resetToken: "sample_crypto_reset_token_test",
      userName: "Lead Electrical Architect",
    });

    // Must NOT falsely report email sent
    expect(res.success).toBe(false);
    expect(res.mode).toBe("resend");
    expect(res.error).toContain("EMAIL_SERVICE_UNAVAILABLE");
    // Preserves local recovery link in non-production
    expect(res.recoveryLink).toContain("sample_crypto_reset_token_test");
    expect(warnSpy).toHaveBeenCalled();
  });

  it("dispatches through live Resend endpoint when valid API key is present", async () => {
    process.env.RESEND_API_KEY = "re_live_valid_key_test_123456";
    setNodeEnv("production");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "msg_resend_prod_9999" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const res = await sendEmail({
      to: "admin@flashsolar.org",
      subject: "Live Dispatch Test",
      text: "Text message",
      html: "<p>HTML message</p>",
    });

    expect(res.success).toBe(true);
    expect(res.messageId).toBe("msg_resend_prod_9999");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer re_live_valid_key_test_123456",
        }),
      })
    );
  });

  it("formats new enquiry notifications with complete engineering fields", async () => {
    delete process.env.RESEND_API_KEY;
    setNodeEnv("development");
    vi.spyOn(console, "log").mockImplementation(() => {});

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
    delete process.env.RESEND_API_KEY;
    setNodeEnv("development");
    vi.spyOn(console, "log").mockImplementation(() => {});

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

  it("dispatches engineering lead assignment notifications", async () => {
    delete process.env.RESEND_API_KEY;
    setNodeEnv("development");
    vi.spyOn(console, "log").mockImplementation(() => {});

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
