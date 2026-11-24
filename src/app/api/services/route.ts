import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/store";
import { requireAuthSession } from "@/lib/auth/session";
import { Role, PublishStatus } from "@prisma/client";

const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title required"),
  slug: z.string().min(2, "Slug required"),
  categoryId: z.string().default("cat_engineering"),
  summary: z.string().min(5, "Summary required"),
  description: z.string().min(10, "Description required"),
  iconName: z.string().optional(),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
  displayOrder: z.number().default(1),
});

export async function GET() {
  try {
    const services = db.getServices();
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("Services GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession(Role.CONTENT_MANAGER);
    const body = await req.json();
    const parsed = serviceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const id = data.id || `srv_${Date.now()}`;
    const service = db.saveService({
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "SERVICE_SAVED",
      entityType: "Service",
      entityId: service.id,
      metadata: { title: service.title },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    const isForbidden = error instanceof Error && error.message.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized" },
      { status: isAuth ? 401 : isForbidden ? 403 : 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuthSession(Role.CONTENT_MANAGER);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Service ID required" }, { status: 400 });
    }

    db.deleteService(id);

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "SERVICE_DELETED",
      entityType: "Service",
      entityId: id,
    });

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    const isForbidden = error instanceof Error && error.message.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized" },
      { status: isAuth ? 401 : isForbidden ? 403 : 500 }
    );
  }
}
