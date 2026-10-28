# Flash Solar Platform

High-efficiency, premium clean-energy web platform and storage architecture for **Flash Solar** (`flashsolar.org`).

Replaces the legacy WordPress application with a decoupled, enterprise-grade Next.js App Router application backed by PostgreSQL, Cloudflare R2, Resend, and Vercel edge deployment.

---

## Technical Stack & Compatibility

- **Framework:** Next.js 14.2.15 (App Router, React Server Components)
- **Runtime & Engine:** React 18.3.1, TypeScript 5.6, Node.js v24.14.1, npm v11.12.1
- **Styling & Tokens:** Tailwind CSS 3.4 with custom Deep Navy (`#0B192C`), Solar Gold (`#E5A93C`), and Clean Slate palettes
- **Validation & Safety:** Zod runtime environment schemas, `server-only` boundary guards
- **Testing:** Vitest 2.1 test runner

---

## Directory Structure

```
flashsolar-platform/
├── src/
│   ├── app/
│   │   ├── globals.css      # Design tokens, accessibility & motion rules
│   │   ├── layout.tsx       # Root layout, typography, meta viewport
│   │   ├── page.tsx         # Foundation page showcasing core offerings
│   │   ├── not-found.tsx    # Accessible branded 404 page
│   │   └── error.tsx        # Client-safe 500 error boundary
│   ├── env.ts               # Type-safe environment validation
│   ├── env.test.ts          # Environment and security test suite
│   └── lib/
│       ├── server-only.ts   # Server-side execution guard
│       └── utils.ts         # Utility class combination (clsx + tailwind-merge)
├── next.config.mjs          # Security headers & Next.js config
├── tailwind.config.ts       # Custom color tokens and font families
├── postcss.config.mjs       # Tailwind PostCSS runner
├── tsconfig.json            # Strict TypeScript configuration
├── vitest.config.ts         # Unit test configuration
├── package.json             # Validated dependency matrix
└── .gitignore               # Strict exclusion of secrets and backups
```

---

## Local Development & Validation

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Quality Checks
```bash
# Type check TypeScript without emitting files
npm run typecheck

# Run unit tests
npm test

# Run ESLint
npm run lint

# Compile production build
npm run build
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Architectural & Data Boundaries

1. **Legacy Backups:** The legacy WordPress archives (`Solar-BP-Files/`) and database dumps (`Solar SQL/`) remain strictly preserved, read-only, and untouched.
2. **Secrets Protection:** No credentials, API tokens, or database strings are tracked in this repository or exposed to client bundles.
3. **Mock Mode:** External services (PostgreSQL, R2, Resend) operate with safe mock fallbacks when live credentials are not present in `.env.local`.

