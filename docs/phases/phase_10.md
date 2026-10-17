# Phase 10: 🚀 Infrastructure, Admin & Launch

> **Goal:** Reactivate and secure the Admin Panel for managing services, blogs, projects, extensions, and contacts; set up CI/CD automation, monitoring, error tracking, automated Lighthouse checks, and perform the final production launch audit.
>
> **Estimated Tasks:** 10
> **Depends On:** Phases 1–9

---

## Task 10.1 — Reactivate & Refactor Admin Panel from `(laterused)`

### Steps
1. Move files from `(laterused)/admin/` into `app/admin/`
2. Update paths, imports, and styling to match the Phase 6 Design System
3. Structure admin layout with sidebar navigation:
   - Dashboard Overview
   - Projects & Showcase Manager
   - Services Manager
   - Blog Manager
   - Extensions & npm Packages Manager
   - Contacts & Enquiries Reader
4. Add Server Action / Supabase CRUD handlers for all entities

### Verification
- [ ] Admin route `/admin` exists and renders correctly
- [ ] CRUD operations function cleanly for all tables

---

## Task 10.2 — Implement Secure Admin Authentication

### Authentication Strategy
- Use Supabase Auth with email/password or Magic Links for admin access
- Wrap all `/admin` routes in middleware (`middleware.ts`):

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !request.nextUrl.pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

### Verification
- [ ] Unauthenticated access to `/admin` redirects to `/admin/login`
- [ ] Authenticated admin can log in and access management panels
- [ ] Unauthorized users cannot perform write mutations via API or Server Actions

---

## Task 10.3 — Build Admin Login Page (`app/admin/login/page.tsx`)

### Features
- Minimalist glassmorphic login card
- Email & password form with Zod validation
- Error feedback via Sonner toasts
- Remember me / Session persistence
- Redirection to `/admin` on success

### Verification
- [ ] Login page functions cleanly
- [ ] Invalid credentials show clear error notification
- [ ] Successful login routes to dashboard

---

## Task 10.4 — Build Admin Dashboard & Entity Management Views

### Dashboard Home (`/admin`)
- Quick metrics cards: Total Services, Published Blogs, Projects, Unread Enquiries
- Recent enquiry messages table with status badges (New, In Review, Archived)

### Management Sub-Pages
1. `/admin/services`: Datatable with inline edit/delete, "Add Service" drawer
2. `/admin/blogs`: Markdown editor with live preview, publishing toggle
3. `/admin/projects`: Form for technical stack tags, metrics JSON, screenshot upload
4. `/admin/extensions`: Manage extension ratings, install counts, Web Store links
5. `/admin/contacts`: Message viewer with "Reply via Email" mailto helper

### Verification
- [ ] Full CRUD operations tested for Services, Blogs, Projects, Extensions
- [ ] Rich text / Markdown editor saves content without formatting corruption

---

## Task 10.5 — Set Up Error Tracking (Sentry Integration)

### Setup
```bash
npx @sentry/wizard@latest -i nextjs
```

### Configuration
- Enable Sentry for client-side and server-side errors
- Filter out expected noise (e.g. 404s, cancelled fetch requests)
- Mask sensitive input data (passwords, user form details) in error reports

### Verification
- [ ] Trigger test error in dev/staging — event appears in Sentry dashboard
- [ ] Zero impact on page load performance

---

## Task 10.6 — Set Up GitHub Actions CI/CD Pipeline

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit

  build-check:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

### Verification
- [ ] GitHub Actions workflow triggers on push/PR
- [ ] Linting, type-checking, and build validation run automatically

---

## Task 10.7 — Automated Lighthouse Performance Budget in CI

Add Lighthouse CI step to `.github/workflows/ci.yml` using `@lhci/cli`.

Create `.lighthouserc.json`:
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run start",
      "url": ["http://localhost:3000/", "http://localhost:3000/services", "http://localhost:3000/showcase"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 1.0 }]
      }
    }
  }
}
```

### Verification
- [ ] Lighthouse CI asserts performance, accessibility, best practices, and SEO scores on every PR

---

## Task 10.8 — Vercel Deployment & Production Environment Setup

### Production Checklists
1. Set all environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_TO`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - `SENTRY_DSN`
2. Enable Vercel Web Analytics & Speed Insights
3. Configure Custom Domain DNS records (`vrtechbro.com` & `www.vrtechbro.com`) with automatic SSL/TLS renewal

### Verification
- [ ] Production build succeeds on Vercel
- [ ] Custom domain resolves over HTTPS cleanly

---

## Task 10.9 — Comprehensive Pre-Launch Security & Audit Sweep

Run final automated and manual security scans:
1. **SecurityHeaders.com:** Target A+ grade verification
2. **Mozilla Observatory:** Scan for header compliance
3. **Google Rich Results Test:** Verify all structured data schemas
4. **W3C Markup Validator:** No critical HTML syntax errors
5. **Axe DevTools / WAVE:** Zero critical accessibility violations
6. **Mobile Responsiveness:** Tested on iPhone SE, iPhone 15 Pro, iPad Air, Galaxy S24, 4K Monitor
7. **Form Submissions:** Live test of Contact, Enquiry, and Career forms to verify email delivery via custom domain

---

### Security backlog carried into this sweep (from the 2026-10-15 audit)
1. **Upgrade to Next.js 16.** `next@15.5.28` patches the critical advisories, but the PostCSS copy bundled inside Next 15 still has open advisories that are only fixed in Next 16 (build-time only — it processes our own CSS, not user input — so low practical risk).
2. **Persistent rate limiting.** `lib/rate-limit.ts` is in-memory and per-instance; on Vercel each serverless instance has its own counter. Move to Upstash Redis (`@upstash/ratelimit`) or Vercel KV.
3. **CSP nonces.** Replace `script-src 'unsafe-inline'` with a nonce generated in `middleware.ts`, required for an A+ on SecurityHeaders.com.
4. **Supabase RLS check.** The anon key is public by design; confirm every table has RLS enabled and only `SELECT` policies for public content.
5. **Bot protection on forms.** Add a honeypot field or Cloudflare Turnstile to Contact, Enquiry and Career forms (Turnstile needs CSP `script-src`/`frame-src` for `challenges.cloudflare.com`).
6. **`.env.example`.** It is currently ignored by `.env*` in `.gitignore`. If it should be committed as documentation, add `!.env.example` and confirm by hand it holds only placeholder values.

---

## Task 10.10 — Launch & Post-Launch Monitoring

1. Publish final production deployment
2. Submit updated dynamic sitemap in Google Search Console & Bing Webmaster Tools
3. Trigger initial indexing request for home page and key landing pages
4. Monitor Sentry & GA4 real-time dashboard for first 48 hours post-launch

---

## Phase 10 — Final Verification Checklist

- [ ] Admin panel functional at `/admin` behind Supabase auth middleware
- [ ] CRUD operations for Services, Blogs, Projects, Extensions, Contacts working
- [ ] Sentry error tracking configured and active
- [ ] GitHub Actions CI running lint, typecheck, build, and Lighthouse assertions
- [ ] Vercel production deployment active on `www.vrtechbro.com`
- [ ] SecurityHeaders.com score: **A+**
- [ ] Lighthouse scores: **Perf > 90, A11y > 95, Best Practices > 95, SEO 100**
- [ ] Forms verified end-to-end with verified domain email delivery
- [ ] Sitemaps submitted to Google Search Console and Bing
- [ ] Complete website rebuild launch successful!
