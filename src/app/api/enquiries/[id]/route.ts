import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/store";
import { requireAuthSession } from "@/lib/auth/session";
import { EnquiryStatus, Role } from "@prisma/client";

const updateEnquirySchema = z.object({
  status: z.nativeEnum(EnquiryStatus).optional(),
  internalNotes: z.string().optional(),
  assignedToId: z.string().optional(),
  followUpDate: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuthSession(Role.VIEWER);
    const enquiry = db.getEnquiryById(params.id);

    if (!enquiry) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal error" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuthSession(Role.SALES_MANAGER);
    const body = await req.json();
    const parsed = updateEnquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid update data" },
        { status: 400 }
      );
    }

    const current = db.getEnquiryById(params.id);
    if (!current) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    const { status, internalNotes, assignedToId } = parsed.data;
    const updated = db.updateEnquiryStatus(
      params.id,
      status || current.status,
      internalNotes,
      assignedToId
    );

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "ENQUIRY_UPDATED",
      entityType: "Enquiry",
      entityId: params.id,
      metadata: {
        referenceNumber: current.referenceNumber,
        oldStatus: current.status,
        newStatus: status || current.status,
        notesUpdated: internalNotes !== undefined,
      },
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    const isAuth = error instanceof Error && (error.message.includes("UNAUTHORIZED") || error.message.includes("FORBIDDEN"));
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update enquiry" },
      { status: isAuth ? 403 : 500 }
    );
  }
}
