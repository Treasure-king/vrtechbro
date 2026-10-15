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
├── app/                      # Next.js App Router routes
│   ├── about/                # /about
│   ├── api/                  # Backend API routes (career-apply, enquiry-email, send-email)
│   ├── blog/                 # /blog & /blog/[slug]
│   ├── careers/              # /careers
│   ├── contact/              # /contact
│   ├── faq/                  # /faq
│   ├── portfolio/            # /portfolio
│   ├── privacy-policy/       # /privacy-policy
│   ├── services/             # /services & /services/[slug]
│   ├── terms/                # /terms
│   ├── error.tsx             # Global error boundary
│   ├── globals.css           # Tailwind v4 theme & animations
│   ├── layout.tsx            # Root layout, metadataBase, Organization schema
│   ├── loading.tsx           # Global suspense streaming skeleton
│   ├── not-found.tsx         # Custom 404 page
│   ├── page.tsx              # Home landing page (Hero, Services, Blog, Contact)
│   ├── robots.ts             # Dynamic robots.txt
│   └── sitemap.ts            # Dynamic sitemap.xml querying Supabase
├── components/               # Reusable UI & feature components
│   ├── ui/                   # shadcn/ui primitives (button, sonner)
│   ├── blog-card.tsx         # Viewport-aware animated blog card
│   ├── career-form.tsx       # Dynamic career application modal
│   ├── careers-client.tsx    # Interactive careers listing
│   ├── contact-form.tsx      # Contact form with rate-limiting & Zod validation
│   ├── footer.tsx            # Site footer with constants links
│   ├── hero.tsx              # High-performance server-rendered hero
│   ├── navbar.tsx            # Sticky navigation with mobile menu
│   ├── service-card.tsx      # Viewport-aware animated service card
│   ├── service-overlay.tsx   # Dynamic service enquiry modal
│   └── tech-tags.tsx         # Infinite scrolling tech marquee
├── lib/                      # Utilities, clients & helpers
│   ├── constants.ts          # Central navigation, social & company constants
│   ├── email-template.ts     # HTML email formatting
│   ├── helper.ts             # Icon mapper & format helpers
│   ├── rate-limit.ts         # IP-based sliding window rate limiter
│   ├── sanitize.ts           # HTML input sanitizer (XSS prevention)
│   ├── supabase.ts           # Supabase client singleton
│   └── utils.ts              # Class name merging utility (cn)
├── public/images/            # Optimized WebP and PNG assets
├── types/                    # TypeScript interfaces & type guards
├── memory.md                 # Project knowledge base & phase tracker
└── next.config.ts            # Security headers, CSP & Next.js config
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
