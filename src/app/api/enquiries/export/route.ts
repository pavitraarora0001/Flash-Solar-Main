import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { requireAuthSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAuthSession(Role.SALES_MANAGER);

    const enquiries = db.getEnquiries();

    const headers = [
      "Reference",
      "Full Name",
      "Company",
      "Email",
      "Phone",
      "Country",
      "City",
      "Product of Interest",
      "Project Type",
      "Estimated Power",
      "Daily Energy",
      "Status",
      "Created At",
      "Internal Notes",
    ];

    const escapeCsv = (str: string | undefined | null) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = enquiries.map((e) => [
      escapeCsv(e.referenceNumber),
      escapeCsv(e.fullName),
      escapeCsv(e.company),
      escapeCsv(e.email),
      escapeCsv(e.phone),
      escapeCsv(e.country),
      escapeCsv(e.city),
      escapeCsv(e.productOfInterest),
      escapeCsv(e.projectType),
      escapeCsv(e.estimatedPowerReq),
      escapeCsv(e.estimatedDailyEnergy),
      escapeCsv(e.status),
      escapeCsv(new Date(e.createdAt).toISOString()),
      escapeCsv(e.internalNotes),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="flashsolar-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    const isAuth = error instanceof Error && error.message.includes("UNAUTHORIZED");
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized export request" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
