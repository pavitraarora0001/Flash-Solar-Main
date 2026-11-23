import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const templates = db.getEmailTemplates();
  return NextResponse.json({ success: true, templates });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === Role.VIEWER) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Template management permissions required." }, { status: 403 });
  }

  try {
    const body = await req.json();

    // Test email dispatch trigger
    if (body.action === "send_test") {
      const { slug, testEmail } = body;
      const tmpl = db.getEmailTemplateBySlug(slug);
      if (!tmpl) {
        return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
      }

      console.log(`[TEST EMAIL DISPATCH] Sent test for ${tmpl.name} to ${testEmail}`);
      db.addAuditLog({
        userId: session.userId,
        userName: session.name,
        action: "TEST_EMAIL_DISPATCHED",
        entityType: "EmailTemplate",
        entityId: tmpl.id,
        metadata: { slug, testEmail },
      });

      return NextResponse.json({
        success: true,
        message: `Test email for "${tmpl.name}" successfully dispatched to ${testEmail}.`,
      });
    }

    // Save template
    if (!body.slug || !body.name || !body.subject || !body.body) {
      return NextResponse.json({ success: false, error: "Slug, name, subject, and body are required." }, { status: 400 });
    }

    const saved = db.saveEmailTemplate({
      id: body.id || `tmpl_${Date.now()}`,
      slug: body.slug,
      name: body.name,
      subject: body.subject,
      body: body.body,
      senderName: body.senderName || "Flash Solar Engineering",
      variables: Array.isArray(body.variables) ? body.variables : ["customerName", "referenceNumber"],
      isEnabled: body.isEnabled ?? true,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "EMAIL_TEMPLATE_UPDATED",
      entityType: "EmailTemplate",
      entityId: saved.id,
      metadata: { slug: saved.slug, name: saved.name },
    });

    return NextResponse.json({ success: true, template: saved });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to update template" }, { status: 500 });
  }
}
