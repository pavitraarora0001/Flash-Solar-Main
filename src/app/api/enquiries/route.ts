import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/store";
import { requireAuthSession } from "@/lib/auth/session";
import { sendNewEnquiryNotification, sendCustomerEnquiryConfirmation } from "@/lib/email/mailer";
import { EnquiryStatus, Role } from "@prisma/client";

const createEnquirySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Valid phone number required"),
  company: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  productOfInterest: z.string().min(1, "Product or system of interest is required"),
  projectType: z.string().optional(),
  estimatedPowerReq: z.string().optional(),
  estimatedDailyEnergy: z.string().optional(),
  message: z.string().min(10, "Project description must be at least 10 characters"),
  privacyConsent: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createEnquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const newEnquiry = db.saveEnquiry({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company || "",
      country: data.country || "Global",
      city: data.city || "",
      productOfInterest: data.productOfInterest,
      projectType: data.projectType || "General Consultation",
      estimatedPowerReq: data.estimatedPowerReq || "",
      estimatedDailyEnergy: data.estimatedDailyEnergy || "",
      message: data.message,
      privacyConsent: data.privacyConsent,
      status: EnquiryStatus.NEW,
    });

    // Asynchronously dispatch notifications (tolerates development environment without API keys)
    Promise.allSettled([
      sendNewEnquiryNotification(newEnquiry),
      sendCustomerEnquiryConfirmation(newEnquiry),
    ]).catch((err) => console.error("Email notification batch error:", err));

    db.addAuditLog({
      action: "ENQUIRY_CREATED",
      entityType: "Enquiry",
      entityId: newEnquiry.id,
      metadata: {
        referenceNumber: newEnquiry.referenceNumber,
        product: newEnquiry.productOfInterest,
        email: newEnquiry.email,
      },
    });

    db.addAnalyticsEvent({
      eventType: "ENQUIRY_SUBMIT",
      path: "/#enquiry",
      entityId: newEnquiry.id,
      metadata: { referenceNumber: newEnquiry.referenceNumber },
    });

    return NextResponse.json(
      {
        success: true,
        referenceNumber: newEnquiry.referenceNumber,
        enquiry: newEnquiry,
        message: "Enquiry successfully logged. An engineer will review your project specifications.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process engineering enquiry" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAuthSession(Role.VIEWER);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as EnquiryStatus | null;
    const search = searchParams.get("search")?.toLowerCase().trim();
    const product = searchParams.get("product");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let list = db.getEnquiries();

    if (status) {
      list = list.filter((e) => e.status === status);
    }

    if (product) {
      list = list.filter((e) => e.productOfInterest.toLowerCase().includes(product.toLowerCase()));
    }

    if (search) {
      list = list.filter(
        (e) =>
          e.referenceNumber.toLowerCase().includes(search) ||
          e.fullName.toLowerCase().includes(search) ||
          e.email.toLowerCase().includes(search) ||
          e.company?.toLowerCase().includes(search) ||
          e.phone.includes(search)
      );
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      enquiries: paginated,
    });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error retrieving enquiries" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
