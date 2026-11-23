import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { requireAuthSession } from "@/lib/auth/session";
import { Role, EnquiryStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAuthSession(Role.VIEWER);

    const enquiries = db.getEnquiries();
    const products = db.getProducts();
    const messages = db.getContactMessages();
    const logs = db.getAuditLogs();
    const events = db.getAnalyticsEvents();

    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter((e) => e.status === EnquiryStatus.NEW).length;
    const contactedLeads = enquiries.filter((e) => e.status === EnquiryStatus.CONTACTED).length;
    const qualifiedLeads = enquiries.filter((e) => e.status === EnquiryStatus.QUALIFIED).length;
    const wonLeads = enquiries.filter((e) => e.status === EnquiryStatus.WON).length;

    const unreadMessages = messages.filter((m) => m.status === "UNREAD").length;

    // Monthly lead distribution (mocking or group by date)
    const statusDistribution = {
      NEW: newEnquiries,
      CONTACTED: contactedLeads,
      QUALIFIED: qualifiedLeads,
      PROPOSAL_SENT: enquiries.filter((e) => e.status === EnquiryStatus.PROPOSAL_SENT).length,
      NEGOTIATION: enquiries.filter((e) => e.status === EnquiryStatus.NEGOTIATION).length,
      WON: wonLeads,
      LOST: enquiries.filter((e) => e.status === EnquiryStatus.LOST).length,
    };

    return NextResponse.json({
      success: true,
      metrics: {
        totalEnquiries,
        newEnquiries,
        qualifiedLeads,
        wonLeads,
        totalProducts: products.length,
        totalMessages: messages.length,
        unreadMessages,
        totalEvents: events.length,
        statusDistribution,
        recentEnquiries: enquiries.slice(0, 5),
        recentLogs: logs.slice(0, 10),
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
