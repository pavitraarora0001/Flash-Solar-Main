import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/store";
import { getCurrentSession, requireAuthSession } from "@/lib/auth/session";
import { Role, PublishStatus } from "@prisma/client";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name required"),
  slug: z.string().min(2, "Slug required"),
  categoryId: z.string().default("cat_storage"),
  summary: z.string().min(5, "Summary required"),
  description: z.string().min(10, "Description required"),
  sku: z.string().optional(),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
  featured: z.boolean().default(false),
  displayOrder: z.number().default(1),
  specifications: z.record(z.string()).default({}),
  features: z.array(z.string()).default([]),
  galleryImages: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getCurrentSession();
    const allProducts = db.getProducts();

    // If unauthenticated visitor, only show published products
    if (!session) {
      const published = allProducts.filter((p) => p.status === PublishStatus.PUBLISHED);
      return NextResponse.json({ success: true, products: published });
    }

    return NextResponse.json({ success: true, products: allProducts });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession(Role.CONTENT_MANAGER);
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const id = data.id || `prod_${Date.now()}`;
    const product = db.saveProduct({
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "PRODUCT_CREATED",
      entityType: "Product",
      entityId: product.id,
      metadata: { name: product.name, slug: product.slug },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
