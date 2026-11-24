import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { requireAuthSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = db.getProductById(params.id) || db.getProductBySlug(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuthSession(Role.CONTENT_MANAGER);
    const existing = db.getProducts().find((p) => p.id === params.id);

    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const updates = await req.json();
    const updated = db.saveProduct({
      ...existing,
      ...updates,
      id: existing.id,
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "PRODUCT_UPDATED",
      entityType: "Product",
      entityId: existing.id,
      metadata: { name: existing.name },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    const isForbidden = error instanceof Error && error.message.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update product" },
      { status: isAuth ? 401 : isForbidden ? 403 : 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuthSession(Role.ADMIN);
    const existing = db.getProducts().find((p) => p.id === params.id);

    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    db.deleteProduct(params.id);

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "PRODUCT_DELETED",
      entityType: "Product",
      entityId: params.id,
      metadata: { name: existing.name },
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    const isForbidden = error instanceof Error && error.message.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized" },
      { status: isAuth ? 401 : isForbidden ? 403 : 500 }
    );
  }
}
