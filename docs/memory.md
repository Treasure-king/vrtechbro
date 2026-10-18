# 🧠 VRTechBro — Codebase Memory & Architectural Guide

> **⛔ CRITICAL RULE: NEVER read `.env.*` or `.env.local` files under ANY circumstance.**

> **Last Updated:** 2026-10-15  
> **Status:** Phases 1 to 6 Complete (6/10 Phases Complete)  
> **Purpose:** Single source of truth for repository structure, architecture, design system, database schemas, security posture, and roadmap.

---

## 📌 Executive Summary & Project Overview

- **Project Name:** VRTechBro
- **Brand / Studio:** Modern Full-Stack Digital Studio & Software Consultancy
- **Live URL:** [https://www.vrtechbro.com/](https://www.vrtechbro.com/)
- **Repository Type:** Next.js 15 App Router Full-Stack Web Application
- **Core Technology Stack:**
  - **Framework:** Next.js `16.4.2` (App Router, Turbopack enabled)
  - **Runtime & Language:** React `19.0.0`, TypeScript `^5` (Strict mode)
  - **Styling:** Tailwind CSS `v4` (CSS-first `@theme` with OKLCH color tokens) + ShadCN UI (new-york style)
  - **Backend & Database:** Supabase (`@supabase/supabase-js` `^2.50.5`) — PostgreSQL with RLS
  - **Transactional Email:** Resend (`resend` `^4.6.0`)
  - **Animation Engine:** Motion (`motion` `^12.23.3`, standardized imports via `motion/react`)
  - **Form Management & Validation:** `react-hook-form` `^7.60.0`, `@hookform/resolvers` `^5.1.1`, `zod` `^4.0.5`
  - **Toast Notifications:** Sonner (`sonner` `^2.0.6`)
  - **Icons:** Lucide React (`lucide-react` `^0.525.0`), React Icons (`react-icons` `^5.5.0`)
  - **Package Manager:** `npm` (with `package-lock.json`)
  - **Dev Server Command:** `npm run dev` (`next dev --turbopack`)
  - **Build Command:** `npm run build` (`next build`)
  - **Deployment Target:** Vercel

---

## 📦 Dependency Manifest

### Production Dependencies (`dependencies`)

| Package | Version | Purpose / Usage |
|---|---|---|
| `next` | `15.5.28` | Next.js App Router framework |
| `react` | `^19.0.0` | React core library |
| `react-dom` | `^19.0.0` | React DOM renderer |
| `@supabase/supabase-js` | `^2.50.5` | Supabase client for database queries (Server & Client) |
| `motion` | `^12.23.3` | Animation library (imported as `motion/react`) |
| `resend` | `^4.6.0` | Server-side SDK for transactional email delivery |
| `react-hook-form` | `^7.60.0` | High-performance form state management |
| `@hookform/resolvers` | `^5.1.1` | Zod resolver bridge for React Hook Form |
| `zod` | `^4.0.5` | TypeScript-first schema validation (Client forms + Server API routes) |
| `sonner` | `^2.0.6` | Toast notification component |
| `lucide-react` | `^0.525.0` | Primary modern icon library |
| `react-icons` | `^5.5.0` | Secondary icons (social media icons in footer, blog icons) |
| `class-variance-authority` | `^0.7.1` | Variant-driven component styling (ShadCN UI) |
| `clsx` | `^2.1.1` | Utility for constructing `className` strings |
| `tailwind-merge` | `^3.3.1` | Utility for merging Tailwind CSS classes safely |
| `next-themes` | `^0.4.6` | Theme management utility |
| `@radix-ui/react-dialog` | `^1.1.14` | Accessible modal dialog primitives (ShadCN) |
| `@radix-ui/react-label` | `^2.1.7` | Accessible form label primitives (ShadCN) |
| `@radix-ui/react-slot` | `^1.2.3` | Slot component for polymorphic element rendering (ShadCN Button) |

### Dev Dependencies (`devDependencies`)

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | `^4` | Tailwind CSS v4 compiler engine |
| `@tailwindcss/postcss` | `^4` | PostCSS plugin for Tailwind CSS v4 |
| `tw-animate-css` | `^1.3.5` | Animation utility classes for Tailwind |
| `typescript` | `^5` | TypeScript compiler |
| `@types/node` | `^20` | TypeScript definitions for Node.js |
| `@types/react` | `^19` | TypeScript definitions for React |
| `@types/react-dom` | `^19` | TypeScript definitions for React DOM |
| `eslint` | `^9` | JavaScript and TypeScript linter |
| `eslint-config-next` | `15.5.28` | ESLint configuration for Next.js (core Web Vitals) |
| `@eslint/eslintrc` | `^3` | ESLint FlatCompat compatibility bridge |
| `prettier` | `^3.6.2` | Code formatting engine |
| `prettier-plugin-tailwindcss` | `^0.6.14` | Automatic Tailwind class sorting plugin |

### Explicitly Removed / Cleaned Dependencies
- `@clerk/nextjs` — Uninstalled in Phase 1 (unused dead dependency; will re-evaluate for admin panel in Phase 10)
- `@react-three/drei`, `@react-three/fiber`, `three`, `@types/three` — Uninstalled in Phase 1 (to be cleanly reintroduced in Phase 8 during 3D model integration)

---

## 📂 Complete File & Directory Map

```
vrtechbro/
├── .env.local                  # ⛔ SENSITIVE: Never read or expose in context
├── .gitignore                  # Git ignore patterns (node_modules, .next, .env*, etc.)
├── components.json             # ShadCN UI configuration (new-york style, neutral base)
├── eslint.config.mjs           # Flat ESLint configuration extending next/core-web-vitals & next/typescript
├── memory.md                   # THIS FILE: Root codebase memory & architecture reference
├── next-env.d.ts               # Next.js TypeScript declarations
├── next.config.ts              # Next.js configuration (Security Headers + CSP)
├── package.json                # Project metadata, scripts, and dependency definitions
├── package-lock.json           # Exact dependency lockfile
├── postcss.config.mjs          # PostCSS configuration for @tailwindcss/postcss
├── prettier.config.js          # Prettier configuration (includes prettier-plugin-tailwindcss)
├── README.md                   # Project documentation
├── tsconfig.json               # TypeScript configuration with @/* path alias
│
├── app/                        # Next.js App Router root
│   ├── favicon.ico             # App icon asset
│   ├── logo.png                # Reference logo PNG
│   ├── vrtechbro-logo.png      # High-res OG metadata image
│   ├── globals.css             # Main stylesheet (@import "tailwindcss"; @theme tokens; ShadCN variables)
│   ├── layout.tsx              # Root Layout (Inter font, Navbar, Footer, Sonner Toaster, Root Organization JSON-LD)
│   ├── page.tsx                # Home Page (Async Server Component, SSR Supabase fetch, WebPage JSON-LD)
│   ├── not-found.tsx           # Custom 404 Page (Accessible, branded gradient CTA)
│   ├── error.tsx               # Client runtime error boundary ('use client', retry mechanism)
│   ├── robots.txt              # Search engine crawlers directive
│   ├── sitemap.xml             # Static XML sitemap
│   │
│   ├── about/
│   │   └── page.tsx            # About Us Page (SSR, Mission, Vision, Tech Stack, JSON-LD)
│   ├── blog/
│   │   ├── page.tsx            # Blog Listing (Async Server Component, Supabase fetch, Blog JSON-LD)
│   │   └── [slug]/
│   │       └── page.tsx        # Blog Detail (Async Server Component, generateMetadata, generateStaticParams, custom MD renderer)
│   ├── careers/
│   │   └── page.tsx            # Careers Page (SSR wrapper passing static job listings to CareersClient)
│   ├── contact/
│   │   └── page.tsx            # Contact Page (SSR, ContactForm integration, ContactPage JSON-LD)
│   ├── faq/
│   │   └── page.tsx            # FAQ Page (SSR, schema.org FAQPage structured data, details/summary accordion)
│   ├── portfolio/
│   │   └── page.tsx            # Portfolio Showcase Page (SSR placeholder; full revamp in Phase 9)
│   ├── privacy-policy/
│   │   └── page.tsx            # Privacy Policy (SSR, comprehensive policy text, canonical link)
│   ├── services/
│   │   ├── page.tsx            # Services Listing (Async Server Component, Supabase fetch, ServiceCard grid)
│   │   └── [slug]/
│   │       └── page.tsx        # Service Detail (SSR, generateMetadata, generateStaticParams, ServiceOverlay, Service JSON-LD)
│   ├── terms/
│   │   └── page.tsx            # Terms & Conditions (SSR, legal provisions, canonical link)
│   │
│   └── api/                    # Serverless API Route Handlers
│       ├── send-email/
│       │   └── route.ts        # POST: General contact form email dispatch (Zod, Rate-Limited, HTML-Escaped)
│       ├── enquiry-email/
│       │   └── route.ts        # POST: Service enquiry form email dispatch (Zod, Rate-Limited, HTML-Escaped)
│       └── career-apply/
│           └── route.ts        # POST: Job application with resume attachment (Zod, 5MB limit, PDF/DOC, Rate-Limited)
│
├── components/                 # Application Component Library
│   ├── navbar.tsx              # Sticky header with glassmorphism, responsive mobile drawer, active link indicators
│   ├── hero.tsx                # Hero section with animated headings, logo branding, and CTA button
│   ├── footer.tsx              # Accessible footer with navigation links, copyright, and social links
│   ├── service-card.tsx        # Service Card component (motion animations, iconMap dynamic resolution, schema.org)
│   ├── blog-card.tsx           # Blog Card component (motion animations, tag chips, formatted date, preview)
│   ├── contact-form.tsx        # Contact Form ('use client', React Hook Form + Zod, Sonner toast, contact info sidebar)
│   ├── TechTags.tsx            # Infinite scrolling tech stack marquee (CSS keyframe animation + ItemList JSON-LD)
│   ├── careers-client.tsx      # Careers Client component ('use client', job cards, application modal trigger)
│   ├── ServiceOverlay.tsx      # Service enquiry modal ('use client', Zod validation, budget/timeline selectors, Resend integration)
│   ├── CareerForm.tsx          # Job application modal ('use client', drag-and-drop resume upload, Zod validation, FormData)
│   │
│   └── ui/                     # ShadCN UI Base Primitives
│       ├── button.tsx          # Accessible Button component with CVA variants (default, destructive, outline, secondary, ghost, link)
│       ├── card.tsx            # Card structural primitives (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
│       ├── dialog.tsx          # Accessible Dialog / Modal wrapper based on Radix UI Dialog
│       ├── form.tsx            # Form primitives integrated with React Hook Form
│       ├── input.tsx           # Form input field with focus and state styling
│       ├── label.tsx           # Accessible label based on Radix UI Label
│       ├── sonner.tsx          # Toast notification provider configured for dark theme
│       └── textarea.tsx        # Form textarea element
│
├── lib/                        # Shared Utility Functions & Server Clients
│   ├── supabase.ts             # Supabase client instantiation (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
│   ├── helper.ts               # Lucide Icon mapping dictionary (`iconMap`) for dynamic string-based icons
│   ├── sanitize.ts             # HTML entity escaping utility (`escapeHtml`) to prevent injection/XSS in emails
│   ├── rate-limit.ts           # In-memory IP rate limiter (`checkRateLimit`) with configurable window and request limits
│   └── utils.ts                # Tailwind class merge helper (`cn` using `clsx` and `tailwind-merge`)
│
├── types/                      # TypeScript Interface Definitions
│   ├── service-card.ts         # `ServiceCardProps` interface with Supabase and UI field definitions
│   └── blog-card.ts            # `BlogCardProps` interface with SEO and blog post metadata definitions
│
├── public/                     # Static Assets
│   └── images/                 # Image assets for services, about page, and logos
│       ├── AboutUs.png
│       ├── IT.png
│       ├── artificial-intelligence.png
│       ├── automation.png
│       ├── cloud.png
│       ├── digital-marketing.png
│       ├── e-commerce.png
│       ├── mobile-apps.png
│       ├── seo.png
│       ├── ui-ux-design.png
│       ├── vrTechBro-bg-remove.png
│       ├── vrTechBro.png
│       └── website-development.png
│
├── (laterused)/                # Staged / Future modules
│   └── admin/                  # Administrative dashboard & CRUD interface (isolated from active build)
│       ├── layout.tsx
│       ├── page.tsx
│       ├── blogs/
│       ├── contacts/
│       └── services/
│
├── research/                   # In-depth architectural research & audit documentation
│   ├── concept.md              # Vision, storytelling architecture, 3D concepts, and differentiator analysis
│   ├── flaws.md                # Comprehensive audit of past architectural, SEO, security, and UI flaws
│   ├── memory.md               # Archived snapshot of codebase state
│   ├── philosophy.md           # The 7 core design and engineering principles
│   └── requirements.md         # Full Functional, Non-Functional, and Technical specifications
│
└── phases/                     # Development Phase Execution Guides (10-Phase Roadmap)
    ├── README.md               # Master phase index and governance rules
    ├── phase_1.md              # Phase 1: Architecture Repair (Completed)
    ├── phase_2.md              # Phase 2: Security Hardening (Completed)
    ├── phase_3.md              # Phase 3: Performance Optimization (Completed)
    ├── phase_4.md              # Phase 4: SEO Foundation (Completed)
    ├── phase_5.md              # Phase 5: Code Quality & DX (Completed)
    ├── phase_6.md              # Phase 6: Design System Revolution (Completed)
    ├── phase_7.md              # Phase 7: Page Redesign & Storytelling (In progress)
    ├── phase_8.md              # Phase 8: 3D Integration & Interactivity (Upcoming)
    ├── phase_9.md              # Phase 9: Portfolio & Showcase (Upcoming)
    └── phase_10.md             # Phase 10: Infrastructure & Launch (Upcoming)
```

---

## 🗄️ Database Architecture & Supabase Schemas

### Active Database Tables

#### 1. `services` Table
Stores custom IT and software development service offerings.
| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `UUID` | No (PK) | Unique service identifier |
| `title` | `text` / `varchar` | No | Service display title (e.g., "Full Stack Web Development") |
| `slug` | `text` / `varchar` | No (Unique) | URL slug for route `/services/[slug]` |
| `short_description` | `text` | Yes | Brief 1-2 sentence overview for cards and meta descriptions |
| `long_description` | `text` | Yes | Detailed service description shown on detail pages |
| `keywords` | `text[]` | Yes | Array of SEO keyword strings |
| `meta_title` | `text` | Yes | Custom page title for SEO override |
| `meta_description` | `text` | Yes | Custom meta description for SEO override |
| `content` | `text` | Yes | Rich body content or markdown |
| `icon` | `text` | Yes | Name of the Lucide icon (resolves through `lib/helper.ts` `iconMap`) |
| `image_url` | `text` | Yes | Image asset path (e.g., `/images/website-development.png`) |
| `category` | `text` | Yes | Grouping category (e.g., "Development", "Design", "Cloud") |
| `display_order` | `integer` | Yes | Sort priority order |
| `cta_label` | `text` | Yes | Text for action button (e.g., "Get Service") |
| `cta_enabled` | `boolean` | Yes | Whether the enquiry action button is active |
| `featured` | `boolean` | Yes | Whether displayed in featured section on homepage |
| `created_at` | `timestamptz` | No | Timestamp of creation |
| `updated_at` | `timestamptz` | Yes | Timestamp of last modification |

#### 2. `blogs` Table
Stores technical blog posts and developer articles.
| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `UUID` | No (PK) | Unique blog post identifier |
| `title` | `text` | No | Article headline |
| `slug` | `text` | No (Unique) | URL slug for route `/blog/[slug]` |
| `description` | `text` | No | Post excerpt and meta description |
| `content` | `text` | No | Article content in markdown/pseudo-markdown format |
| `keywords` | `text[]` | Yes | Target SEO keywords |
| `tags` | `text[]` | Yes | Category tag chips (e.g., `["Next.js", "React", "Supabase"]`) |
| `author` | `text` | Yes | Author name |
| `reading_time` | `integer` | Yes | Estimated reading time in minutes |
| `thumbnail` | `text` | Yes | Thumbnail image URL |
| `image_url` | `text` | Yes | Open Graph / Social share image URL |
| `published_at` | `timestamptz` | Yes | Official publication date |
| `updated_at` | `timestamptz` | Yes | Date of last update |

### Planned Database Tables (Phase 9 & 10 Roadmap)
- `projects`: Title, slug, description, case study markdown, tech stack, category, live URL, repo URL, media assets.
- `chrome_extensions`: Extension name, description, Chrome Web Store URL, install count, preview media.
- `npm_packages`: Package name, description, npm URL, GitHub repo URL, weekly downloads.
- `jobs`: Dynamic career listings replacing hardcoded arrays in `app/careers/page.tsx`.

---

## 🔒 Security Architecture (A+ Security Posture)

### 1. HTTP Security Headers (`next.config.ts`)
Applied to all routes `/(.*)`:
- **HSTS:** `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- **MIME Sniffing:** `X-Content-Type-Options: nosniff`
- **Clickjacking Protection:** `X-Frame-Options: DENY`
- **XSS Protection Filter:** `X-XSS-Protection: 1; mode=block`
- **Referrer Policy:** `Referrer-Policy: strict-origin-when-cross-origin`
- **Permissions Policy:** `camera=(), microphone=(), geolocation=(), browsing-topics=()`
- **Content Security Policy (CSP):**
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-inline' 'unsafe-eval'`
  - `style-src 'self' 'unsafe-inline'`
  - `img-src 'self' data: blob: https:`
  - `font-src 'self' data:`
  - `connect-src 'self' https://*.supabase.co`
  - `frame-ancestors 'none'`
  - `base-uri 'self'`
  - `form-action 'self'`

### 2. Server-Side Input Validation & Sanitization
- **Strict Zod Schemas:** Every API route parses and validates incoming payloads with Zod (`safeParse`). Invalid requests immediately return `400 Bad Request` with structured field errors.
- **XSS Sanitization:** `lib/sanitize.ts` provides `escapeHtml()` to safely convert characters (`&`, `<`, `>`, `"`, `'`) before embedding user data in transactional HTML emails.
- **File Upload Protection (`/api/career-apply`):**
  - Hard limit of **5MB** (`MAX_FILE_SIZE = 5 * 1024 * 1024`).
  - Strict MIME whitelist: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

### 3. In-Memory IP Rate Limiting (`lib/rate-limit.ts`)
- Sliding window in-memory limiter:
  - `/api/send-email`: **5 requests / 60 seconds** per IP
  - `/api/enquiry-email`: **3 requests / 60 seconds** per IP
  - `/api/career-apply`: **3 requests / 60 seconds** per IP
- Rate-limited responses return `429 Too Many Requests` with a calculated `Retry-After` header.

### 4. Resend & Email Fallbacks
- Mandatory verification of `process.env.EMAIL_TO` — returns `500 Server configuration error` if unconfigured (never sends to dummy addresses).
- Dynamic `EMAIL_FROM` variable support with safe development fallback to `onboarding@resend.dev`.

---

## 🎨 Design System, Styling & Color Tokens

### Tailwind CSS v4 CSS-First Theme (`app/globals.css`)
Tailwind CSS v4 uses modern `@theme` OKLCH color definitions:

```css
@theme {
  /* Background Surfaces */
  --color-bg-primary: oklch(0.09 0.005 280);       /* Deep dark (#0d0e14) base surface */
  --color-bg-secondary: oklch(0.13 0.01 275);      /* Elevated card & surface navy (#171926) */
  --color-bg-tertiary: oklch(0.17 0.015 275);      /* Hover & active state surface (#1f2237) */

  /* Borders */
  --color-border-subtle: oklch(0.22 0.01 270);     /* Default subtle card/divider border */
  --color-border-strong: oklch(0.30 0.015 270);    /* Emphasized/hovered/active border */

  /* Text Hierarchy */
  --color-text-primary: oklch(0.95 0.005 260);     /* High-contrast headings and titles (#eff0f6) */
  --color-text-secondary: oklch(0.72 0.01 260);    /* Readable body copy & descriptions (#a5a8c0) */
  --color-text-muted: oklch(0.50 0.01 260);        /* Captions, timestamps, metadata (#6b6f89) */

  /* Brand Accents */
  --color-accent-primary: oklch(0.68 0.19 275);    /* Electric indigo brand interactive (#6366f1) */
  --color-accent-hover: oklch(0.73 0.20 275);      /* Indigo hover highlight (#818cf8) */
  --color-accent-secondary: oklch(0.72 0.16 330);  /* Vibrant rose accent for gradients (#e879a0) */

  /* Status Colors */
  --color-success: oklch(0.72 0.16 155);           /* Balanced green (#34d399) */
  --color-error: oklch(0.65 0.22 25);              /* High-clarity error red (#f87171) */
  --color-warning: oklch(0.80 0.16 85);            /* Warm warning amber (#fbbf24) */
}
```

### Typography System (`next/font/google`)
- **Display Headings:** `Space Grotesk` (`--font-space-grotesk`, `--font-display`)
- **Body & UI:** `Inter` (`--font-inter`, `--font-body`)
- **Code & Monospace:** `JetBrains Mono` (`--font-jetbrains-mono`, `--font-mono`)

### Key UI Utility Classes
- `.glass`: Glassmorphic surface (`backdrop-filter: blur(20px)`, subtle OKLCH border)
- `.glow`: Box-shadow glow effect with primary accent color
- `.text-gradient`: Linear gradient text clipping (indigo → rose)
- `.gradient-primary`: High-impact interactive background gradient (indigo → rose)
- `.gradient-subtle`: Dark surface depth gradient (tertiary → primary)
- `.gradient-glow`: Ambient radial lighting effect
- `.animate-scroll`: Keyframe scroll animation running infinite 25s hardware-accelerated loop

---

## 🔗 Application Routes & Rendering Architecture

| Route | Rendering Strategy | Data Source | SEO Metadata Strategy | Structured Data (JSON-LD) |
|---|---|---|---|---|
| `/` | **SSR** (Server Component) | Supabase (`services`, `blogs`) | `export const metadata` | WebPage schema (`#webpage`) + Organization (`layout.tsx`) |
| `/about` | **SSR / SSG** | Static | `export const metadata` | WebPage schema |
| `/services` | **SSR** (Server Component) | Supabase (`services`) | `export const metadata` | WebPage & Service collection |
| `/services/[slug]` | **SSG (ISR)** | Supabase (`single service`) | `generateMetadata()` (Canonical: `/services/[slug]`) | Service schema (`schema.org/Service`) |
| `/blog` | **SSR** (Server Component) | Supabase (`blogs`) | `export const metadata` | Blog schema (`schema.org/Blog`) |
| `/blog/[slug]` | **SSG (ISR)** | Supabase (`single blog`) | `generateMetadata()` (Canonical: `/blog/[slug]`) | Article / WebPage |
| `/careers` | **SSR + Client Island** | Static job definitions | `export const metadata` | Organization / Careers |
| `/contact` | **SSR + Client Form** | Static | `export const metadata` | ContactPage schema (`schema.org/ContactPage`) |
| `/faq` | **SSR / SSG** | Static FAQs | `export const metadata` | FAQPage schema (`schema.org/FAQPage`) |
| `/portfolio` | **SSR** | Static placeholder | `export const metadata` | WebPage |
| `/privacy-policy` | **SSR / SSG** | Static legal copy | `export const metadata` | WebPage |
| `/terms` | **SSR / SSG** | Static legal copy | `export const metadata` | WebPage |
| `/not-found` | **SSG** | Static | `export const metadata` (`robots: noindex`) | — |

---

## 🔌 API Route Specifications

### 1. `POST /api/send-email`
- **Location:** `app/api/send-email/route.ts`
- **Purpose:** Dispatches general contact form inquiries.
- **Rate Limit:** 5 requests / 60 seconds per IP.
- **Validation Schema:**
  ```ts
  const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(254),
    message: z.string().min(10).max(5000),
  })
  ```
- **Responses:**
  - `200 OK`: `{ status: 'success', data: ... }`
  - `400 Bad Request`: `{ error: 'Invalid input', details: ... }`
  - `429 Too Many Requests`: `{ error: 'Too many requests...', Retry-After: ... }`
  - `500 Internal Server Error`: `{ error: 'Server configuration error' | 'Internal server error' }`

### 2. `POST /api/enquiry-email`
- **Location:** `app/api/enquiry-email/route.ts`
- **Purpose:** Dispatches detailed service project inquiries.
- **Rate Limit:** 3 requests / 60 seconds per IP.
- **Validation Schema:**
  ```ts
  const enquirySchema = z.object({
    clientName: z.string().min(2).max(100),
    clientEmail: z.string().email().max(254),
    clientPhone: z.string().max(30).optional(),
    serviceTitle: z.string().min(1).max(200),
    serviceId: z.string().min(1),
    projectName: z.string().min(2).max(200),
    projectDetails: z.string().min(10).max(10000),
    budgetMin: z.string().optional(),
    budgetMax: z.string().optional(),
    timeDuration: z.string().min(1),
    preferredContact: z.enum(['email', 'phone', 'either']).optional(),
  })
  ```

### 3. `POST /api/career-apply`
- **Location:** `app/api/career-apply/route.ts`
- **Purpose:** Dispatches job applications with resume attachments via `multipart/form-data`.
- **Rate Limit:** 3 requests / 60 seconds per IP.
- **File Constraints:** Max 5MB, PDF or DOC/DOCX only.
- **Validation Schema:**
  ```ts
  const careerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(254),
    position: z.string().min(1).max(200),
    phone: z.string().max(30).nullable().optional(),
    coverLetter: z.string().max(10000).nullable().optional(),
  })
  ```

---

## 🧩 Components & UI Library Breakdown

### Custom Feature Components (`components/`)
1. **`navbar.tsx`:** Sticky glassmorphic navigation bar. Animates using `motion/react`, detects active route via `usePathname()`, includes accessible mobile navigation drawer and CTA button.
2. **`hero.tsx`:** Hero showcase with `section role="region"`, optimized Next.js image loading, animated headline reveals, and primary CTA.
3. **`footer.tsx`:** Semantic footer with year generator, privacy/terms links, and social links with `target="_blank"` and `rel="noopener noreferrer"`.
4. **`service-card.tsx`:** Dynamic service card. Accepts `icon` as a Lucide component or string name (resolving through `iconMap`), animated with `motion/react` hover/entry states.
5. **`blog-card.tsx`:** Interactive blog preview card with tag badges, localized date formatting, and hover transitions.
6. **`contact-form.tsx`:** Contact form with React Hook Form, Zod client resolver, accessible error messages (`aria-invalid`, `role="alert"`), and company contact info.
7. **`TechTags.tsx`:** Infinite scrolling marquee displaying technology chips with `ItemList` schema for SEO.
8. **`careers-client.tsx`:** Client-side job listing directory with filterable job cards and modal state management.
9. **`ServiceOverlay.tsx`:** Project estimation and enquiry modal with budget, timeline, and validation.
10. **`CareerForm.tsx`:** Full job application modal with drag-and-drop resume upload and live feedback.

### ShadCN UI Primitives (`components/ui/`)
- `button.tsx`: Polymorphic button component with custom CVA styling.
- `card.tsx`: Card composition primitives.
- `dialog.tsx`: Radix UI dialog modal with accessible focus trapping and keyboard navigation.
- `form.tsx`: React Hook Form context wrappers.
- `input.tsx`: Form input element.
- `label.tsx`: Form label element.
- `sonner.tsx`: Sonner toast configured for dark mode.
- `textarea.tsx`: Form multiline input element.

---

## 🔑 Environment Variables Reference

> **⚠️ DO NOT expose or print secret values. Only reference variable keys and their functional role.**

| Variable Key | Required | Client/Server | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Both | Supabase Project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Both | Supabase Anonymous Public API Key |
| `RESEND_API_KEY` | Yes | Server | Resend API key for sending transactional emails |
| `EMAIL_TO` | Yes | Server | Recipient email address for form submissions |
| `EMAIL_FROM` | No | Server | Custom sender address (e.g., `VRTechBro <contact@vrtechbro.com>`) |

---

## 🚀 10-Phase Transformation Roadmap

```
[Phase 1: Architecture Repair]  --> COMPLETE (SSR, Next.js Metadata API, Clean deps)
[Phase 2: Security Hardening]   --> COMPLETE (Security headers, CSP, Rate limit, Sanitization, Zod)
[Phase 3: Performance Opt]      --> COMPLETE (WebP/AVIF, Code splitting, whileInView, Skeletons, reduced-motion)
[Phase 4: SEO Foundation]       --> COMPLETE (Dynamic sitemap.ts, robots.ts, Schemas, Markdown renderer)
[Phase 5: Code Quality & DX]    --> COMPLETE (Kebab-case naming, @/ aliases, Constants, Clean CSS, README)
[Phase 6: Design Revolution]    --> COMPLETE (OKLCH palette, 3 fonts, CVA buttons, glassmorphism navbar, multi-col footer)
[Phase 7: Page Redesigns]       --> IN PROGRESS (All pages rebuilt 2026-10-15; final Gemini images, a11y/Lighthouse audits pending)
[Phase 8: 3D Interactivity]     --> UPCOMING ("The Forge" Blender workstation, Three.js scene)
[Phase 9: Portfolio & Showcase] --> UPCOMING (Chrome extensions gallery, npm packages)
[Phase 10: Infrastructure]      --> UPCOMING (Admin panel, Analytics, Monitoring, Final audits)
```

---

## 📌 Coding Standards & Engineering Rules

1. **Server-First Default:** All App Router pages are Server Components by default. Keep `'use client'` strictly localized to leaf interactive components (forms, overlays, animations).
2. **Never Use `next/head`:** Always use `export const metadata` for static pages or `generateMetadata()` for dynamic slug pages.
3. **Standardize Motion Imports:** Always import from `'motion/react'` (Motion v12), never from `'framer-motion'`.
4. **Clean Import Paths:** Always use path alias `@/*` instead of relative parent paths (`../`).
5. **Form & API Validation:** Every client form must have corresponding server-side Zod validation in its API endpoint. Never trust client payload alone.
6. **Input Sanitization:** Always sanitize user text inputs with `escapeHtml()` before interpolating into HTML email templates.
7. **Semantic HTML & Accessibility:** Maintain single `<h1>` per page, valid landmark roles (`role="region"`, `role="banner"`, `role="contentinfo"`), and accurate `aria-label` descriptions.
8. **Environment Secrets Protection:** Never read, inspect, log, or commit `.env*` files or keys.

---

## ✅ Phase Completion Logs

### Phase 1: 🏗️ Architecture Repair — COMPLETE

**Verified:** 2026-08-27  
**All 22 tasks verified and passing.**

| Task | Description | Status |
|---|---|---|
| 1.1 | Remove `next/head` from all App Router pages | ✅ `grep -r "next/head" app/` → 0 results |
| 1.2 | Convert Home Page to SSR (async Server Component) | ✅ No `'use client'`, `async function HomePage()`, direct Supabase queries |
| 1.3 | Convert Services Page to SSR | ✅ No `'use client'`, `async function ServicesPage()`, direct Supabase queries |
| 1.4 | Convert Careers Page to SSR (partial — CareersClient extracted) | ✅ Server Component wrapper + `careers-client.tsx` client island |
| 1.5 | Convert Blog List to SSR | ✅ `async function BlogPage()`, server-side Supabase fetch, no `BlogClient.tsx` |
| 1.6 | Fix Terms Page metadata | ✅ `export const metadata` present, no `Head` import |
| 1.7 | Fix Contact Page JSON-LD | ✅ JSON-LD in JSX body via `<script type="application/ld+json">`, no `Head` |
| 1.8 | Fix Service Detail `<head>` tag | ✅ No manual `<head>` tag, `generateMetadata()` handles all SEO |
| 1.9 | Fix broken JSON-LD URLs (`https://https://`) | ✅ No double-protocol URLs found anywhere |
| 1.10 | Remove duplicate JSON-LD blocks | ✅ Organization JSON-LD only in `layout.tsx`; no JSON-LD in `hero.tsx` or `footer.tsx` |
| 1.11 | Fix Tailwind v3/v4 config conflict | ✅ `tailwind.config.js` deleted; CSS-first `@theme` is canonical |
| 1.12 | Standardize Motion imports to `motion/react` | ✅ `grep -r "framer-motion" components/` → 0 results |
| 1.13 | Remove unused dependencies | ✅ `@clerk/nextjs`, `@react-three/*`, `three` not in `package.json` |
| 1.14 | Remove dead files | ✅ `validators.ts`, `styles/globals.css`, default SVGs, `minimal_laptop.glb` all deleted |
| 1.15 | Fix navbar aria-label error | ✅ `grep "Login to your account"` → 0 results; CTA says "Get in touch with VRTechBro" |
| 1.16 | Fix duplicate `role="banner"` landmark | ✅ `hero.tsx` uses `<section role="region">`, navbar is sole `<header role="banner">` |
| 1.17 | Fix blog canonical URL mismatch (`/blogs/` → `/blog/`) | ✅ Canonical URLs use `/blog/[slug]` correctly |
| 1.18 | Fix `next-themes` useTheme without provider | ✅ `sonner.tsx` hardcodes `theme="dark"`, no `useTheme` import |
| 1.19 | Fix inconsistent branding | ✅ No "VrTechBro" (wrong case) found; consistent "VRTechBro" throughout |
| 1.20 | Remove emoji/placeholder comments | ✅ No `"Replace with your real URL"` or `"your@email.com"` found |
| 1.21 | Fix `ServiceCardProps` icon type with JSDoc | ✅ JSDoc explaining dual `LucideIcon \| string` nature present in `types/service-card.ts` |
| 1.22 | Document duplicate logo files | ✅ Documented; optimization deferred to Phase 3 |

### Phase 2: 🔒 Security Hardening — COMPLETE

**Verified:** 2026-08-27 (from `research/memory.md` prior audit)

- HTTP Security Headers configured in `next.config.ts` (HSTS, nosniff, DENY, CSP, Permissions-Policy)
- Server-side Zod validation on all 3 API routes (`send-email`, `enquiry-email`, `career-apply`)
- `lib/sanitize.ts` (`escapeHtml`) applied to all user inputs before email interpolation
- `lib/rate-limit.ts` (`checkRateLimit`) with IP-based sliding window on all API routes
- File upload validation (5MB, PDF/DOC/DOCX) on career applications
- `EMAIL_TO` mandatory check; `EMAIL_FROM` with safe development fallback
- Custom 404 page (`not-found.tsx`) and error boundary (`error.tsx`) added

### Phase 3: ⚡ Performance Optimization — COMPLETE

**Verified:** 2026-08-27  
**Build Status:** `npm run build` compiled with 0 errors across 37 static/SSG/dynamic pages.

| Task | Description | Result |
|---|---|---|
| 3.1 | Optimize Logo & Favicon | ✅ Bloated 1.2MB `favicon.ico` replaced with 1.1KB icon; `app/logo.png` optimized to 6KB; `app/opengraph-image.png` (5KB), `app/icon.png` (2KB), `app/apple-icon.png` (11KB) generated |
| 3.2 | Optimize Service Images | ✅ All 13 PNG images converted to WebP; total image payload reduced from ~12MB to 0.41MB (>96% reduction) |
| 3.3 | Add `next/image` Remote Patterns | ✅ Configured `formats: ['image/avif', 'image/webp']` and `remotePatterns` for `*.supabase.co` in `next.config.ts` |
| 3.4 | Fix Animation Patterns (`whileInView`) | ✅ Converted below-fold components (`ServiceCard`, `BlogCard`, `CareersClient`) from `animate` to `whileInView` with viewport triggers |
| 3.5 | Add `prefers-reduced-motion` Support | ✅ Added `@media (prefers-reduced-motion: reduce)` in `globals.css` and `useReducedMotion()` hooks across animated components |
| 3.6 | Add Loading States (Skeleton Screens) | ✅ Created `app/loading.tsx`, `app/services/loading.tsx`, `app/services/[slug]/loading.tsx`, `app/blog/loading.tsx`, `app/blog/[slug]/loading.tsx` |
| 3.7 | Add Error Boundaries | ✅ `app/error.tsx` catches runtime errors with retry capability |
| 3.8 | Add Custom 404 Page | ✅ `app/not-found.tsx` with branded theme and navigation back home |
| 3.9 | Dynamic Import Heavy Components | ✅ `ServiceOverlay` (services slug page) and `CareerForm` (careers page) converted to `next/dynamic` |
| 3.10 | Optimize TechTags Animation | ✅ Converted `TechTags` to server component, hardware-accelerated marquee with `will-change: transform` |
| 3.11 | Add `sizes` Prop to All Images | ✅ All `<Image>` tags updated with accurate responsive `sizes` attributes |
| 3.12 | Remove Empty `styles/` Directory | ✅ Deleted dead `styles/` folder |
| 3.13 | Clean Up Emoji Comments | ✅ Removed emoji comments from `globals.css` and `TechTags.tsx` |

### Phase 4: 🔍 SEO Foundation — COMPLETE

**Verified:** 2026-08-27  

| Task | Description | Result |
|---|---|---|
| 4.1 | Dynamic Sitemap (`app/sitemap.ts`) | ✅ Replaced static XML with dynamic sitemap querying Supabase for all active `/services/[slug]` and `/blog/[slug]` routes with `lastModified`, `changeFrequency`, and `priority` |
| 4.2 | Dynamic Robots (`app/robots.ts`) | ✅ Programmatic robots rules disallowing `/api/` and indexing sitemap |
| 4.3 | Metadata & Canonical Consistency | ✅ Set canonical URLs to relative paths across all routes (`/`, `/about`, `/services`, `/services/[slug]`, `/blog`, `/blog/[slug]`, `/careers`, `/contact`, `/faq`, `/privacy-policy`, `/terms`, `/portfolio`) resolving against root `metadataBase` |
| 4.4 | Structured Data on Every Page | ✅ Added comprehensive JSON-LD schemas: `Organization` (Layout), `WebSite` & `WebPage` (Home), `AboutPage` (About), `WebPage` (Services list), `Service` (Service detail), `Blog` (Blog list), `BlogPosting` (Blog detail), `ContactPage` (Contact), `FAQPage` (FAQ), `JobPosting` (Careers), `CollectionPage` (Portfolio) |
| 4.5 | BreadcrumbList Schema | ✅ Added `BreadcrumbList` JSON-LD to nested pages (`/services/[slug]` and `/blog/[slug]`) |
| 4.6 & 4.8 | Analytics Integration | ⏸️ Deferred to final phase per user request |
| 4.7 | Google Search Console Readiness | ✅ Dynamic sitemap and robots configured for verification |
| 4.9 | Heading Hierarchy Audit | ✅ Verified single `<h1>` per page with sequential `<h2>` and `<h3>` heading structure across all 11 pages |
| 4.10 | Blog Markdown Renderer | ✅ Implemented rich Markdown renderer supporting headings (`##`, `###`, `####`), ordered/unordered lists, code blocks, blockquotes, horizontal rules, bold/italic formatting, and external links |

### Phase 5: 🧹 Code Quality & Developer Experience — COMPLETE

**Verified:** 2026-08-27  
**Lint Status:** `next lint` passed with `✔ No ESLint warnings or errors`.

| Task | Description | Result |
|---|---|---|
| 5.1 | Standardize File Naming | ✅ Renamed all components to kebab-case: `tech-tags.tsx`, `service-overlay.tsx`, `career-form.tsx` |
| 5.2 | Standardize Import Aliases | ✅ 100% `@/` path alias compliance; zero relative `../` imports remaining across all components and pages |
| 5.3 | Clean Up `app/globals.css` | ✅ Removed redundant body selector, organized with 4 structured section headers, eliminated emoji comments |
| 5.4 | TypeScript & Type Helpers | ✅ Created `types/supabase.ts` with `isServiceArray` and `isBlogArray` type guards and `ServiceRecord`/`BlogRecord` interfaces |
| 5.5 | Create Comprehensive README | ✅ Created complete `README.md` with tech stack, live site, setup guide, env vars table, project tree, and script references |
| 5.6 | Create `.env.example` | ✅ Created `.env.example` template with clean keys and zero secrets |
| 5.7 | Central Constants | ✅ Created `lib/constants.ts` and refactored `navbar.tsx`, `footer.tsx`, `tech-tags.tsx` to import navigation, social, and tech tags |
| 5.8 | Route File Extensions | ✅ Verified all API routes use `.ts` (`career-apply/route.ts`, `enquiry-email/route.ts`, `send-email/route.ts`) |

### Phase 6: 🎨 Design System Revolution — COMPLETE

**Verified:** 2026-08-31  
**Lint Status:** `next lint` passed with 0 errors.

| Task | Description | Result |
|---|---|---|
| 6.1 | Define New OKLCH Color Palette | ✅ 14 OKLCH color tokens (`--color-bg-*`, `--color-border-*`, `--color-text-*`, `--color-accent-*`, semantic status colors) and 3 gradient variables in `globals.css` |
| 6.2 | Set Up Typography System (3 Fonts) | ✅ Loaded `Space_Grotesk` (display headings), `Inter` (body copy), and `JetBrains_Mono` (monospace) via `next/font/google` CSS variables in `layout.tsx` |
| 6.3 | Build New Button Component | ✅ Polymorphic CVA `Button` with variants (`default` gradient, `secondary`, `ghost`, `outline`, `destructive`, `link`), micro-interactions (`hover:scale-[1.02]`, `active:scale-[0.98]`), focus rings, and `isLoading` spinner state |
| 6.4 | Build New Card Component | ✅ Composable `Card` with `bg-bg-secondary`, subtle borders, hover elevation (`-translate-y-0.5`), and `font-display` title primitives |
| 6.5 | Rebuild Navbar with Glassmorphism | ✅ Dynamic glassmorphism header (`glass` on scroll >50px), indigo gradient bottom border, link underline animations from center, and full-screen mobile menu with staggered motion |
| 6.6 | Rebuild Footer | ✅ 4-column layout (Brand + newsletter preview, Quick Links, Services, Legal & Social) with brand-colored social hovers and gradient divider |
| 6.7 | Build Spacing & Layout System | ✅ Structured `--spacing-*` scale, standardized `py-24` section spacing across all 11 pages |
| 6.8 | Add Theme Provider | ✅ `components/theme-provider.tsx` with `next-themes` integration, `defaultTheme="dark"`, and dynamic theme resolution in `sonner.tsx` |
| 6.9 | Create Utility CSS Classes | ✅ `.glass`, `.glow`, `.text-gradient`, `.gradient-primary`, `.gradient-subtle`, `.gradient-glow`, and `.animate-in` utility classes |
| 6.10 | Rebuild Service Card | ✅ Hover image zoom with gradient overlay, OKLCH category tags, arrow animated "Learn more" link, and `whileInView` motion |
| 6.11 | Rebuild Blog Card | ✅ Tag chips, Space Grotesk title with accent hover shift, `<Calendar />` & `<Clock />` metadata, and card hover lift |
| 6.12 | Design System Documentation | ✅ Created comprehensive `research/design-system.md` specification |





### Phase 7 progress log (2026-10-15)
- **Motion & layout system:** `components/motion/` (Reveal, SplitText, Counter, Marquee, Magnetic, SmoothScroll/Lenis), `components/page-hero.tsx`, `components/section-heading.tsx`, CSS utilities `container-page`, `type-display`, `type-hero`, `type-heading`, `bg-grid` in `app/globals.css`.
- **Naming gotcha:** custom type utilities use the `type-*` prefix on purpose. A `text-*` name gets dropped by `cn()`/tailwind-merge when combined with a `text-<color>` class.
- **Home:** hero "workbench" (`components/home/workbench.tsx`): tabbed code editor + live preview for website / mobile app / Chrome extension / API. Services as an index list, 4-step process, writing list, contact.
- **All inner pages rebuilt** (About, Services + detail with slide-out enquiry sheet, Blog + article with TOC/share, Contact, FAQ accordion, Careers with application sheet, legal docs with sticky TOC, honest portfolio placeholder, 404/error).
- `Button asChild` now renders a bare Slot (single child). Root title template is `%s` because page titles already include the brand.
- **Pending:** replace placeholder/light clipart images with the Gemini set; run accessibility + Lighthouse audits; owner to confirm FAQ claims (24/7 live chat, 14-day refunds contradict Terms).

### Brand system & home upgrade (2026-10-15, later)
- **Single source of truth: `lib/brand.ts`.** All colours (hex), the display width, fonts (Archivo with wdth axis + JetBrains Mono), logo file and name. `components/brand/brand-style.tsx` injects them as `--brand-*` CSS vars; `app/globals.css` maps Tailwind tokens to those vars. Do not hard-code colours anywhere else (only exception: third-party social icon colours in the footer).
- **To rebrand:** edit `lib/brand.ts`, then swap `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, `app/opengraph-image.png`. Use `<Logo />` (components/brand/logo.tsx) wherever the logo appears.
- **Palette:** indigo primary `#7B6CF6`, signal amber `#F6B31B` (from the logo bolt, used sparingly via `text-signal`/`bg-signal`), tertiary magenta for gradients only.
- **Home sections (calmed down after owner feedback):** static hero (workbench typing is the only load-time motion), Capabilities as a click/hover index with 6 demos (no scroll pinning), scroll-drawn Process timeline, Under the hood (live PageSpeed scores via `lib/site-metrics.ts` — needs `PAGESPEED_API_KEY` env var to show reliably; architecture diagram; headers from `lib/security-headers.ts`), curtain footer with wordmark, page transitions (`app/template.tsx`), cursor spotlight, film grain.
- `next.config.ts` now imports headers from `lib/security-headers.ts` (verified byte-identical).
- **Motion rule (owner feedback 2026-10-15):** only motion that goes with the reading flow or answers a user action. No scroll-jacking, parallax layers, looping animations, magnetic buttons or word-by-word headline reveals. Keep headline sizes moderate (type-hero max 3.25rem).
- **Audit 2026-10-15 (Lighthouse 12, mobile, local prod build):** accessibility 100 on all 9 key pages, SEO 100, best practices 96 (an unexplained "CSP issue" that only appears in headless Lighthouse; re-check after nonce CSP), performance 87–93 (LCP 3.1–3.8 s simulated, mostly framework JS on slow 4G). Fixes applied: no fade/slide on first load (was hiding content until hydration), Lenis loaded on idle, CSS page fade, mono font not preloaded, footer wordmark as SVG, heading order and link underline fixes. Careers jobs now from Supabase `jobs` table (migration in `supabase/migrations/`, run manually) with fallback on error.

### Project reorganisation (2026-10-17)
- Docs moved to `docs/` (`docs/memory.md`, `docs/phases/`, `docs/research/`). Raw design originals live in git-ignored `assets-raw/` (images renamed to their roles; Gemini video at `assets-raw/video/hero-loop-original.mp4`, not used on the site).
- Components grouped by area: `layout/` (navbar, footer, curtain, theme-provider), `shared/` (page-hero, section-heading), `home/` (hero, tech-tags, …), `blog/`, `careers/`, `contact/`, `services/` (service overlay renamed `enquiry-sheet.tsx`). `lib/helper.ts` → `lib/icon-map.ts`.
- Images: `public/images/{brand,site,services,process}/`, all WebP. Paths centralised in `lib/images.ts`. Supabase `services.image_url` still holds old `/images/<name>.png` paths; `serviceImage()` maps them. Running `supabase/migrations/2026-10-17_service_image_paths.sql` updates the rows.
- `public/logo.png` added: structured data pointed at `/logo.png`, which was a 404 while the file sat in `app/`.
- New art in use: hero background, home contact backdrop, About story image, 404 astronaut, blog share-image fallback. `process/discover` and `process/design` are processed but unused until Build and Launch images exist.
- **2026-10-17 home update:** "Under the hood" (how-this-site-works) section removed at owner's request, along with `lib/site-metrics.ts` (PAGESPEED_API_KEY no longer needed). Replaced by `components/home/comparison.tsx` ("An agency, a freelancer, or us?"; copy to be confirmed by owner). New flow-friendly motion: `HeadingReveal` (every SectionHeading slides up from a mask once), `RevealItem` (staggered list rows), CSS `.rise`/`.settle` hero entrance (no JS wait).
- **Images optimised:** heavier WebPs recompressed (hero 89→56 KB, CTA 145→67 KB, logo 41→22 KB, website-development 126→103 KB); share image rebuilt as `app/opengraph-image.jpg` + `app/twitter-image.jpg` (38 KB, hero art + logo); `next.config.ts` caches optimised images for 31 days.
- **Owner preference:** no production builds from the assistant; verify with tsc, lint and the dev server via Playwright.

### Phase 10 progress (2026-10-17)
- **Phases:** 8 (3D) dropped — 3D goes to the owner's personal portfolio. 9 (portfolio) deferred until real projects exist.
- **Routing:** public pages in `app/(site)/` (layout = `components/layout/site-chrome.tsx`); admin in `app/admin/` with its own layout. Root `app/layout.tsx` only has fonts, brand tokens, the `js` class script and a lazy toaster. `next-themes` and the tooltip provider removed.
- **Admin panel:** Supabase Auth via `@supabase/ssr`; `middleware.ts` (matcher `/admin/:path*` only); `requireAdmin()` in `lib/admin/auth.ts` on every page/action (getUser + `is_admin()` RPC); RLS write policies + `media` storage bucket in `supabase/migrations/2026-10-17_admin.sql`. Owner must run the jobs + admin migrations and add themselves to `public.admins` (see README "Admin Panel").
- **Spam:** hidden `website` honeypot on all three forms (`lib/honeypot.ts`, `components/shared/honeypot.tsx`); APIs fake success when filled.
- **Performance:** navbar and scroll reveals no longer use Motion (CSS + IntersectionObserver via `components/motion/use-in-view-once.ts`); toaster lazy-loaded; Motion now only loads on pages with interactive pieces.
- **Tests:** `npm run test:e2e` (Playwright, dev server on 3460, installed Chrome, desktop/tablet/mobile). 162 tests: pages, design screenshots, axe a11y, security headers/API/admin redirects, forms. All failures from the first run were fixed (share images on 5 pages, mobile menu focus trap).
- **CI:** `.github/workflows/ci.yml` runs tsc, lint and `npm audit --audit-level=critical` on push/PR (no build: it needs secret env vars).
- **Still open:** Lighthouse on a production build (owner runs builds), nonce-based CSP (would force dynamic rendering, trading away performance), persistent rate limiting (needs Upstash), Sentry (needs account), Next 16 upgrade.

### Next.js 16 upgrade (2026-10-17)
- next 16.4.2, React 19.3, eslint-config-next 16.4.2. `middleware.ts` → `proxy.ts` (export `proxy`; `lib/supabase/middleware.ts` → `lib/supabase/proxy.ts`). `next lint` removed → `npm run lint` is `eslint .` with a native flat config (`eslint.config.mjs`). Turbopack is the default (dev script is plain `next dev`). `npm audit --omit=dev` now reports 0 vulnerabilities.
- New react-hooks lint rules fixed by deriving state instead of setting it in effects (navbar route-change close, slug input, blog list hydration flag via useSyncExternalStore, workbench typing, reveal hook).
- Verified on the dev server: desktop Playwright project 53 passed / 2 skipped, mobile menu tests pass.
- Copy finalised: FAQ answers rewritten to match the Terms and real support hours (no 24/7, no 14-day refund), Terms and Privacy "last updated" 2026-10-17, comparison wording softened.

### 2026-10-18
- **Mobile navbar fix:** the menu overlay is rendered with a portal on `document.body` (the header's backdrop-filter made the header the containing block for the fixed overlay, so it was 96px tall with links off-screen). The overlay has its own logo + close button and a solid background; the header keeps a constant height (logo 64px, py-2) so nothing jumps on phones; Lenis is disabled on touch devices.
- **Hydration fix:** React #418 on the live site came from local-timezone date formatting (Vercel = UTC, visitors = local) plus `blogs.published_at` stored without a time zone. All dates now go through `lib/format-date.ts` (UTC parsing + formatting).
- **Sentry:** `@sentry/nextjs` 11 wired in (instrumentation files, `app/global-error.tsx`, page error boundary, `withSentryConfig` with `tunnelRoute: /sentry-tunnel`). Off until `NEXT_PUBLIC_SENTRY_DSN` is set; env vars in README. Privacy via `dataCollection` (no user info, cookies or bodies); no Session Replay.
- **Live Lighthouse (mobile, home, before these fixes):** 86 / 100 / 93 / 100. LCP 3.3 s (hero image; render delay from framework JS). Best-practices loss was the hydration error.
- **Learning guide:** `docs/learning-guide.md` explains the concepts behind the whole build.
