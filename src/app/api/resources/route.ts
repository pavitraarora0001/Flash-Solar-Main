import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resources = db.getResources();
    return NextResponse.json({ success: true, resources });
  } catch (error) {
    console.error("Resources GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Download tracking action (public)
    if (body.slug && body.action === "download") {
      db.incrementResourceDownload(body.slug);
      db.addAnalyticsEvent({
        eventType: "RESOURCE_DOWNLOAD",
        path: `/resources/${body.slug}`,
        metadata: { slug: body.slug },
      });
      return NextResponse.json({ success: true, message: "Download recorded" });
    }

    // 2. Resource Admin Save action (requires CONTENT_MANAGER)
    const session = await getSession();
    if (!session || session.role === Role.VIEWER) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED: Content permissions required." }, { status: 403 });
    }

    if (!body.title || !body.slug || !body.fileUrl) {
      return NextResponse.json({ success: false, error: "Title, slug, and fileUrl are required." }, { status: 400 });
    }

    const saved = db.saveResource({
      id: body.id || `res_${Date.now()}`,
      slug: body.slug,
      title: body.title,
      resourceType: body.resourceType || "DATASHEET",
      summary: body.summary || "",
      fileUrl: body.fileUrl,
      fileSize: body.fileSize || "1.0 MB",
      downloadCount: Number(body.downloadCount ?? 0),
      status: body.status || "PUBLISHED",
      createdAt: body.createdAt || new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "RESOURCE_SAVED",
      entityType: "TechnicalResource",
      entityId: saved.id,
      metadata: { title: saved.title, slug: saved.slug },
    });

    return NextResponse.json({ success: true, resource: saved });
  } catch (error) {
    console.error("Resource action error:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== Role.SUPER_ADMIN && session.role !== Role.ADMIN)) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Admin role required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    db.deleteResource(id);
    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "RESOURCE_DELETED",
      entityType: "TechnicalResource",
      entityId: id,
    });

    return NextResponse.json({ success: true, message: "Resource deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to delete" }, { status: 500 });
  }
}
