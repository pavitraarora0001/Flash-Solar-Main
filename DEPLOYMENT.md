# FLASH SOLAR PLATFORM — PRODUCTION DEPLOYMENT & INFRASTRUCTURE RUNBOOK

This operational runbook provides full-stack deployment instructions for deploying the **Flash Solar Platform** to **Vercel** and a managed **PostgreSQL** database cluster.

---

## 1. Architecture Overview

```
                                  [ User / Client Browser ]
                                              │
                                              ▼
                             [ Vercel Edge / Global CDN ]
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
            [ Next.js 14 App Router ]                     [ Static Assets / Images ]
            - Server Components                           - /images/solar-photovoltaic-generation.jpg
            - API Routes (/api/*)                         - /images/flash-power-wall.jpg
            - Admin Dashboard (/admin)                    - /images/logo.jpg
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
 [ Managed PostgreSQL 16 ]  [ Resend Transactional Email ]
 (Supabase / Neon / AWS RDS) - Notifications: info@flashsolar.org
                             - Confirmations: Customer Inbox
```

---

## 2. Production Environment Variables

Configure the following environment variables in the Vercel Dashboard (**Project Settings $\rightarrow$ Environment Variables**) or production `.env.production`:

| Variable Name | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | **Yes** | `https://flashsolar.org` | Canonical platform origin for OpenGraph, sitemaps, and reset URLs |
| `NODE_ENV` | **Yes** | `production` | Enables React production optimizations and secure cookie flags |
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@host:5432/flashsolar?sslmode=require` | Connection pool URL for Prisma ORM |
| `DIRECT_URL` | Optional | `postgresql://user:pass@host:5432/flashsolar?sslmode=require` | Direct connection for running Prisma migrations on pooled providers |
| `NEXTAUTH_SECRET` | **Yes** | *High-entropy 32+ character hex string* | Secret key used for signing administrative HMAC-SHA256 session tokens |
| `RESEND_API_KEY` | **Yes** | `re_123456789...` | Live Resend API key for dispatching transactional customer emails |
| `RESEND_FROM_EMAIL` | **Yes** | `Flash Solar <notifications@flashsolar.org>` | Verified DKIM/SPF sender identity |
| `COMPANY_NOTIFICATION_EMAIL`| **Yes** | `info@flashsolar.org` | Internal engineering desk destination for incoming leads |
| `ADMIN_INITIAL_EMAIL` | Optional | `admin@flashsolar.org` | Target email for bootstrap script |
| `ADMIN_INITIAL_PASSWORD` | Optional | *Strong password (min 16 chars)* | Initial bootstrap password (must be rotated upon first login) |

---

## 3. Database Provisioning & Prisma Migrations

### Step 3.1: Provisioning Managed PostgreSQL
Recommended providers:
1. **Neon Serverless PostgreSQL:** Instant branching, pooling, and autoscaling.
2. **Supabase PostgreSQL:** Managed PostgreSQL 15/16 with native pooling (PgBouncer on port 6543).
3. **AWS RDS / GCP Cloud SQL:** High availability enterprise PostgreSQL.

For local development via Docker:
```bash
docker compose -f docker-compose.postgres.yml up -d
```

### Step 3.2: Applying Database Migrations
Run Prisma migrations to deploy all 21 relational tables, foreign-key constraints, and indexes:

```bash
# In CI/CD or production deployment terminal:
npx prisma migrate deploy
```

The committed baseline migration is located at:
`prisma/migrations/20261123000000_init/migration.sql`

---

## 4. Admin Account Bootstrap & Credential Rotation

After database migrations are applied, initialize the initial `SUPER_ADMIN` account using the controlled bootstrap CLI:

```bash
# Option A: Supply credentials via environment variables
export ADMIN_INITIAL_EMAIL="admin@flashsolar.org"
export ADMIN_INITIAL_PASSWORD="YourStrongSecurePassword2026!"
npm run admin:bootstrap

# Option B: Pass arguments directly
npm run admin:bootstrap -- --email admin@flashsolar.org --password YourStrongSecurePassword2026!
```

*Note: The bootstrap script enforces bcrypt (12 rounds) and writes an immutable `ADMIN_CREDENTIAL_ROTATED` audit record.*

---

## 5. Data Migration from Local JSON Store

If transitioning existing leads, inquiries, and catalog items from the local development store:

```bash
# Migrates records from src/data/db-store.json to PostgreSQL
npm run db:migrate-json
```

**Safety Guarantees:**
* Automatically creates an immutable backup timestamp snapshot before executing.
* Deduplicates users by email and enquiries by unique tracking reference (`FS-2026-XXXX`).
* Never drops tables or truncates existing data.

---

## 6. Email & Domain DNS Verification (Resend)

To send live customer confirmations from `@flashsolar.org`:

1. In the [Resend Console](https://resend.com/domains), add domain `flashsolar.org`.
2. Configure DNS records on the domain registrar / Cloudflare:
   * **DKIM (CNAME):** `resend._domainkey.flashsolar.org`
   * **SPF (TXT):** `v=spf1 include:amazonses.com ~all`
   * **DMARC (TXT):** `v=DMARC1; p=none; rua=mailto:dmarc@flashsolar.org`
3. Generate an API Key with **Sending access** and save as `RESEND_API_KEY`.

---

## 7. Backup and Restore Process

### Automated PostgreSQL Dump
```bash
# Create compressed backup
pg_dump -h <HOST> -U <USER> -d flashsolar_db -F c -b -v -f "flashsolar_backup_$(date +%Y%m%d_%H%M%S).dump"

# Restore from backup
pg_restore -h <HOST> -U <USER> -d flashsolar_db -v -c "flashsolar_backup_YYYYMMDD_HHMMSS.dump"
```

### File-Backed Store Snapshot
```bash
# Create local timestamp backup
cp src/data/db-store.json src/data/db-store.backup.$(date +%s).json
```

---

## 8. Rollback & Disaster Recovery Procedures

1. **Frontend / Application Rollback:**
   * In Vercel: Go to **Deployments $\rightarrow$ Select Previous Successful Deployment $\rightarrow$ Instant Rollback**.
   * Next.js static assets and cached edge routes revert within 30 seconds globally.
2. **Database Rollback:**
   * If a migration fails, identify the migration version and execute:
     ```bash
     npx prisma migrate resolve --rolled-back "20261123000000_init"
     ```
3. **Session Revocation:**
   * If an administrative session secret is compromised, immediately rotate `NEXTAUTH_SECRET` in environment variables and redeploy. All active sessions will instantly invalidate.

---

## 9. Pre-Flight Production Launch Checklist

- [x] TypeScript compiler check passes with 0 errors (`npm run typecheck`).
- [x] Automated test suite passes 100% (`npm test`).
- [x] ESLint reports 0 warnings and 0 errors (`npm run lint`).
- [x] Production build compiles cleanly (`npm run build`).
- [x] All 13 API routes dynamically rendered on demand.
- [x] High-resolution product images optimized with `object-fit: cover` and responsive sizes.
- [x] Form submission returns verified tracking reference (`FS-2026-XXXX`).
- [x] Hardcoded credentials purged; bootstrap CLI functional.
- [ ] PostgreSQL connection string set in production environment variables (`DATABASE_URL`).
- [ ] Prisma migrations applied to production PostgreSQL (`npx prisma migrate deploy`).
- [ ] Initial admin bootstrapped via `npm run admin:bootstrap`.
- [ ] `RESEND_API_KEY` configured and domain verified.
