# VRTechBro

> Modern digital studio website — built with **Next.js 15**, **Supabase**, **Tailwind CSS v4**, and **Motion**.

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 🌐 Live Site
**[https://vrtechbro.com](https://vrtechbro.com)**

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router, React Server Components, ISR)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Database:** [Supabase](https://supabase.com) (PostgreSQL client)
- **Email Delivery:** [Resend](https://resend.com)
- **Animation & Transitions:** [Motion](https://motion.dev)
- **Form Validation & Sanitization:** [Zod](https://zod.dev) + DOMPurify / escapeHtml
- **Deployment:** [Vercel](https://vercel.com)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17+ (v20+ recommended)
- **npm** or **pnpm**

### Quick Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vrtechbro/vrtechbro.git
   cd vrtechbro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local` and add your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|:---:|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key | Yes |
| `RESEND_API_KEY` | Resend API key for transactional emails | Yes |
| `EMAIL_TO` | Destination inbox for contact & career forms | Yes |
| `EMAIL_FROM` | Verified sender address in Resend (default: `onboarding@resend.dev`) | Optional |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`) | Optional |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry project DSN (Project Settings → Client Keys). Sentry stays off while this is empty | Optional |
| `SENTRY_ORG` | Sentry organisation slug (from the URL `sentry.io/organizations/<slug>/`) | With Sentry |
| `SENTRY_PROJECT` | Sentry project slug | With Sentry |
| `SENTRY_AUTH_TOKEN` | Organisation auth token for uploading source maps at build time. **Secret** — set only in Vercel, never in the repo | With Sentry |

### Error tracking (Sentry)

Errors from the browser, server components, server actions and API routes are reported to Sentry once `NEXT_PUBLIC_SENTRY_DSN` is set (`instrumentation.ts`, `instrumentation-client.ts`, `sentry.*.config.ts`, `app/global-error.tsx`). Browser reports travel through `/sentry-tunnel` on this domain, so the CSP needs no change and ad blockers don't drop them. Privacy: user details, cookies and request bodies are never sent (`dataCollection` in each config). Session Replay is intentionally off to keep pages light.

---

## 📁 Project Structure

```
vrtechbro/
├── app/                      # Routes (App Router): one folder per page, plus api/
│   ├── api/                  # career-apply, enquiry-email, send-email
│   ├── globals.css           # Maps brand variables to Tailwind tokens; type scale
│   ├── layout.tsx            # Root layout: fonts, brand tokens, navbar, curtain footer
│   ├── template.tsx          # Page-to-page fade (skipped on first load)
│   ├── page.tsx              # Home
│   ├── error.tsx, loading.tsx, not-found.tsx
│   └── robots.ts, sitemap.ts
├── components/
│   ├── brand/                # BrandStyle (injects colours), Logo
│   ├── layout/               # Navbar, Footer, Curtain, ThemeProvider
│   ├── shared/               # PageHero, SectionHeading (used on every page)
│   ├── motion/               # Small motion helpers (Reveal, Spotlight, Counter, SmoothScroll)
│   ├── home/                 # Hero, workbench, capabilities, process, under the hood
│   ├── about/, blog/, careers/, contact/, faq/, legal/, services/
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── brand.ts              # ★ Single source of brand colours, fonts and logo
│   ├── images.ts             # Image paths + legacy service-image mapping
│   ├── constants.ts          # Site name, nav links, social links
│   ├── security-headers.ts   # CSP and security headers (used by next.config.ts)
│   ├── site-metrics.ts       # PageSpeed Insights fetch for the home page
│   └── icon-map.ts, rate-limit.ts, sanitize.ts, supabase.ts, utils.ts
├── public/
│   ├── images/brand/         # Logo files
│   ├── images/site/          # Hero, CTA, about, 404 and blog fallback art
│   ├── images/services/      # One illustration per service
│   ├── images/process/       # Process step illustrations
│   └── logo.png              # Logo URL used in structured data
├── supabase/migrations/      # SQL to run once in the Supabase SQL editor
├── types/                    # TypeScript types
├── docs/                     # memory.md (knowledge base), phases/, research/
├── assets-raw/               # Original design files (git-ignored, never deployed)
└── next.config.ts            # Next.js config
```

---

## 🛡️ Admin Panel

Manage services, blog posts and careers at **`/admin`** without touching code.

### One-time setup (Supabase dashboard)

1. **SQL Editor:** run `supabase/migrations/2026-10-15_create_jobs.sql` (if not already), then `supabase/migrations/2026-10-17_admin.sql`. This creates the admin list, row-level security for writes and the `media` image bucket.
2. **Authentication → Users → Add user:** create your account with a strong password (tick *Auto confirm user*).
3. **SQL Editor:** give that account admin rights (use your email):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
4. Sign in at `/admin/login`.

Recommended: in **Authentication → Providers → Email**, turn off *Allow new users to sign up*, so accounts can only be created from the dashboard.

### How it is protected

- **Middleware** sends signed-out visitors on `/admin/*` to the login page (public pages are untouched and stay static).
- **Every admin page and server action** re-checks that the user is signed in *and* listed in `public.admins` (`lib/admin/auth.ts`).
- **The database** enforces the same rule with row-level security, so writes fail even if the app were bypassed. Only the public anon key is used; no service-role key exists in the app.
- Login is rate-limited (5 attempts/minute per IP) and errors never reveal whether an account exists.
- Uploads accept only JPEG, PNG, WebP or AVIF up to 4 MB, verified by file contents, stored under random names.
- `/admin` is excluded from search engines (`noindex` + `robots.txt`).

## 📜 Available Scripts

- `npm run dev` — Launch development server with hot reload
- `npm run build` — Create optimized production build
- `npm run start` — Run production server
- `npm run lint` — Check for ESLint warnings and code quality issues

---

## 📄 License
© 2026 **VRTechBro**. All rights reserved.
