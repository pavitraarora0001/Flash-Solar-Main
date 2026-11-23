import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("pageId");
  const slug = searchParams.get("slug");

  let targetPageId = pageId;
  if (!targetPageId && slug) {
    const page = db.getPageBySlug(slug);
    if (page) targetPageId = page.id;
  }

  if (!targetPageId) {
    targetPageId = "pg_home";
  }

  const sections = db.getPageSections(targetPageId);
  return NextResponse.json({ success: true, sections });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === Role.VIEWER) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Content editing permissions required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.pageId || !body.sectionKey || !body.title) {
      return NextResponse.json({ success: false, error: "pageId, sectionKey, and title are required." }, { status: 400 });
    }

    const saved = db.savePageSection({
      id: body.id || `sec_${Date.now()}`,
      pageId: body.pageId,
      sectionKey: body.sectionKey,
      title: body.title,
      subtitle: body.subtitle,
      badge: body.badge,
      content: body.content || {},
      mediaUrl: body.mediaUrl,
      displayOrder: body.displayOrder ?? 0,
      isVisible: body.isVisible ?? true,
      status: body.status || "PUBLISHED",
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "PAGE_SECTION_SAVED",
      entityType: "PageSection",
      entityId: saved.id,
      metadata: { pageId: saved.pageId, sectionKey: saved.sectionKey },
    });

    return NextResponse.json({ success: true, section: saved });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to save section" }, { status: 500 });
  }
}
