import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { prisma } from "@/lib/db/prisma";
import { requireAuthSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    await requireAuthSession(Role.ADMIN);
    const settings = db.getSettings();

    // Diagnostics
    const products = db.getProducts();
    const enquiries = db.getEnquiries();
    const media = db.getMediaAssets();
    const posts = db.getPosts();
    const leads = db.getEnquiries();

    // Probe PostgreSQL availability
    let postgresStatus = "UNAVAILABLE";
    let postgresDetail = "Port 5433 unreachable. Docker Desktop daemon is stopped.";
    if (process.env.DATABASE_URL) {
      try {
        await Promise.race([
          prisma.$queryRaw`SELECT 1`,
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout (2000ms)")), 2000)),
        ]);
        postgresStatus = "CONNECTED";
        postgresDetail = "PostgreSQL 16 active and responsive.";
      } catch (pgErr) {
        postgresStatus = "DISCONNECTED";
        postgresDetail = pgErr instanceof Error ? pgErr.message : "Connection failed";
      }
    }

    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptimeSeconds: Math.round(process.uptime()),
      databaseType: "PostgreSQL Ready (Engine: Docker Compose port 5433) / Controlled Local Backup Active",
      postgresStatus,
      postgresDetail,
      counts: {
        products: products.length,
        enquiries: enquiries.length,
        mediaAssets: media.length,
        blogPosts: posts.length,
        leads: leads.length,
      },
      health: postgresStatus === "CONNECTED" ? "HEALTHY" : "DEGRADED_DATABASE_BLOCKED",
      environment: process.env.NODE_ENV || "development",
    };

    return NextResponse.json({ success: true, settings, system: systemInfo });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    const isForbidden = error instanceof Error && error.message.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized" },
      { status: isAuth ? 401 : isForbidden ? 403 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession(Role.ADMIN);
    const body = await req.json();

    if (body.action === "backup") {
      // Export full DB snapshot
      const snapshot = {
        exportedAt: new Date().toISOString(),
        exportedBy: session.name,
        data: {
          products: db.getProducts(),
          categories: db.getCategories(),
          services: db.getServices(),
          pages: db.getPages(),
          engineeringStages: db.getEngineeringStages(),
          enquiries: db.getEnquiries(),
          contactMessages: db.getContactMessages(),
          blogPosts: db.getPosts(),
          resources: db.getResources(),
          testimonials: db.getTestimonials(),
          faqs: db.getFaqs(),
          mediaAssets: db.getMediaAssets(),
          settings: db.getSettings(),
        },
      };

      db.addAuditLog({
        userId: session.userId,
        userName: session.name,
        action: "DATABASE_BACKUP_EXPORTED",
        entityType: "System",
        entityId: "backup",
      });

      return NextResponse.json({ success: true, backup: snapshot });
    }

    const { settings } = body;
    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, error: "Settings array is required" },
        { status: 400 }
      );
    }

    for (const item of settings) {
      if (item.key && item.value !== undefined) {
        db.updateSetting(item.key, String(item.value), item.group || "general", item.description);
      }
    }

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "SETTINGS_UPDATED",
      entityType: "SiteSettings",
      entityId: "general",
      metadata: { count: settings.length },
    });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: db.getSettings(),
    });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    const isForbidden = error instanceof Error && error.message.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized" },
      { status: isAuth ? 401 : isForbidden ? 403 : 500 }
    );
  }
}
