import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/store";
import { comparePassword } from "@/lib/auth/password";
import { signSessionPayload, SESSION_COOKIE_NAME, SESSION_DURATION_HOURS } from "@/lib/auth/session";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const user = db.getUserByEmail(email);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials or account inactive" },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signSessionPayload({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: user.mustChangePassword ?? false,
    });

    db.addAuditLog({
      userId: user.id,
      userName: user.name,
      action: "USER_LOGIN",
      entityType: "User",
      entityId: user.id,
      metadata: { email: user.email, role: user.role, mustChangePassword: user.mustChangePassword ?? false },
    });

    const response = NextResponse.json({
      success: true,
      mustChangePassword: user.mustChangePassword ?? false,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword ?? false,
      },
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
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal authentication error" },
      { status: 500 }
    );
  }
}
