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

## 📜 Available Scripts

- `npm run dev` — Launch development server with hot reload
- `npm run build` — Create optimized production build
- `npm run start` — Run production server
- `npm run lint` — Check for ESLint warnings and code quality issues

---

## 📄 License
© 2026 **VRTechBro**. All rights reserved.
