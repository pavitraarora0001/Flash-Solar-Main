import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { requireAuthSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAuthSession(Role.VIEWER);

    const events = db.getAnalyticsEvents();
    const totalEvents = events.length;

    const pageViews = events.filter((e) => e.eventType === "PAGE_VIEW").length;
    const ctaClicks = events.filter((e) => e.eventType === "CTA_CLICK").length;
    const enquirySubmits = events.filter((e) => e.eventType === "ENQUIRY_SUBMIT").length;
    const resourceDownloads = events.filter((e) => e.eventType === "RESOURCE_DOWNLOAD").length;

    // By path counts
    const pathCounts: Record<string, number> = {};
    events.forEach((e) => {
      pathCounts[e.path] = (pathCounts[e.path] || 0) + 1;
    });

    // By device counts
    const deviceCounts: Record<string, number> = {};
    events.forEach((e) => {
      const dev = e.deviceType || "desktop";
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    });

    // Conversion rate
    const conversionRate = pageViews > 0 ? ((enquirySubmits / pageViews) * 100).toFixed(1) + "%" : "0%";

    return NextResponse.json({
      success: true,
      summary: {
        totalEvents,
        pageViews,
        ctaClicks,
        enquirySubmits,
        resourceDownloads,
        conversionRate,
        topPaths: Object.entries(pathCounts)
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        devices: deviceCounts,
      },
    });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
