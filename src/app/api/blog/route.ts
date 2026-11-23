import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = db.getBlogPosts();
  const categories = db.getBlogCategories();
  return NextResponse.json({ success: true, posts, categories });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === Role.VIEWER) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Content editing permissions required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ success: false, error: "Article title and slug are required." }, { status: 400 });
    }

    const saved = db.saveBlogPost({
      id: body.id || `post_${Date.now()}`,
      categoryId: body.categoryId || "bcat_01",
      authorId: session.userId,
      authorName: session.name || "Flash Solar Engineering",
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || "",
      content: body.content || "",
      status: body.status || "PUBLISHED",
      publishedAt: body.status === "PUBLISHED" ? (body.publishedAt || new Date().toISOString()) : undefined,
      featuredImage: body.featuredImage || "/images/solar-photovoltaic-generation.jpg",
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "BLOG_POST_SAVED",
      entityType: "BlogPost",
      entityId: saved.id,
      metadata: { title: saved.title, slug: saved.slug, status: saved.status },
    });

    return NextResponse.json({ success: true, post: saved });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to save blog post" }, { status: 500 });
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

    db.deleteBlogPost(id);
    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "BLOG_POST_DELETED",
      entityType: "BlogPost",
      entityId: id,
    });

    return NextResponse.json({ success: true, message: "Blog post deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to delete" }, { status: 500 });
  }
}
