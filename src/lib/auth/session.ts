import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import crypto from "crypto";

export const SESSION_COOKIE_NAME = "flashsolar_admin_session";
export const SESSION_DURATION_HOURS = 24;

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  expiresAt: string;
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  CONTENT_MANAGER: 3,
  SALES_MANAGER: 2,
  VIEWER: 1,
};

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function signSessionPayload(payload: Omit<SessionPayload, "expiresAt">): string {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 3600 * 1000).toISOString();
  const fullPayload: SessionPayload = { ...payload, expiresAt };
  const jsonStr = JSON.stringify(fullPayload);
  const base64 = Buffer.from(jsonStr).toString("base64url");
  const secret = process.env.NEXTAUTH_SECRET || "flashsolar_dev_secure_session_secret_key_2026";
  const hmac = crypto.createHmac("sha256", secret).update(base64).digest("hex");
  return `${base64}.${hmac}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [base64, signature] = parts;
    const secret = process.env.NEXTAUTH_SECRET || "flashsolar_dev_secure_session_secret_key_2026";
    const expectedSig = crypto.createHmac("sha256", secret).update(base64).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSig, "hex"))) {
      return null;
    }
    const jsonStr = Buffer.from(base64, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as SessionPayload;
    if (new Date(payload.expiresAt).getTime() < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAuthSession(minRole: Role = Role.VIEWER): Promise<SessionPayload> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Active administrator session required.");
  }
  if (!hasPermission(session.role, minRole)) {
    throw new Error("FORBIDDEN: Insufficient administrative privileges.");
  }
  return session;
}
