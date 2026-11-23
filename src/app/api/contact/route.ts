import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/store";
import { requireAuthSession } from "@/lib/auth/session";
import { sendContactMessageAlert } from "@/lib/email/mailer";
import { Role } from "@prisma/client";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const msg = db.saveContactMessage({
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      subject: data.subject || "General Inquiry",
      message: data.message,
      status: "UNREAD" as const,
    });

    sendContactMessageAlert(msg).catch((err) => console.error("Contact alert error:", err));

    db.addAuditLog({
      action: "CONTACT_MESSAGE_RECEIVED",
      entityType: "ContactMessage",
      entityId: msg.id,
      metadata: { reference: msg.referenceNumber, email: msg.email },
    });

    return NextResponse.json({
      success: true,
      referenceNumber: msg.referenceNumber,
      message: "Message received. Our engineering support desk will review and respond.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireAuthSession(Role.VIEWER);
    const messages = db.getContactMessages();
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
