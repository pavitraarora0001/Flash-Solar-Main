import crypto from "crypto";
import { db, DBUser } from "../src/lib/db/store";
import { hashPassword } from "../src/lib/auth/password";
import { Role } from "@prisma/client";

async function bootstrapAdmin() {
  const args = process.argv.slice(2);
  let email = process.env.ADMIN_INITIAL_EMAIL || "admin@flashsolar.org";
  let password = process.env.ADMIN_INITIAL_PASSWORD;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email" && args[i + 1]) {
      email = args[i + 1];
      i++;
    } else if (args[i] === "--password" && args[i + 1]) {
      password = args[i + 1];
      i++;
    }
  }

  let generated = false;
  if (!password) {
    // Generate high-entropy 20-character base64url password
    password = crypto.randomBytes(15).toString("base64url") + "!9A";
    generated = true;
  }

  if (password.length < 12) {
    console.error("ERROR: Administrator password must be at least 12 characters.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const existing = db.getUserByEmail(email);

  const now = new Date().toISOString();
  const adminUser: DBUser = {
    id: existing?.id || `usr_superadmin_${Date.now()}`,
    email: email.toLowerCase().trim(),
    passwordHash,
    name: "Flash Solar Administrator",
    company: "Flash Solar Engineering Desk",
    role: Role.SUPER_ADMIN,
    isActive: true,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  db.upsertUser(adminUser);

  db.addAuditLog({
    userId: adminUser.id,
    userName: adminUser.name,
    action: "ADMIN_CREDENTIAL_ROTATED",
    entityType: "User",
    entityId: adminUser.id,
    metadata: {
      email: adminUser.email,
      role: adminUser.role,
      rotatedAt: now,
      method: generated ? "GENERATED_RANDOM" : "ENVIRONMENT_OR_CLI_CONFIGURED",
    },
  });

  console.log("================================================================");
  console.log("FLASH SOLAR — SECURE ADMINISTRATOR BOOTSTRAP / CREDENTIAL ROTATION");
  console.log("================================================================");
  console.log(`Status: Administrator account successfully configured.`);
  console.log(`Account Email: ${adminUser.email}`);
  console.log(`Role: ${adminUser.role}`);
  console.log(`Updated: ${now}`);
  if (generated) {
    console.log(`One-Time Generated Initial Password: ${password}`);
    console.log("IMPORTANT: Save this credential immediately. It will not be shown again.");
  } else {
    console.log("Password: Set securely via environment / input parameter.");
  }
  console.log("Audit Record: Logged as ADMIN_CREDENTIAL_ROTATED.");
  console.log("================================================================");
}

bootstrapAdmin().catch((err) => {
  console.error("Admin bootstrap failed:", err);
  process.exit(1);
});
