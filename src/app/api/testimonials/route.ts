import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const testimonials = db.getTestimonials();
  return NextResponse.json({ success: true, testimonials });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === Role.VIEWER) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Testimonial editing permissions required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.authorName || !body.quote) {
      return NextResponse.json({ success: false, error: "Author name and quote are required." }, { status: 400 });
    }

    const saved = db.saveTestimonial({
      id: body.id || `tst_${Date.now()}`,
      authorName: body.authorName,
      authorTitle: body.authorTitle || "",
      company: body.company || "",
      quote: body.quote,
      rating: Number(body.rating ?? 5),
      verified: body.verified ?? true,
      isPublished: body.isPublished ?? true,
      createdAt: body.createdAt || new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "TESTIMONIAL_SAVED",
      entityType: "Testimonial",
      entityId: saved.id,
      metadata: { authorName: saved.authorName },
    });

    return NextResponse.json({ success: true, testimonial: saved });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to save testimonial" }, { status: 500 });
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

    db.deleteTestimonial(id);
    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "TESTIMONIAL_DELETED",
      entityType: "Testimonial",
      entityId: id,
    });

    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to delete" }, { status: 500 });
  }
}
