# 📋 VRTechBro — Requirements Specification

> **Last Updated:** 2026-07-27
> This document defines the complete requirements for the VRTechBro website rebuild — covering functional, non-functional, technical, and content requirements.

---

## 1. Functional Requirements

### 1.1 — Pages & Routes

| # | Page | Route | Rendering | Data Source | Priority |
|---|---|---|---|---|---|
| F1 | Home | `/` | SSR/SSG | Supabase (services, blogs, projects) | 🔴 Critical |
| F2 | About | `/about` | SSG | Static (with dynamic team data later) | 🟡 High |
| F3 | Services List | `/services` | SSR/SSG | Supabase (services) | 🔴 Critical |
| F4 | Service Detail | `/services/[slug]` | SSG (ISR) | Supabase (single service) | 🔴 Critical |
| F5 | Blog List | `/blog` | SSR/SSG | Supabase (blogs) | 🟡 High |
| F6 | Blog Detail | `/blog/[slug]` | SSG (ISR) | Supabase (single blog) | 🟡 High |
| F7 | Portfolio / Showcase | `/showcase` | SSG | Supabase or static (projects, extensions, packages) | 🔴 Critical |
| F8 | Contact | `/contact` | SSG | Static + form submission | 🟡 High |
| F9 | Careers | `/careers` | SSR | Supabase (job listings) | 🟢 Medium |
| F10 | FAQ | `/faq` | SSG | Supabase or static | 🟢 Medium |
| F11 | Privacy Policy | `/privacy-policy` | SSG | Static | 🟢 Medium |
| F12 | Terms & Conditions | `/terms` | SSG | Static | 🟢 Medium |
| F13 | 404 Not Found | Auto | SSG | Static | 🟡 High |
| F14 | Error Page | Auto | SSG | Static | 🟡 High |

### 1.2 — Hero Section
| # | Requirement | Priority |
|---|---|---|
| F15 | Custom 3D scene rendered with Three.js / R3F | 🔴 Critical |
| F16 | 3D scene responds to mouse movement / scroll | 🔴 Critical |
| F17 | Scroll-based transition from 3D scene to content | 🟡 High |
| F18 | Bold headline with animated text reveal | 🟡 High |
| F19 | CTA button with hover micro-animation | 🟡 High |
| F20 | 3D model built in Blender and exported as `.glb`/`.gltf` | 🔴 Critical |

### 1.3 — Portfolio / Showcase Section
| # | Requirement | Priority |
|---|---|---|
| F21 | Display all completed projects with screenshots/video | 🔴 Critical |
| F22 | Each project: title, description, tech stack, live link, source link, media | 🔴 Critical |
| F23 | Chrome Extension gallery: name, screenshots, Web Store link, install count | 🔴 Critical |
| F24 | npm Package showcase: name, description, install command, weekly downloads, GitHub link | 🟡 High |
| F25 | Filter/sort projects by category (Web, Mobile, Extension, Package) | 🟢 Medium |
| F26 | Project detail pages with case study format | 🟡 High |

### 1.4 — Services
| # | Requirement | Priority |
|---|---|---|
| F27 | Services fetched from Supabase and rendered server-side | 🔴 Critical |
| F28 | Featured services displayed on home page (limit 3–6) | 🟡 High |
| F29 | Service detail page with rich content, use cases, CTA | 🟡 High |
| F30 | Service enquiry form (modal overlay) with Zod validation | 🟡 High |
| F31 | Service enquiry sends email via Resend | 🟡 High |

### 1.5 — Blog
| # | Requirement | Priority |
|---|---|---|
| F32 | Blog posts fetched from Supabase and rendered server-side | 🔴 Critical |
| F33 | Proper Markdown/MDX rendering (headings, lists, code blocks, images, links, tables) | 🔴 Critical |
| F34 | Syntax highlighting for code blocks | 🟡 High |
| F35 | Author, reading time, published date displayed | 🟡 High |
| F36 | Category/tag filtering on blog list page | 🟢 Medium |
| F37 | Social share buttons on blog detail page | 🟢 Medium |
| F38 | Related posts suggestion at bottom of blog detail | 🟢 Medium |

### 1.6 — Contact
| # | Requirement | Priority |
|---|---|---|
| F39 | Contact form with name, email, message fields | 🔴 Critical |
| F40 | Client-side validation with Zod | 🟡 High |
| F41 | Server-side validation on API route | 🔴 Critical |
| F42 | Email sent via Resend with proper `from` domain | 🔴 Critical |
| F43 | Success/error toast notifications | 🟡 High |
| F44 | Company contact info (email, working hours) | 🟡 High |
| F45 | Rate limiting on contact API (max 5/min per IP) | 🔴 Critical |

### 1.7 — Careers
| # | Requirement | Priority |
|---|---|---|
| F46 | Job listings fetched from Supabase (not hardcoded) | 🟡 High |
| F47 | Application form with resume upload | 🟡 High |
| F48 | Resume sent as email attachment via Resend | 🟡 High |
| F49 | File validation (type, size limit) on server | 🔴 Critical |

### 1.8 — Navigation
| # | Requirement | Priority |
|---|---|---|
| F50 | Sticky header with glassmorphism backdrop | 🟡 High |
| F51 | Active route highlighting | 🟡 High |
| F52 | Mobile hamburger menu with smooth animation | 🟡 High |
| F53 | "Skip to content" accessibility link | 🔴 Critical |
| F54 | Mobile menu focus trap | 🔴 Critical |

### 1.9 — Footer
| # | Requirement | Priority |
|---|---|---|
| F55 | Navigation links (Privacy, Terms, About, Contact, Services, Blog) | 🟡 High |
| F56 | Social media links (LinkedIn, Instagram, GitHub, X) | 🟡 High |
| F57 | Copyright notice | 🟡 High |
| F58 | Newsletter signup (future) | 🟢 Low |

---

## 2. Non-Functional Requirements

### 2.1 — Performance
| # | Requirement | Target | Priority |
|---|---|---|---|
| NF1 | Largest Contentful Paint (LCP) | < 2.5 seconds | 🔴 Critical |
| NF2 | First Input Delay (FID) | < 100ms | 🔴 Critical |
| NF3 | Cumulative Layout Shift (CLS) | < 0.1 | 🔴 Critical |
| NF4 | Total page weight (initial load) | < 500KB (gzipped) | 🟡 High |
| NF5 | Time to Interactive (TTI) | < 3.5 seconds | 🟡 High |
| NF6 | Lighthouse Performance Score | > 90/100 | 🟡 High |
| NF7 | Image optimization (WebP/AVIF, lazy loading) | All images | 🔴 Critical |
| NF8 | Code splitting / dynamic imports for heavy components | 3D, modals, forms | 🟡 High |

### 2.2 — SEO
| # | Requirement | Target | Priority |
|---|---|---|---|
| NF9 | Lighthouse SEO Score | 100/100 | 🔴 Critical |
| NF10 | All pages have unique title, description, canonical URL | Every page | 🔴 Critical |
| NF11 | Structured data (JSON-LD) on all page types | Organization, WebPage, Service, BlogPosting, FAQPage | 🔴 Critical |
| NF12 | Dynamic sitemap auto-updated from Supabase | `app/sitemap.ts` | 🔴 Critical |
| NF13 | Open Graph and Twitter Card tags on all pages | Every page | 🟡 High |
| NF14 | Single H1 per page with proper heading hierarchy | Every page | 🔴 Critical |
| NF15 | All images have descriptive alt text | Every image | 🟡 High |
| NF16 | Google Search Console connected | — | 🔴 Critical |
| NF17 | Google Analytics 4 connected | — | 🟡 High |

### 2.3 — Security
| # | Requirement | Target | Priority |
|---|---|---|---|
| NF18 | SecurityHeaders.com grade | A+ | 🔴 Critical |
| NF19 | Content Security Policy (CSP) header | Configured | 🔴 Critical |
| NF20 | HSTS header with preload | `max-age=63072000` | 🔴 Critical |
| NF21 | X-Content-Type-Options | `nosniff` | 🔴 Critical |
| NF22 | X-Frame-Options | `DENY` | 🟡 High |
| NF23 | Referrer-Policy | `strict-origin-when-cross-origin` | 🟡 High |
| NF24 | Permissions-Policy | Restrict camera, mic, geolocation | 🟡 High |
| NF25 | Server-side input validation on all API routes | Zod schemas | 🔴 Critical |
| NF26 | HTML escaping on user inputs before email interpolation | All API routes | 🔴 Critical |
| NF27 | Rate limiting on all public API routes | 5 req/min/IP | 🔴 Critical |
| NF28 | Supabase Row Level Security properly configured | All tables | 🔴 Critical |
| NF29 | No sensitive env vars exposed to client | Audit | 🔴 Critical |

### 2.4 — Accessibility
| # | Requirement | Target | Priority |
|---|---|---|---|
| NF30 | Lighthouse Accessibility Score | > 95/100 | 🟡 High |
| NF31 | Keyboard navigation works on all interactive elements | Full site | 🔴 Critical |
| NF32 | Screen reader compatibility (proper ARIA labels) | Full site | 🔴 Critical |
| NF33 | Focus trap in modals | ServiceOverlay, CareerForm | 🔴 Critical |
| NF34 | Skip navigation link | Present | 🔴 Critical |
| NF35 | Color contrast ratio | WCAG AA (4.5:1 minimum) | 🟡 High |
| NF36 | Reduced motion support (`prefers-reduced-motion`) | All animations | 🟡 High |

### 2.5 — Responsive Design
| # | Requirement | Priority |
|---|---|---|
| NF37 | Mobile-first responsive design (320px–1920px+) | 🔴 Critical |
| NF38 | Touch-friendly tap targets (minimum 44x44px) | 🟡 High |
| NF39 | 3D scene degrades gracefully on low-power devices | 🟡 High |
| NF40 | No horizontal scroll on any breakpoint | 🔴 Critical |

---

## 3. Technical Requirements

### 3.1 — Stack
| Component | Technology | Notes |
|---|---|---|
| Framework | Next.js 15+ (App Router) | Server Components as default |
| Language | TypeScript (strict mode) | No `any` types |
| Styling | Tailwind CSS v4 | CSS-first config, remove v3 config file |
| UI Library | ShadCN (new-york) | Continue using, keep updated |
| Animation | Motion (framer-motion) | Standardize to `'motion/react'` imports |
| 3D | Three.js + @react-three/fiber + @react-three/drei | Use for hero and showcase |
| Database | Supabase (PostgreSQL) | Server-side queries, proper RLS |
| Email | Resend | Custom domain sender address |
| Forms | react-hook-form + Zod | Client + server validation |
| Toast | Sonner | Keep |
| Icons | Lucide React | Primary icon library |
| Font | Inter (body) + Space Grotesk (display) + JetBrains Mono (code) | Via `next/font` |
| Hosting | Vercel | Automatic |

### 3.2 — Dependencies to Remove
- `@clerk/nextjs` — not used, add back when admin auth is needed
- Remove `framer-motion` imports — standardize to `motion/react`

### 3.3 — Dependencies to Add
- `react-markdown` or `next-mdx-remote` — proper Markdown rendering
- `rehype-highlight` or `shiki` — syntax highlighting
- `next-rate-limit` or custom middleware — API rate limiting
- DOMPurify or `sanitize-html` — input sanitization
- `@vercel/analytics` — performance monitoring

### 3.4 — File/Folder Conventions
- Components: **kebab-case** filenames (e.g., `service-card.tsx`)
- Pages: Next.js App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`)
- Imports: Always use `@/` path aliases, never relative `../`
- Types: Colocate with components or in `/types` for shared types
- No emoji comments in source code

### 3.5 — Git Conventions
- Feature branches with descriptive names
- Conventional commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`)
- Custom README with setup instructions

---

## 4. Content Requirements

### 4.1 — Required Content
| Content | Source | Status |
|---|---|---|
| Company description/about text | Written by owner | ⚠️ Needs refinement |
| Service descriptions (9+ services) | Supabase | ✅ Exists |
| Blog posts | Supabase | ✅ Exists (6+ posts) |
| Project portfolio items | To be created | ❌ Missing |
| Chrome extension listings | To be created | ❌ Missing |
| npm package listings | To be created | ❌ Missing |
| Job listings | To be moved to Supabase | ⚠️ Hardcoded |
| FAQ content | Hardcoded | ✅ Exists |
| Privacy policy text | Static | ✅ Exists |
| Terms & conditions text | Static | ✅ Exists |
| Optimized logo (SVG preferred) | To be created | ❌ Missing (current is 1.2MB PNG) |
| OG share image (1200×630) | To be created | ❌ Missing |
| Favicon (multi-size ICO + apple-touch) | To be created | ❌ Missing |

### 4.2 — 3D Assets
| Asset | Source | Format | Status |
|---|---|---|---|
| Hero 3D model ("The Forge" workstation) | Build in Blender | `.glb` | ❌ To be built |
| Skills constellation (if Option C) | Procedural (Three.js) | N/A | ❌ To be built |

### 4.3 — Images
- All service images should be optimized to WebP, max 200KB each
- About page needs a professional photo or illustration
- Project screenshots needed for portfolio
- Chrome extension screenshots needed

---

## 5. Supabase Schema Requirements

### 5.1 — New Tables Needed

#### `projects` table
| Column | Type | Required | Description |
|---|---|---|---|
| id | UUID | Yes | Primary key |
| title | text | Yes | Project name |
| slug | text | Yes | URL slug |
| description | text | Yes | Brief description |
| long_description | text | No | Case study content |
| tech_stack | text[] | Yes | Technologies used |
| category | text | Yes | `web`, `mobile`, `extension`, `package`, `other` |
| live_url | text | No | Live demo link |
| source_url | text | No | GitHub/source link |
| screenshots | text[] | No | Array of image URLs |
| video_url | text | No | Demo video URL |
| featured | boolean | No | Show on home page |
| display_order | integer | No | Sort order |
| created_at | timestamp | Yes | Auto |
| updated_at | timestamp | Yes | Auto |

#### `chrome_extensions` table
| Column | Type | Required | Description |
|---|---|---|---|
| id | UUID | Yes | Primary key |
| name | text | Yes | Extension name |
| description | text | Yes | Brief description |
| webstore_url | text | Yes | Chrome Web Store link |
| install_count | integer | No | Number of installs |
| screenshots | text[] | No | Screenshots |
| video_url | text | No | Demo video |
| created_at | timestamp | Yes | Auto |

#### `npm_packages` table
| Column | Type | Required | Description |
|---|---|---|---|
| id | UUID | Yes | Primary key |
| name | text | Yes | Package name |
| description | text | Yes | Brief description |
| npm_url | text | Yes | npmjs.com link |
| github_url | text | No | GitHub link |
| weekly_downloads | integer | No | npm weekly downloads |
| created_at | timestamp | Yes | Auto |

#### `jobs` table (migrate from hardcoded)
| Column | Type | Required | Description |
|---|---|---|---|
| id | UUID | Yes | Primary key |
| title | text | Yes | Job title |
| location | text | Yes | Location |
| type | text | Yes | Full-time, Contract, etc. |
| description | text | Yes | Job description |
| is_active | boolean | Yes | Whether listing is live |
| created_at | timestamp | Yes | Auto |

### 5.2 — Existing Tables to Verify
- `services` — verify RLS policies, add missing columns if needed
- `blogs` — verify RLS policies, ensure `content` supports full Markdown

---

## 6. Testing Requirements

| # | Requirement | Tool | Priority |
|---|---|---|---|
| T1 | Component unit tests | Vitest + React Testing Library | 🟢 Medium |
| T2 | API route integration tests | Vitest | 🟡 High |
| T3 | Lighthouse CI automated checks | Lighthouse CI | 🟡 High |
| T4 | Accessibility automated testing | axe-core | 🟡 High |
| T5 | E2E critical user flows | Playwright | 🟢 Medium |
| T6 | Visual regression testing | Playwright screenshots | 🟢 Low |

---

## 7. Deployment Requirements

| # | Requirement | Priority |
|---|---|---|
| D1 | Vercel deployment with preview URLs for PRs | 🟡 High |
| D2 | Environment variables configured in Vercel dashboard | 🔴 Critical |
| D3 | Custom domain (vrtechbro.com) with proper DNS | ✅ Done |
| D4 | HTTPS with HSTS preload list submission | 🟡 High |
| D5 | Edge functions for API routes where beneficial | 🟢 Medium |
| D6 | ISR (Incremental Static Regeneration) for dynamic pages | 🟡 High |
