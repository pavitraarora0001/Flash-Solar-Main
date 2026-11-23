import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const pages = db.getPages();
  return NextResponse.json({ success: true, pages });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role === Role.VIEWER)) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Content editing permissions required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.slug || !body.title) {
      return NextResponse.json({ success: false, error: "Page slug and title are required." }, { status: 400 });
    }

    const saved = db.savePage({
      id: body.id || `pg_${Date.now()}`,
      slug: body.slug,
      title: body.title,
      summary: body.summary || "",
      status: body.status || "PUBLISHED",
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      ogImageUrl: body.ogImageUrl,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "PAGE_SAVED",
      entityType: "Page",
      entityId: saved.id,
      metadata: { slug: saved.slug, title: saved.title },
    });

    return NextResponse.json({ success: true, page: saved });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to save page" }, { status: 500 });
  }
}
