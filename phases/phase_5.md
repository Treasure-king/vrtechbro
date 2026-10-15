# Phase 5: 🧹 Code Quality & Developer Experience

> **Goal:** Clean up every rough edge — naming conventions, imports, TypeScript strictness, README, git hygiene, and developer tooling. After this phase, the codebase is a joy to work in.
>
> **Estimated Tasks:** 8
> **Depends On:** Phases 1–4

---

## Task 5.1 — Standardize File Naming Convention

### Problem
Component files use mixed naming: `TechTags.tsx` (PascalCase), `BlogClient.tsx` (PascalCase), `blog-card.tsx` (kebab-case).

### Decision
**All component files → kebab-case.** This is the convention used by ShadCN, Next.js examples, and the majority of the existing files.

| Current | Renamed |
|---|---|
| `components/TechTags.tsx` | `components/tech-tags.tsx` |
| `components/BlogClient.tsx` | `components/blog-client.tsx` |
| `components/ServiceOverlay.tsx` | `components/service-overlay.tsx` |
| `components/CareerForm.tsx` | `components/career-form.tsx` |

### Steps
1. Rename files
2. Update all import paths across the codebase
3. The exported component names remain PascalCase (e.g., `export default function TechTags()`)

### Verification
- [ ] All component files are kebab-case
- [ ] All imports updated
- [ ] Build succeeds

---

## Task 5.2 — Standardize All Imports to Use `@/` Path Aliases

### Problem
Some files use relative imports (`../public/images/vrTechBro-bg-remove.png`) instead of path aliases.

### Files to Fix
| File | Current Import | Should Be |
|---|---|---|
| `navbar.tsx` | `'../public/images/vrTechBro-bg-remove.png'` | `'@/public/images/vrTechBro-bg-remove.png'` |
| `hero.tsx` | `'../public/images/vrTechBro-bg-remove.png'` | `'@/public/images/vrTechBro-bg-remove.png'` |
| `page.tsx` (home) | `'@/public/images/AboutUs.png'` | ✅ Already correct |

### Verification
- [ ] `grep -r "'\.\.\/" components/` returns zero results
- [ ] All imports use `@/` prefix

---

## Task 5.3 — Clean Up `app/globals.css`

### Problem
The CSS file has:
- Redundant `body { background-color: black; }` that conflicts with `@apply bg-background text-foreground`
- ShadCN's `:root` variables define light mode colors that are never used (site is dark-only)
- The `@theme` block and `@theme inline` block overlap in defining `--color-primary`, `--color-accent`, `--color-card`
- Comments like `/* 🖤 Deep dark navy */` with emoji

### How to Fix
1. Remove the standalone `body { background-color: black; }` — let `@apply bg-background` handle it
2. Keep `:root` and `.dark` variables — they'll be needed when light mode is added in Phase 6
3. Resolve the `--color-primary` / `--color-accent` / `--color-card` conflicts between `@theme` and `@theme inline`
4. Remove emoji from comments
5. Add section comments for organization:
   ```css
   /* ========================================
    * Custom Theme Tokens
    * ======================================== */
   ```

### Verification
- [ ] No conflicting color definitions
- [ ] CSS is well-organized with clear sections
- [ ] No emoji in comments
- [ ] Build succeeds, colors unchanged

---

## Task 5.4 — Add Proper TypeScript Configuration

### Problem
While `strict: true` is set, there are still patterns like:
- `as BlogCardProps[]` (type assertion instead of type guard)
- `service.icon as keyof typeof iconMap` (unsafe cast)
- `service.keywords?.length > 0` (works but accidental)

### How to Fix
1. Create shared Supabase type helpers:
```ts
// types/supabase.ts
import { ServiceCardProps } from './service-card'
import { BlogCardProps } from './blog-card'

export function isServiceArray(data: unknown): data is ServiceCardProps[] {
  return Array.isArray(data)
}

export function isBlogArray(data: unknown): data is BlogCardProps[] {
  return Array.isArray(data)
}
```

2. Use type guards instead of assertions where possible
3. Add `noUncheckedIndexedAccess: true` to tsconfig for stricter array access (optional, evaluate impact)

### Verification
- [ ] No `as` type assertions that could be replaced with type guards
- [ ] Build succeeds with zero TypeScript errors
- [ ] No `any` types in custom code

---

## Task 5.5 — Create Proper README

### Problem
The README is default Next.js boilerplate with zero project-specific information.

### How to Fix
Create a comprehensive README:

```markdown
# VRTechBro

> Modern digital studio website — built with Next.js 15, Supabase, Tailwind CSS v4, and Motion.

## Live Site
https://www.vrtechbro.com

## Tech Stack
- **Framework:** Next.js 15 (App Router, Server Components)
- **Styling:** Tailwind CSS v4 + ShadCN UI
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Animation:** Motion (framer-motion)
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Setup
1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in values
3. `npm install`
4. `npm run dev`

### Environment Variables
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_TO` | Destination email for form submissions |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID |

## Project Structure
[Include the directory tree from memory.md]

## Scripts
- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
```

### Verification
- [ ] README contains setup instructions
- [ ] New developer can set up the project by following README

---

## Task 5.6 — Create `.env.example`

### Problem
No `.env.example` file exists. New developers have no idea what environment variables are needed.

### How to Fix
Create `.env.example`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Resend Email
RESEND_API_KEY=
EMAIL_TO=

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

### Verification
- [ ] `.env.example` exists and is committed to git
- [ ] `.env.example` does NOT contain actual values

---

## Task 5.7 — Move Hardcoded Data to Constants/Config

### Problem
- FAQ data is hardcoded in the page component
- Job listings are hardcoded in the careers page
- Tech tags are hardcoded in `TechTags.tsx`
- Navigation links are hardcoded in `navbar.tsx` and `footer.tsx`

### How to Fix
Create a `lib/constants.ts` (or `config/`) for shared static data:

```ts
// lib/constants.ts
export const SITE_URL = 'https://www.vrtechbro.com'
export const COMPANY_NAME = 'VRTechBro'
export const COMPANY_LEGAL_NAME = 'VRTechBro Pvt. Ltd.'
export const CONTACT_EMAIL = 'vrtechbro@gmail.com'

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Careers', href: '/careers' },
] as const

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/vrtechbro',
  instagram: 'https://www.instagram.com/vrtechbro_official',
  github: 'https://github.com/vrtechbro',
  twitter: 'https://x.com/vrtechbro',
} as const

export const TECH_TAGS = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js',
  'Node.js', 'Express', 'MongoDB', 'Supabase', 'Tailwind CSS',
  'Python', 'Docker',
] as const
```

Update all components to import from this central source.

### Verification
- [ ] `lib/constants.ts` exists with all shared data
- [ ] Navbar, footer, tech tags import from constants
- [ ] Changing a value in constants updates everywhere

---

## Task 5.8 — Rename Career API Route File Extension

### Problem
`app/api/career-apply/route.tsx` uses `.tsx` extension but API routes don't use JSX. Should be `.ts`.

### How to Fix
Rename `route.tsx` → `route.ts`

### Verification
- [ ] File renamed
- [ ] API still works
- [ ] Build succeeds

---

## Phase 5 — Final Verification Checklist

- [ ] All component files follow kebab-case naming
- [ ] All imports use `@/` path aliases
- [ ] CSS is clean, organized, no emoji comments
- [ ] TypeScript is strict, minimal type assertions
- [ ] README is comprehensive with setup instructions
- [ ] `.env.example` exists
- [ ] Shared constants in `lib/constants.ts`
- [ ] All API routes use `.ts` extension
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes with zero errors
- [ ] Code feels professional and maintainable

---

> **🎉 After Phase 5, the foundation is complete.** Every structural, security, performance, SEO, and code quality flaw from the original audit is resolved. The codebase is now a solid, clean, well-architected foundation ready for the design transformation in Phases 6–10.
