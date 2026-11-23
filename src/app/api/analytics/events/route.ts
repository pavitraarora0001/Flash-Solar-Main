import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/store";

const eventSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  path: z.string().default("/"),
  entityId: z.string().optional(),
  referrer: z.string().optional(),
  deviceType: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid analytics payload" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const evt = db.addAnalyticsEvent({
      eventType: data.eventType,
      path: data.path,
      entityId: data.entityId,
      referrer: data.referrer,
      deviceType: data.deviceType,
      metadata: data.metadata,
    });

    return NextResponse.json({ success: true, eventId: evt.id });
  } catch (error) {
    console.error("Analytics beacon error:", error);
    return NextResponse.json({ success: false, error: "Failed to record event" }, { status: 500 });
  }
}
