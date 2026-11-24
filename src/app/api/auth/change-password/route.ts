import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/store";
import { getSession, signSessionPayload, SESSION_COOKIE_NAME, SESSION_DURATION_HOURS } from "@/lib/auth/session";
import { comparePassword, hashPassword } from "@/lib/auth/password";

export const dynamic = "force-dynamic";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(12, "New password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must include at least one special character"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED: Active session required to update credentials." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid password format." },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;
    const user = db.getUserByEmail(session.email);

    if (!user) {
      return NextResponse.json({ success: false, error: "User account not found." }, { status: 404 });
    }

    const isCurrentValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, error: "New password cannot be identical to the temporary password." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);

    const updatedUser = db.upsertUser({
      ...user,
      passwordHash: newHash,
      mustChangePassword: false,
      updatedAt: new Date().toISOString(),
    });

    // Re-issue updated session cookie with mustChangePassword = false
    const token = signSessionPayload({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      mustChangePassword: false,
    });

    db.addAuditLog({
      userId: updatedUser.id,
      userName: updatedUser.name,
      action: "USER_PASSWORD_RESET",
      entityType: "User",
      entityId: updatedUser.id,
      metadata: { email: updatedUser.email, role: updatedUser.role, reason: "TEMPORARY_PASSWORD_ROTATED" },
    });

    const response = NextResponse.json({
      success: true,
      message: "Password updated successfully. You now have unrestricted administrator access.",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_HOURS * 3600,
    });

    return response;
  } catch (err: unknown) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to change password." },
      { status: 500 }
    );
  }
}
