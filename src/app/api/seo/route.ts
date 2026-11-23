import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const pages = db.getPages();
  const settings = db.getSettings();

  const seoData = {
    siteName: db.getSettings().find((s) => s.key === "site_name")?.value || "Flash Solar",
    defaultTitle: pages.find((p) => p.slug === "home")?.metaTitle || "Flash Solar | High-Efficiency Direct-Current Energy Architecture",
    defaultDescription: pages.find((p) => p.slug === "home")?.metaDescription || "Pioneering sub-60V touch-safe direct current microgrids and high-density LiFePO4 battery energy storage systems.",
    canonicalUrl: "https://flashsolar.org",
    robotsIndex: true,
    sitemapUrl: "https://flashsolar.org/sitemap.xml",
    pages: pages.map((p) => ({
      slug: p.slug,
      title: p.title,
      metaTitle: p.metaTitle || p.title,
      metaDescription: p.metaDescription || p.summary || "",
      ogImageUrl: p.ogImageUrl || "/images/solar-photovoltaic-generation.jpg",
    })),
  };

  return NextResponse.json({ success: true, seo: seoData });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === Role.VIEWER) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: SEO permissions required." }, { status: 403 });
  }

  try {
    const body = await req.json();

    if (body.defaultTitle) {
      db.updateSetting("seo_default_title", body.defaultTitle, "seo", "Default meta title for search engines");
    }
    if (body.defaultDescription) {
      db.updateSetting("seo_default_desc", body.defaultDescription, "seo", "Default meta description");
    }

    if (body.slug && body.metaTitle) {
      const page = db.getPageBySlug(body.slug);
      if (page) {
        db.savePage({
          ...page,
          metaTitle: body.metaTitle,
          metaDescription: body.metaDescription,
          ogImageUrl: body.ogImageUrl,
        });
      }
    }

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "SEO_UPDATED",
      entityType: "SEOSetting",
      metadata: { slug: body.slug || "global" },
    });

    return NextResponse.json({ success: true, message: "SEO settings saved and sitemap updated." });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to save SEO" }, { status: 500 });
  }
}
