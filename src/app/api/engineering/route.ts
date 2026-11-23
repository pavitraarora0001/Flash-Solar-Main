import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const stages = db.getEngineeringStages();
  return NextResponse.json({ success: true, stages });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role === Role.VIEWER) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Engineering editing permissions required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.stageNumber || !body.title || !body.description) {
      return NextResponse.json({ success: false, error: "Stage number, title, and description are required." }, { status: 400 });
    }

    const saved = db.saveEngineeringStage({
      id: body.id || `stg_0${body.stageNumber}`,
      stageNumber: Number(body.stageNumber),
      slug: body.slug || `stage-${body.stageNumber}`,
      title: body.title,
      badge: body.badge || `STAGE 0${body.stageNumber}`,
      subtitle: body.subtitle || "",
      description: body.description,
      technicalDetails: body.technicalDetails || "",
      imageUrl: body.imageUrl || "/images/solar-photovoltaic-generation.jpg",
      voltageBus: body.voltageBus,
      efficiencyMetric: body.efficiencyMetric,
      specs: Array.isArray(body.specs) ? body.specs : [],
      animationLabel: body.animationLabel || `STAGE 0${body.stageNumber}`,
      displayOrder: Number(body.displayOrder ?? body.stageNumber),
      isVisible: body.isVisible ?? true,
      status: body.status || "PUBLISHED",
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "ENGINEERING_STAGE_UPDATED",
      entityType: "EngineeringStage",
      entityId: saved.id,
      metadata: { stageNumber: saved.stageNumber, title: saved.title },
    });

    return NextResponse.json({ success: true, stage: saved });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to save stage" }, { status: 500 });
  }
}
