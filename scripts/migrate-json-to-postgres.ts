import fs from "fs";
import path from "path";
import { PrismaClient, Role, PublishStatus, EnquiryStatus, MessageStatus, LeadPriority } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateJsonToPostgres() {
  console.log("================================================================");
  console.log("FLASH SOLAR — COMPLETE JSON TO POSTGRESQL DATA MIGRATION");
  console.log("================================================================");

  const storePath = path.resolve(process.cwd(), "src/data/db-store.json");
  const backupPath = path.resolve(process.cwd(), `src/data/db-store.backup.${Date.now()}.json`);

  if (!fs.existsSync(storePath)) {
    console.error(`ERROR: JSON store file not found at ${storePath}`);
    process.exit(1);
  }

  // 1. Create safety backup
  fs.copyFileSync(storePath, backupPath);
  console.log(`[Safety Backup] Created snapshot at: ${backupPath}`);

  const raw = fs.readFileSync(storePath, "utf-8");
  const store = JSON.parse(raw);

  // 2. Verify PostgreSQL connection
  try {
    await prisma.$connect();
    console.log("[Connection] Successfully connected to PostgreSQL instance.");
  } catch (err) {
    console.error("[Connection Error] Unable to connect to PostgreSQL:", err);
    console.log("Ensure PostgreSQL is running and DATABASE_URL is properly configured.");
    process.exit(1);
  }

  // 3. Migrate Users (deduped by email)
  console.log(`\nMigrating Users (total in JSON: ${store.users?.length || 0})...`);
  let migratedUsers = 0;
  for (const u of store.users || []) {
    await prisma.user.upsert({
      where: { email: u.email.toLowerCase() },
      update: {
        name: u.name,
        passwordHash: u.passwordHash,
        role: u.role,
        isActive: u.isActive,
        company: u.company,
        phone: u.phone,
        updatedAt: new Date(u.updatedAt || Date.now()),
      },
      create: {
        id: u.id,
        email: u.email.toLowerCase(),
        passwordHash: u.passwordHash,
        name: u.name,
        company: u.company,
        phone: u.phone,
        role: u.role,
        isActive: u.isActive,
        createdAt: new Date(u.createdAt || Date.now()),
        updatedAt: new Date(u.updatedAt || Date.now()),
      },
    });
    migratedUsers++;
  }
  console.log(`[Users] Upserted ${migratedUsers} users.`);

  // 4. Migrate Product Categories
  console.log(`\nMigrating Product Categories (${store.productCategories?.length || 0})...`);
  for (const cat of store.productCategories || []) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, displayOrder: cat.displayOrder },
      create: {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        displayOrder: cat.displayOrder,
      },
    });
  }

  // 5. Migrate Products
  console.log(`\nMigrating Products (${store.products?.length || 0})...`);
  let migratedProducts = 0;
  for (const p of store.products || []) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId: p.categoryId,
        sku: p.sku,
        summary: p.summary,
        description: p.description,
        status: p.status,
        featured: p.featured,
        displayOrder: p.displayOrder,
        specifications: p.specifications,
        features: p.features,
        galleryImages: p.galleryImages,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        updatedAt: new Date(p.updatedAt || Date.now()),
      },
      create: {
        id: p.id,
        slug: p.slug,
        categoryId: p.categoryId,
        name: p.name,
        sku: p.sku,
        summary: p.summary,
        description: p.description,
        status: p.status,
        featured: p.featured,
        displayOrder: p.displayOrder,
        specifications: p.specifications,
        features: p.features,
        galleryImages: p.galleryImages,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        createdAt: new Date(p.createdAt || Date.now()),
        updatedAt: new Date(p.updatedAt || Date.now()),
      },
    });
    migratedProducts++;
  }
  console.log(`[Products] Upserted ${migratedProducts} products.`);

  // 6. Migrate Enquiries
  console.log(`\nMigrating Leads & Enquiries (${store.enquiries?.length || 0})...`);
  let migratedEnquiries = 0;
  for (const e of store.enquiries || []) {
    await prisma.enquiry.upsert({
      where: { referenceNumber: e.referenceNumber },
      update: {
        status: e.status as EnquiryStatus,
        priority: (e.priority as LeadPriority) || LeadPriority.MEDIUM,
        internalNotes: e.internalNotes,
        assignedToId: e.assignedToId,
        followUpDate: e.followUpDate ? new Date(e.followUpDate) : null,
        updatedAt: new Date(e.updatedAt || Date.now()),
      },
      create: {
        id: e.id,
        referenceNumber: e.referenceNumber,
        fullName: e.fullName,
        company: e.company,
        email: e.email,
        phone: e.phone,
        country: e.country || "Global",
        city: e.city,
        productOfInterest: e.productOfInterest,
        projectType: e.projectType,
        estimatedPowerReq: e.estimatedPowerReq,
        estimatedDailyEnergy: e.estimatedDailyEnergy,
        message: e.message,
        privacyConsent: e.privacyConsent ?? true,
        status: (e.status as EnquiryStatus) || EnquiryStatus.NEW,
        priority: (e.priority as LeadPriority) || LeadPriority.MEDIUM,
        assignedToId: e.assignedToId,
        internalNotes: e.internalNotes,
        createdAt: new Date(e.createdAt || Date.now()),
        updatedAt: new Date(e.updatedAt || Date.now()),
      },
    });
    migratedEnquiries++;
  }
  console.log(`[Enquiries] Upserted ${migratedEnquiries} engineering inquiries.`);

  // 7. Migrate Contact Messages
  console.log(`\nMigrating Contact Messages (${store.contactMessages?.length || 0})...`);
  let migratedMessages = 0;
  for (const m of store.contactMessages || []) {
    await prisma.contactMessage.upsert({
      where: { referenceNumber: m.referenceNumber },
      update: { status: m.status as MessageStatus, internalNotes: m.internalNotes, updatedAt: new Date(m.updatedAt || Date.now()) },
      create: {
        id: m.id,
        referenceNumber: m.referenceNumber,
        name: m.name,
        email: m.email,
        phone: m.phone,
        subject: m.subject,
        message: m.message,
        status: (m.status as MessageStatus) || MessageStatus.UNREAD,
        internalNotes: m.internalNotes,
        createdAt: new Date(m.createdAt || Date.now()),
        updatedAt: new Date(m.updatedAt || Date.now()),
      },
    });
    migratedMessages++;
  }
  console.log(`[Contact Messages] Upserted ${migratedMessages} communications.`);

  // 8. Migrate Technical Resources
  console.log(`\nMigrating Technical Resources (${store.resources?.length || 0})...`);
  for (const r of store.resources || []) {
    const slug = r.slug || r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.technicalResource.upsert({
      where: { slug },
      update: {
        title: r.title,
        summary: r.summary || r.description || "",
        fileUrl: r.fileUrl,
        downloadCount: r.downloadCount || 0,
      },
      create: {
        id: r.id,
        slug,
        title: r.title,
        resourceType: r.resourceType || "DATASHEET",
        summary: r.summary || r.description || "",
        fileUrl: r.fileUrl,
        fileSize: typeof r.fileSizeMb === "number" ? `${r.fileSizeMb} MB` : (r.fileSize || "1.5 MB"),
        downloadCount: r.downloadCount || 0,
        createdAt: new Date(r.createdAt || Date.now()),
      },
    });
  }

  // 9. Migrate Settings
  console.log(`\nMigrating Site Settings (${store.settings?.length || 0})...`);
  for (const s of store.settings || []) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description, group: s.group || "general" },
      create: {
        id: `set_${s.key}`,
        key: s.key,
        value: s.value,
        group: s.group || "general",
        description: s.description,
        updatedAt: new Date(s.updatedAt || Date.now()),
      },
    });
  }

  // 10. Summary Verification
  const [
    pgUsers,
    pgProducts,
    pgCategories,
    pgEnquiries,
    pgMessages,
    pgResources,
    pgSettings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.productCategory.count(),
    prisma.enquiry.count(),
    prisma.contactMessage.count(),
    prisma.technicalResource.count(),
    prisma.siteSetting.count(),
  ]);

  console.log("\n================================================================");
  console.log("POSTGRESQL RECORD COUNT VERIFICATION SUMMARY");
  console.log("================================================================");
  console.log(`Users: JSON=${store.users?.length || 0} | PostgreSQL=${pgUsers}`);
  console.log(`Products: JSON=${store.products?.length || 0} | PostgreSQL=${pgProducts}`);
  console.log(`Categories: JSON=${store.productCategories?.length || 0} | PostgreSQL=${pgCategories}`);
  console.log(`Enquiries: JSON=${store.enquiries?.length || 0} | PostgreSQL=${pgEnquiries}`);
  console.log(`Contact Messages: JSON=${store.contactMessages?.length || 0} | PostgreSQL=${pgMessages}`);
  console.log(`Resources: JSON=${store.resources?.length || 0} | PostgreSQL=${pgResources}`);
  console.log(`Settings: JSON=${store.settings?.length || 0} | PostgreSQL=${pgSettings}`);
  console.log("================================================================");
}

migrateJsonToPostgres()
  .catch((err) => {
    console.error("Migration fatal error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
