import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET() {
  try {
    const resources = db.getResources();
    return NextResponse.json({ success: true, resources });
  } catch (error) {
    console.error("Resources GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slug, action } = await req.json();
    if (slug && action === "download") {
      db.incrementResourceDownload(slug);
      db.addAnalyticsEvent({
        eventType: "RESOURCE_DOWNLOAD",
        path: `/resources/${slug}`,
        metadata: { slug },
      });
      return NextResponse.json({ success: true, message: "Download recorded" });
    }
    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Resource action error:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
