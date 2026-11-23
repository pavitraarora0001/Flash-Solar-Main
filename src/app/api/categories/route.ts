import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = db.getProductCategories();
  return NextResponse.json({ success: true, categories });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === Role.VIEWER) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Administrator or Content Manager role required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, error: "Category name and slug are required." }, { status: 400 });
    }

    const saved = db.saveProductCategory({
      id: body.id || `cat_${Date.now()}`,
      slug: body.slug,
      name: body.name,
      description: body.description || "",
      displayOrder: Number(body.displayOrder ?? 0),
      createdAt: body.createdAt || new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "CATEGORY_SAVED",
      entityType: "ProductCategory",
      entityId: saved.id,
      metadata: { name: saved.name, slug: saved.slug },
    });

    return NextResponse.json({ success: true, category: saved });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to save category" }, { status: 500 });
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
    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID is required" }, { status: 400 });
    }

    db.deleteProductCategory(id);
    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "CATEGORY_DELETED",
      entityType: "ProductCategory",
      entityId: id,
    });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to delete" }, { status: 500 });
  }
}
