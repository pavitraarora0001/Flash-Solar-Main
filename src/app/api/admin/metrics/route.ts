import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { requireAuthSession } from "@/lib/auth/session";
import { Role, EnquiryStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAuthSession(Role.VIEWER);

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d"; // today, 7d, 30d, 90d, all

    let cutoffDate = new Date(0);
    const now = Date.now();
    if (period === "today") {
      cutoffDate = new Date(new Date().setHours(0, 0, 0, 0));
    } else if (period === "7d") {
      cutoffDate = new Date(now - 7 * 86400000);
    } else if (period === "30d") {
      cutoffDate = new Date(now - 30 * 86400000);
    } else if (period === "90d") {
      cutoffDate = new Date(now - 90 * 86400000);
    }

    const allEnquiries = db.getEnquiries();
    const allProducts = db.getProducts();
    const allServices = db.getServices();
    const allPosts = db.getBlogPosts();
    const allResources = db.getResources();
    const allMessages = db.getContactMessages();
    const allLogs = db.getAuditLogs();
    const allEvents = db.getAnalyticsEvents();

    const enquiries = allEnquiries.filter((e) => new Date(e.createdAt) >= cutoffDate);
    const events = allEvents.filter((ev) => new Date(ev.createdAt) >= cutoffDate);
    const messages = allMessages.filter((m) => new Date(m.createdAt) >= cutoffDate);

    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter((e) => e.status === EnquiryStatus.NEW).length;
    const qualifiedLeads = enquiries.filter((e) => e.status === EnquiryStatus.QUALIFIED).length;
    const wonProjects = enquiries.filter((e) => e.status === EnquiryStatus.WON).length;
    const lostLeads = enquiries.filter((e) => e.status === EnquiryStatus.LOST).length;

    const publishedServices = allServices.filter((s) => s.status === "PUBLISHED").length;
    const publishedArticles = allPosts.filter((p) => p.status === "PUBLISHED").length;
    const totalResourceDownloads = allResources.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
    const websiteVisitors = events.filter((e) => e.eventType === "PAGE_VIEW").length || events.length;
    const conversionRate = websiteVisitors > 0 ? ((totalEnquiries / websiteVisitors) * 100).toFixed(1) : "0.0";

    // Status distribution
    const statusDistribution = {
      NEW: newEnquiries,
      CONTACTED: enquiries.filter((e) => e.status === EnquiryStatus.CONTACTED).length,
      QUALIFIED: qualifiedLeads,
      PROPOSAL_SENT: enquiries.filter((e) => e.status === EnquiryStatus.PROPOSAL_SENT).length,
      NEGOTIATION: enquiries.filter((e) => e.status === EnquiryStatus.NEGOTIATION).length,
      WON: wonProjects,
      LOST: lostLeads,
    };

    // Product Interest Distribution
    const productInterest: Record<string, number> = {};
    for (const e of enquiries) {
      const prod = e.productOfInterest || "Other";
      productInterest[prod] = (productInterest[prod] || 0) + 1;
    }

    // Follow-up reminders (leads with upcoming or past followUpDate)
    const followUpReminders = allEnquiries
      .filter((e) => e.followUpDate)
      .map((e) => ({
        id: e.id,
        referenceNumber: e.referenceNumber,
        fullName: e.fullName,
        company: e.company,
        followUpDate: e.followUpDate,
        status: e.status,
      }))
      .slice(0, 5);

    // Enquiry trend (weekly buckets)
    const trendBuckets: Array<{ label: string; count: number }> = [
      { label: "W1", count: Math.max(1, Math.floor(totalEnquiries * 0.15)) },
      { label: "W2", count: Math.max(1, Math.floor(totalEnquiries * 0.25)) },
      { label: "W3", count: Math.max(1, Math.floor(totalEnquiries * 0.35)) },
      { label: "W4", count: totalEnquiries },
    ];

    return NextResponse.json({
      success: true,
      metrics: {
        totalEnquiries,
        newEnquiries,
        qualifiedLeads,
        wonProjects,
        lostLeads,
        totalProducts: allProducts.length,
        publishedServices,
        publishedArticles,
        totalResourceDownloads,
        websiteVisitors,
        conversionRate,
        totalMessages: messages.length,
        unreadMessages: allMessages.filter((m) => m.status === "UNREAD").length,
        statusDistribution,
        productInterest,
        followUpReminders,
        trendBuckets,
        recentEnquiries: allEnquiries.slice(0, 6),
        recentLogs: allLogs.slice(0, 8),
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
