# 🧠 VRTechBro — Codebase Memory

> **⛔ CRITICAL RULE: NEVER read `.env.*` or `.env.local` files under ANY circumstance.**

> **Last Updated:** 2026-07-28
> This document contains a comprehensive snapshot of the entire VRTechBro codebase so that re-reading source files is unnecessary. Treat this as the single source of truth for codebase structure, patterns, architecture, security posture, and current implementation state.

---

## 📁 Project Overview

- **Project Name:** VRTechBro
- **Live URL:** https://www.vrtechbro.com/
- **Framework:** Next.js 15.3.8 (App Router) with TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` configuration) + ShadCN UI (new-york style)
- **Backend/DB:** Supabase (PostgreSQL) — server-side & client-side SDK integration
- **Email:** Resend SDK
- **Animation:** Motion (`motion/react`) v12.23.3
- **Forms:** react-hook-form + Zod validation (client & server-side)
- **Security Posture:** A+ grade (HTTP security headers, CSP, Zod validation, XSS sanitization, IP rate limiting)
- **Rendering Architecture:** Server-First SSR/SSG across all key pages (`/`, `/services`, `/blog`, `/careers`, etc.)
- **Dev Server:** `npm run dev` (uses `--turbopack`)
- **Node Package Manager:** npm (package-lock.json present)
- **Deployment Target:** Vercel

---

## 📦 Key Dependencies

### Production
| Package | Version | Status |
|---|---|---|
| `next` | 15.3.8 | ✅ Active |
| `react` / `react-dom` | ^19.0.0 | ✅ Active |
| `@supabase/supabase-js` | ^2.50.5 | ✅ Active |
| `motion` | ^12.23.3 | ✅ Active (Standardized to `motion/react`) |
| `resend` | ^4.6.0 | ✅ Active |
| `react-hook-form` | ^7.60.0 | ✅ Active |
| `@hookform/resolvers` | ^5.1.1 | ✅ Active |
| `zod` | ^4.0.5 | ✅ Active (used in client forms & server API routes) |
| `sonner` | ^2.0.6 | ✅ Active (toast notifications, hardcoded to "dark") |
| `lucide-react` | ^0.525.0 | ✅ Active |
| `react-icons` | ^5.5.0 | ✅ Active (blog page, footer) |
| `class-variance-authority` | ^0.7.1 | ✅ Active (ShadCN) |
| `clsx` | ^2.1.1 | ✅ Active |
| `tailwind-merge` | ^3.3.1 | ✅ Active |
| `next-themes` | ^0.4.6 | ⚠️ Installed (un-used in Sonner to avoid provider errors) |
| `@radix-ui/react-dialog` | ^1.1.14 | ✅ Active (ShadCN dialog) |
| `@radix-ui/react-label` | ^2.1.7 | ✅ Active (ShadCN label) |
| `@radix-ui/react-slot` | ^1.2.3 | ✅ Active (ShadCN button) |
| `@clerk/nextjs` | — | ❌ Uninstalled in Phase 1 |
| `@react-three/drei` | — | ❌ Uninstalled in Phase 1 |
| `@react-three/fiber` | — | ❌ Uninstalled in Phase 1 |
| `three` | — | ❌ Uninstalled in Phase 1 |

### Dev Dependencies
| Package | Version |
|---|---|
| `tailwindcss` | ^4 |
| `@tailwindcss/postcss` | ^4 |
| `tw-animate-css` | ^1.3.5 |
| `typescript` | ^5 |
| `eslint` / `eslint-config-next` | ^9 / 15.3.5 |
| `prettier` / `prettier-plugin-tailwindcss` | ^3.6.2 / ^0.6.14 |

---

## 📂 Complete Directory Structure

```
vrtechbro/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, Navbar, Footer, Toaster, SEO metadata, Organization JSON-LD)
│   ├── page.tsx                # Home page (Server Component, SSR Supabase fetch, metadata export, single WebPage JSON-LD)
│   ├── globals.css             # Main CSS file (Tailwind v4 @theme + ShadCN CSS variables)
│   ├── favicon.ico             # App icon
│   ├── logo.png                # Reference logo image
│   ├── vrtechbro-logo.png      # OG metadata image
│   ├── robots.txt              # Static robots file
│   ├── sitemap.xml             # Static sitemap
│   ├── not-found.tsx           # Custom 404 page
│   ├── error.tsx               # Client-side runtime error boundary
│   ├── about/page.tsx          # About page (SSR, metadata export)
│   ├── blog/
│   │   ├── page.tsx            # Blog list (Async Server Component, server-side Supabase fetch, metadata export)
│   │   └── [slug]/page.tsx     # Blog detail (SSR, generateMetadata, canonical: /blog/[slug])
│   ├── careers/page.tsx        # Careers page (Server Component wrapper, metadata export)
│   ├── contact/page.tsx        # Contact page (SSR, metadata export, ContactPage JSON-LD in body)
│   ├── faq/page.tsx            # FAQ page (SSR, metadata export, FAQPage schema)
│   ├── portfolio/page.tsx      # Portfolio page (SSR)
│   ├── services/
│   │   ├── page.tsx            # Services list (Async Server Component, server-side Supabase fetch, metadata export)
│   │   └── [slug]/page.tsx     # Service detail (SSR, generateMetadata, generateStaticParams, no manual <head>)
│   ├── privacy-policy/page.tsx # Privacy Policy (SSR, metadata export)
│   ├── terms/page.tsx          # Terms & Conditions (SSR, metadata export, canonical: /terms)
│   └── api/
│       ├── send-email/route.ts         # Contact form email (Zod validation, rate limited, escapeHtml, EMAIL_FROM support)
│       ├── enquiry-email/route.ts      # Service enquiry email (Zod validation, rate limited, escapeHtml, EMAIL_FROM support)
│       └── career-apply/route.ts       # Career application email (Zod validation, 5MB file upload limit, rate limited, escapeHtml)
├── components/
│   ├── navbar.tsx              # Sticky navbar (motion/react, active highlighting, correct aria-label)
│   ├── hero.tsx                # Hero section (section role="region", motion/react, no duplicate JSON-LD)
│   ├── footer.tsx              # Footer with nav links, social icons, standardized copyright "VRTechBro"
│   ├── service-card.tsx        # Service card (motion/react, internal iconMap lookup from string icon prop)
│   ├── blog-card.tsx           # Blog card (motion/react, tags, date)
│   ├── contact-form.tsx        # Contact form with Zod validation + info sidebar
│   ├── TechTags.tsx            # Infinite scrolling tech tags carousel
│   ├── careers-client.tsx      # Client component for job listing state and application modal
│   ├── ServiceOverlay.tsx      # Service enquiry form modal overlay
│   ├── CareerForm.tsx          # Career application form modal with file upload
│   └── ui/                     # ShadCN UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── sonner.tsx          # Toast (hardcoded to "dark")
│       └── textarea.tsx
├── lib/
│   ├── supabase.ts             # Supabase client (NEXT_PUBLIC_ env vars)
│   ├── helper.ts               # Icon map (lucide icons for service cards)
│   ├── sanitize.ts             # HTML sanitization helper (escapeHtml)
│   ├── rate-limit.ts           # In-memory IP rate limiter (checkRateLimit)
│   └── utils.ts                # cn() utility (clsx + tailwind-merge)
├── types/
│   ├── service-card.ts         # ServiceCardProps interface (JSDoc for string/component icon lookup)
│   └── blog-card.ts            # BlogCardProps interface
├── public/
│   ├── images/                 # Service and about images
├── (laterused)/
│   └── admin/                  # Gitignored admin panel (dashboard, blogs, contacts, services CRUD)
├── research/                   # Research & planning documents
│   ├── concept.md
│   ├── memory.md               # THIS FILE
│   ├── requirements.md
│   ├── philosophy.md
│   └── flaws.md
├── package.json
├── tsconfig.json
├── next.config.ts              # Next.js config with Security Headers & Content Security Policy
├── postcss.config.mjs
├── eslint.config.mjs
├── prettier.config.js
├── components.json             # ShadCN config
├── next-env.d.ts
├── .gitignore
└── README.md
```

---

## 🗄️ Supabase Tables

### `services` table
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | string | Service name |
| slug | string | URL-friendly slug |
| short_description | string | Brief description |
| long_description | string | Full description |
| keywords | string[] | Array of SEO keywords |
| meta_title | string | Custom SEO title |
| meta_description | string | Custom SEO description |
| content | string | Rich content |
| icon | string | Lucide icon name (maps to `lib/helper.ts` `iconMap`) |
| image_url | string | Service image URL |
| category | string | Service category |
| display_order | number | Sort order |
| cta_label | string | Call-to-action button text |
| cta_enabled | boolean | Whether CTA is active |
| featured | boolean | Whether to show on home page |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update |

### `blogs` table
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | string | Blog title |
| description | string | Meta description |
| content | string | Full blog content (pseudo-Markdown) |
| slug | string | URL-friendly slug |
| keywords | string[] | SEO keywords |
| tags | string[] | Category labels |
| published_at | timestamp | Publication date |
| updated_at | timestamp | Last update |
| author | string | Author name |
| meta_title | string | Custom SEO title |
| meta_description | string | Custom SEO description |
| reading_time | number | Minutes to read |
| thumbnail | string | Blog image URL |
| image_url | string | Blog image (used in OG tags) |

---

## 🔒 Security Architecture (Phase 2 Completed)

### 1. HTTP Security Headers (`next.config.ts`)
- **HSTS:** `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- **MIME Sniffing:** `X-Content-Type-Options: nosniff`
- **Clickjacking Protection:** `X-Frame-Options: DENY`
- **XSS Filter:** `X-XSS-Protection: 1; mode=block`
- **Referrer Policy:** `Referrer-Policy: strict-origin-when-cross-origin`
- **Permissions Policy:** Restricts camera, microphone, geolocation, and browsing-topics
- **Content Security Policy (CSP):** Restricts script, style, frame, image, font, and connect origins (`https://*.supabase.co`)

### 2. API Input Validation & Sanitization
- **`/api/send-email`:** Server-side Zod validation (`contactSchema`: name 2-100, email max 254, message 10-5000 chars). IP rate limited (5 req/min). `escapeHtml()` sanitization applied to all text fields.
- **`/api/enquiry-email`:** Server-side Zod validation (`enquirySchema`). IP rate limited (3 req/min). `escapeHtml()` sanitization applied.
- **`/api/career-apply`:** Server-side Zod validation (`careerSchema`). IP rate limited (3 req/min). Server-side file upload validation (**max 5MB**, PDF/DOC/DOCX types only). `escapeHtml()` sanitization applied.

### 3. Email Security & Configuration
- Mandatory check for `process.env.EMAIL_TO` — fails safely with 500 error if missing (no fallback to dummy `your@email.com`).
- Flexible `from` address: Uses `process.env.EMAIL_FROM` with fallback to `onboarding@resend.dev` for immediate out-of-the-box local testing. Custom domain senders (`contact@vrtechbro.com`, `enquiry@vrtechbro.com`, `careers@vrtechbro.com`) are active once domain DNS is configured.

---

## 🎨 Design & Color System

### Custom Theme Colors (`globals.css` `@theme`)
| Token | Value | Purpose |
|---|---|---|
| `--color-dark` | `oklch(0 0 323)` | Deep dark background (black) |
| `--color-darkclip` | `oklch(0.170 0 323)` | Slightly lighter dark surface |
| `--color-primary` | `oklch(62.5% 0.21 260)` | Vivid modern blue |
| `--color-accent` | `oklch(78% 0.18 220)` | Electric light blue |
| `--color-card` | `oklch(32% 0.06 270)` | Card surface |
| `--color-text` | `oklch(96% 0.01 260)` | Off-white text |
| `--color-success` | `oklch(74% 0.16 145)` | Green |
| `--color-error` | `oklch(68% 0.24 25)` | Red |
| `--color-warning` | `oklch(85% 0.16 100)` | Yellow |
| `--color-info` | `oklch(80% 0.17 245)` | Info blue |
| `--color-primaryHover` | `oklch(90% 0.18 85)` | Hover state |

---

## 🔗 Routes & Component Architecture

### Page Routes & Rendering Types
| Route | Type | Data Source | SEO Metadata Source |
|---|---|---|---|
| `/` | SSR | Supabase (services, blogs) | `export const metadata` |
| `/about` | SSR | Static | `export const metadata` |
| `/blog` | SSR | Supabase (blogs) | `export const metadata` |
| `/blog/[slug]` | SSG/SSR | Supabase (single blog) | `generateMetadata()` (canonical: `/blog/[slug]`) |
| `/careers` | SSR wrapper + Client Component | Static job list | `export const metadata` |
| `/contact` | SSR | Static | `export const metadata` + JSON-LD script |
| `/faq` | SSR | Static FAQs | `export const metadata` |
| `/portfolio` | SSR | Static placeholder | `export const metadata` |
| `/services` | SSR | Supabase (services) | `export const metadata` |
| `/services/[slug]` | SSG/SSR | Supabase (single service) | `generateMetadata()` |
| `/privacy-policy` | SSR | Static | `export const metadata` |
| `/terms` | SSR | Static | `export const metadata` (canonical: `/terms`) |

### API Routes
| Endpoint | Method | Rate Limit | Payload Validation |
|---|---|---|---|
| `/api/send-email` | POST | 5 req / 60s | Zod text schema + `escapeHtml` |
| `/api/enquiry-email` | POST | 3 req / 60s | Zod enquiry schema + `escapeHtml` |
| `/api/career-apply` | POST | 3 req / 60s | Zod career schema + 5MB file upload limit (PDF/DOC/DOCX) |

---

## 🔑 Environment Variables (Keys Only — Never Read Values)

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `RESEND_API_KEY` — Resend email API key
- `EMAIL_TO` — Recipient email address for form submissions
- `EMAIL_FROM` — Sender email address (defaults to `VRTechBro <onboarding@resend.dev>`)

---

## 🚀 Completed Phases Log

### Phase 1: Architecture Repair (Completed 2026-07-28)
- Removed all `next/head` usage across App Router pages; replaced with `export const metadata`.
- Converted `/`, `/services`, `/blog`, and `/careers` to Server-Side Rendering (SSR).
- Standardized motion imports to `motion/react` v12.
- Deleted `tailwind.config.js` (Tailwind v4 CSS-first config in `globals.css` is canonical).
- Uninstalled 81 unused package dependencies (`@clerk/nextjs`, `@react-three/*`, `three`).
- Removed duplicate Organization JSON-LD scripts (kept canonical version in `app/layout.tsx`).
- Fixed canonical URL mismatches (`/blogs/` → `/blog/`, `/terms-and-conditions` → `/terms`).
- Fixed navbar CTA button `aria-label` ("Get in touch with VRTechBro").
- Fixed hero duplicate landmark (`header role="banner"` → `section role="region"`).

### Phase 2: Security Hardening (Completed 2026-07-28)
- Configured HTTP Security Headers (HSTS, `nosniff`, `DENY` clickjacking, Referrer-Policy, Permissions-Policy).
- Configured Content Security Policy (CSP) in `next.config.ts`.
- Created `lib/sanitize.ts` (`escapeHtml`) for HTML XSS prevention.
- Created `lib/rate-limit.ts` (`checkRateLimit`) for in-memory IP rate limiting.
- Hardened all three API routes with server-side Zod validation, sanitization, rate limiting, and 5MB/PDF/DOC file upload restrictions.
- Removed fallback dummy `your@email.com` emails; added `process.env.EMAIL_FROM` support.
- Added custom 404 page (`app/not-found.tsx`) and client runtime error boundary (`app/error.tsx`).
- Verified Supabase Row Level Security (RLS) policies.
