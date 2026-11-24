import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }
    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
        mustChangePassword: session.mustChangePassword ?? false,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
