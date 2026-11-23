import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const faqs = db.getFaqs();
  return NextResponse.json({ success: true, faqs });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === Role.VIEWER) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Content permissions required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ success: false, error: "Question and answer are required." }, { status: 400 });
    }

    const saved = db.saveFaq({
      id: body.id || `faq_${Date.now()}`,
      category: body.category || "DC Engineering",
      question: body.question,
      answer: body.answer,
      displayOrder: Number(body.displayOrder ?? 0),
      isPublished: body.isPublished ?? true,
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "FAQ_SAVED",
      entityType: "FAQ",
      entityId: saved.id,
      metadata: { question: saved.question },
    });

    return NextResponse.json({ success: true, faq: saved });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to save FAQ" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== Role.SUPER_ADMIN && session.role !== Role.ADMIN)) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Super Admin or Admin role required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    db.deleteFaq(id);
    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "FAQ_DELETED",
      entityType: "FAQ",
      entityId: id,
    });

    return NextResponse.json({ success: true, message: "FAQ deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to delete" }, { status: 500 });
  }
}
