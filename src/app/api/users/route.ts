import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Active administrator session required." }, { status: 401 });
  }
  if (session.role !== Role.SUPER_ADMIN && session.role !== Role.ADMIN) {
    return NextResponse.json({ success: false, error: "FORBIDDEN: Super Admin or Admin role required." }, { status: 403 });
  }

  const users = db.getUsers();
  return NextResponse.json({ success: true, users });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Active administrator session required." }, { status: 401 });
  }
  if (session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ success: false, error: "FORBIDDEN: Only Super Administrators can invite new team members." }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.email || !body.password || !body.name || !body.role) {
      return NextResponse.json({ success: false, error: "Email, password, name, and role are required." }, { status: 400 });
    }

    if (body.password.length < 12) {
      return NextResponse.json({ success: false, error: "Password must be at least 12 characters." }, { status: 400 });
    }

    const existing = db.getUserByEmail(body.email);
    if (existing) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 400 });
    }

    const passwordHash = await hashPassword(body.password);
    const newUser = db.upsertUser({
      id: `usr_${Date.now()}`,
      email: body.email.toLowerCase().trim(),
      passwordHash,
      name: body.name,
      company: body.company || "Flash Solar",
      phone: body.phone,
      role: body.role as Role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "USER_CREATED",
      entityType: "User",
      entityId: newUser.id,
      metadata: { email: newUser.email, role: newUser.role },
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to create user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Only Super Administrators can modify roles." }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
    }

    const user = db.getUserById(body.id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Protect against self-demotion or self-lockout
    if (user.id === session.userId && body.role && body.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: "Cannot demote your own Super Admin role." }, { status: 400 });
    }

    let passwordHash = user.passwordHash;
    if (body.newPassword && body.newPassword.length >= 12) {
      passwordHash = await hashPassword(body.newPassword);
    }

    const updated = db.upsertUser({
      ...user,
      role: body.role || user.role,
      isActive: body.isActive !== undefined ? body.isActive : user.isActive,
      name: body.name || user.name,
      phone: body.phone !== undefined ? body.phone : user.phone,
      passwordHash,
      updatedAt: new Date().toISOString(),
    });

    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "USER_MODIFIED",
      entityType: "User",
      entityId: user.id,
      metadata: { role: updated.role, isActive: updated.isActive },
    });

    const { passwordHash: _, ...safeUser } = updated;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED: Only Super Administrators can delete team accounts." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    if (id === session.userId) {
      return NextResponse.json({ success: false, error: "Cannot delete your own active account." }, { status: 400 });
    }

    db.deleteUser(id);
    db.addAuditLog({
      userId: session.userId,
      userName: session.name,
      action: "USER_DELETED",
      entityType: "User",
      entityId: id,
    });

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to delete" }, { status: 500 });
  }
}
