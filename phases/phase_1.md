# Phase 1: 🏗️ Architecture Repair

> **Goal:** Fix every structural bug that makes the site fundamentally broken — wrong APIs, client-rendering where server-rendering is needed, dead code, broken imports, and conflicting configurations.
>
> **Estimated Tasks:** 22
> **Depends On:** Nothing (this is the first phase)

---

## Why This Comes First

The site currently has **5 pages** where SEO metadata silently fails because `next/head` doesn't work in App Router. The **3 most important pages** (Home, Services, Blog) render empty shells to Google because they're client-side rendered. The Tailwind config has a v3/v4 conflict. These aren't style issues — they're **structural failures** that make everything else built on top unreliable.

Nothing else matters until the architecture is sound.

---

## Task 1.1 — Remove `next/head` from All App Router Pages

### Problem
`next/head` (`Head` from `'next/head'`) is a Pages Router API. In the App Router, it's **silently ignored** — it doesn't throw an error, it simply does nothing. Five pages currently use it, meaning their titles, descriptions, OG tags, and JSON-LD are never rendered.

### Affected Files
| File | Current Issue | Fix |
|---|---|---|
| `app/page.tsx` | Uses `Head` for title, meta, OG, Twitter, JSON-LD | Move to `metadata` export (requires SSR conversion — see Task 1.2) |
| `app/services/page.tsx` | Uses `Head` for title, meta, keywords, canonical | Move to `metadata` export (requires SSR conversion — see Task 1.3) |
| `app/careers/page.tsx` | Uses `Head` for title, meta, OG, keywords | Add `export const metadata` (requires SSR conversion — see Task 1.4) |
| `app/contact/page.tsx` | Uses `Head` for JSON-LD only (metadata export exists) | Remove `Head`, move JSON-LD to layout or `<script>` in component |
| `app/terms/page.tsx` | Uses `Head` for title, meta, keywords, canonical | Add `export const metadata`, remove `Head` |

### How to Fix

**For `app/terms/page.tsx`** (simplest — no state, pure server component):
1. Remove `import Head from "next/head"`
2. Add `import { Metadata } from "next"` 
3. Add `export const metadata: Metadata = { ... }` with all the values currently in `<Head>`
4. Remove the entire `<Head>...</Head>` block from JSX
5. Remove the `<> ... </>` fragment wrapper (just return `<main>`)

**For `app/contact/page.tsx`** (already has metadata export):
1. Remove `import Head from 'next/head'`
2. The JSON-LD that was in `<Head>` needs to be moved to a `<script type="application/ld+json">` directly in the JSX body (outside `Head`)
3. Remove the `<Head>` block
4. The existing `export const metadata` stays as-is

**For `app/page.tsx`, `app/services/page.tsx`, `app/careers/page.tsx`** — these require SSR conversion first (Tasks 1.2–1.4), then metadata is added via the metadata API.

### Verification
- [ ] `grep -r "next/head" app/` returns zero results
- [ ] Build succeeds (`npm run build`)
- [ ] View page source in browser — metadata tags are present in HTML

---

## Task 1.2 — Convert Home Page to Server-Side Rendering

### Problem
`app/page.tsx` is `'use client'` with `useEffect`/`useState` to fetch services and blogs from Supabase. This means:
- Google sees an empty page (no services, no blogs in the HTML)
- LCP is delayed by the network waterfall: load JS → execute → fetch data → render
- The SEO metadata via `Head` doesn't work (see Task 1.1)

### How to Fix

**Strategy:** Split into a Server Component parent and Client Component children.

1. **Convert `app/page.tsx` to a Server Component:**
   - Remove `'use client'`
   - Remove `useEffect`, `useState`, `Head` imports
   - Make the component `async`
   - Fetch services and blogs directly with `supabase.from(...).select(...)` at the top of the function
   - Add `export const metadata: Metadata = { ... }` (move values from the old `Head`)
   - Add JSON-LD via `<script type="application/ld+json">` in the JSX
   - Pass fetched data as props to client components that need interactivity

2. **Keep interactive components as `'use client'`:**
   - `<Hero />` — uses motion animations → stays client
   - `<ServiceCard />` — uses motion → stays client
   - `<BlogCard />` — uses motion → stays client
   - `<ContactForm />` — uses form state → stays client
   - `<TechTags />` — uses CSS animation → can actually be a server component (no JS needed)

3. **Fix the duplicate `<h1>` issue:**
   - The hero section has `<h1>Empowering Your Digital Future</h1>`
   - The about section has `<h1>Your Trusted Full-Stack IT Partner</h1>`
   - Change the about section heading to `<h2>`

### Key Code Pattern
```tsx
// app/page.tsx — Server Component
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
// ... component imports

export const metadata: Metadata = {
  title: 'VRTechBro – Empowering Your Digital Future',
  description: '...',
  // ... all metadata
}

export default async function HomePage() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: true })
    .limit(3)

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .limit(3)

  return (
    <div className="min-h-screen">
      <Hero />
      <TechTags />
      {/* About section with <h2> instead of <h1> */}
      {/* Services section — pass services as props */}
      {/* Blog section — pass blogs as props */}
      <ContactForm />
    </div>
  )
}
```

### Verification
- [ ] `app/page.tsx` does NOT have `'use client'` at the top
- [ ] View page source → services and blog content is in the raw HTML
- [ ] Only one `<h1>` tag in the rendered HTML
- [ ] `export const metadata` is present
- [ ] Page loads and functions correctly in browser

---

## Task 1.3 — Convert Services Page to Server-Side Rendering

### Problem
Same as home page — `app/services/page.tsx` is `'use client'` with client-side Supabase fetch. Uses broken `Head` for metadata.

### How to Fix

1. Remove `'use client'`
2. Remove `useEffect`, `useState`, `Head` imports
3. Make the component `async`
4. Fetch services directly: `const { data: services, error } = await supabase.from('services').select('*')...`
5. Add `export const metadata: Metadata = { ... }` with current `Head` values
6. Remove the `<Head>` block
7. Handle error state with a server-side conditional (no `setError`)

### Verification
- [ ] `app/services/page.tsx` does NOT have `'use client'`
- [ ] View page source → service cards are in the raw HTML
- [ ] Metadata tags visible in page source

---

## Task 1.4 — Convert Careers Page to Server-Side Rendering (Partial)

### Problem
`app/careers/page.tsx` is `'use client'` primarily because it uses `useState` for the selected job modal. It also uses broken `Head`.

### How to Fix

**Strategy:** Keep the page as a Server Component for metadata, extract the interactive job listing into a Client Component.

1. Create `components/careers-client.tsx` as `'use client'`:
   - Move the job data, `useState`, and the modal logic here
   - Accept jobs as a prop (for future Supabase migration)
   
2. Convert `app/careers/page.tsx` to a Server Component:
   - Remove `'use client'`
   - Remove `Head` import
   - Add `export const metadata: Metadata = { ... }`
   - Import and render `<CareersClient />`
   - Pass the hardcoded jobs array as props

### Verification
- [ ] `app/careers/page.tsx` does NOT have `'use client'`
- [ ] `export const metadata` is present
- [ ] Job listings still function (click Apply, modal opens)

---

## Task 1.5 — Convert Blog List to Server-Side Rendering

### Problem
`app/blog/page.tsx` renders `<BlogClient />` which is `'use client'` and fetches all blogs client-side.

### How to Fix

1. Remove `components/BlogClient.tsx` (or repurpose it)
2. Make `app/blog/page.tsx` an async Server Component
3. Fetch blogs server-side
4. Render `<BlogCard>` components directly (they can stay client for hover animation)
5. The metadata export already exists — keep it
6. Move JSON-LD to the server component

### Verification
- [ ] View page source → blog cards are in the raw HTML
- [ ] Blog list page loads correctly
- [ ] JSON-LD is in the page source

---

## Task 1.6 — Fix Terms Page Metadata

### Problem
`app/terms/page.tsx` uses broken `Head` with no `export const metadata`.

### How to Fix
1. Remove `import Head from "next/head"`
2. Add `import { Metadata } from "next"`
3. Add `export const metadata: Metadata = { title: "Terms & Conditions | VRTechBro", ... }`
4. Remove the `<Head>` block from JSX
5. Remove fragment wrapper `<>...</>` — just return `<main>`

### Verification
- [ ] No `Head` import in the file
- [ ] `<title>` tag visible in page source
- [ ] Build succeeds

---

## Task 1.7 — Fix Contact Page JSON-LD

### Problem
`app/contact/page.tsx` already has `export const metadata` (good), but uses `Head` to inject JSON-LD (broken).

### How to Fix
1. Remove `import Head from 'next/head'`
2. Move the JSON-LD `<script>` out of `<Head>` and into the main JSX body
3. Remove the `<Head>` block
4. Remove fragment wrapper if no longer needed

### Verification
- [ ] JSON-LD visible in page source
- [ ] No `Head` import

---

## Task 1.8 — Fix Service Detail Page `<head>` Tag

### Problem
`app/services/[slug]/page.tsx` manually renders a `<head>` HTML tag with meta tags AND uses `generateMetadata()`. The manual `<head>` is wrong in App Router — Next.js manages the `<head>`.

### How to Fix
1. Remove the entire `<head>...</head>` block from the JSX
2. The `generateMetadata()` function already handles title, description, OG, Twitter, canonical — keep it
3. Move the JSON-LD `<script>` out of `<head>` and into the main JSX body (it can be in any part of the component return)
4. Remove any duplicate meta tags

### Verification
- [ ] No `<head>` tag in the component JSX
- [ ] `generateMetadata()` still works
- [ ] JSON-LD still renders
- [ ] Build succeeds

---

## Task 1.9 — Fix Broken JSON-LD URLs

### Problem
- `hero.tsx` has `"logo": "https://https://www.vrtechbro.com//images/vrTechBro.png"` — double protocol, double slash
- `hero.tsx` has `"url": "https://www.vrtechbro.com/"` with comment `// Replace with your real URL`

### How to Fix
1. Fix the logo URL to `"https://www.vrtechbro.com/images/vrTechBro.png"`
2. Remove the `// Replace with your real URL` comment
3. Also fix: `hero.tsx` uses `framer-motion` import instead of `motion/react` (see Task 1.12)

### Verification
- [ ] JSON-LD in hero has valid URLs
- [ ] No broken double-protocol URLs anywhere: `grep -r "https://https://" app/ components/`

---

## Task 1.10 — Remove Duplicate JSON-LD Blocks

### Problem
The same Organization JSON-LD is injected in 4 places:
1. `app/layout.tsx` — root layout
2. `components/hero.tsx` — hero section
3. `components/footer.tsx` — footer
4. `app/page.tsx` — home page (via `@graph`)

Google sees 4 competing Organization schemas on a single page load.

### How to Fix
1. Keep ONE canonical Organization JSON-LD in `app/layout.tsx` (it applies globally)
2. Remove the JSON-LD `<script>` from `hero.tsx` entirely
3. Remove the JSON-LD `<script>` from `footer.tsx` entirely
4. In `app/page.tsx`, keep the WebPage schema but remove the Organization part (it's already in the layout)

### Verification
- [ ] Only ONE Organization JSON-LD exists per page load
- [ ] Page-specific schemas (WebPage, Service, Blog, FAQPage) remain on their respective pages
- [ ] Validate with Google Rich Results Test

---

## Task 1.11 — Fix Tailwind v3/v4 Configuration Conflict

### Problem
- `tailwind.config.js` uses v3 format (`module.exports = { ... }`) with hex colors
- `globals.css` uses v4 format (`@theme { ... }`) with oklch colors
- Both define the same color tokens with different values
- Tailwind v4 uses CSS-first configuration — the JS config file is legacy

### How to Fix
1. **Delete `tailwind.config.js`** — it's the legacy v3 config
2. All color tokens are already defined in `globals.css` via `@theme` — these are the canonical values
3. The `darkMode: 'class'` setting from the v3 config is already handled by `@custom-variant dark (&:is(.dark *))` in globals.css
4. The `content` paths from v3 config are not needed in Tailwind v4 (it uses automatic content detection)
5. Verify the build still works after deletion

### Verification
- [ ] `tailwind.config.js` is deleted
- [ ] `npm run build` succeeds
- [ ] All color classes still work (check a few pages visually)
- [ ] Dark mode variant still works

---

## Task 1.12 — Standardize Motion Imports

### Problem
Some files import from `'framer-motion'` (old package name), others from `'motion/react'` (new package). The installed package is `motion` v12.

| File | Current Import | Should Be |
|---|---|---|
| `hero.tsx` | `framer-motion` | `motion/react` |
| `service-card.tsx` | `framer-motion` | `motion/react` |
| `blog-card.tsx` | `framer-motion` | `motion/react` |
| `navbar.tsx` | `motion/react` | ✅ Correct |
| `BlogClient.tsx` | `motion/react` | ✅ Correct |
| `CareerForm.tsx` | `motion/react` | ✅ Correct |
| `ServiceOverlay.tsx` | `motion/react` | ✅ Correct |

### How to Fix
1. In `hero.tsx`: Change `import { motion } from 'framer-motion'` → `import { motion } from 'motion/react'`
2. In `service-card.tsx`: Same change
3. In `blog-card.tsx`: Same change

### Verification
- [ ] `grep -r "framer-motion" components/` returns zero results
- [ ] All animations still work
- [ ] Build succeeds

---

## Task 1.13 — Remove Unused Dependencies

### Problem
Multiple heavy dependencies are installed but never used:

| Package | Size Impact | Used? |
|---|---|---|
| `@clerk/nextjs` | ~500KB | ❌ Never imported |
| `@react-three/drei` | ~2MB | ❌ Never imported |
| `@react-three/fiber` | ~500KB | ❌ Never imported |
| `three` | ~600KB | ❌ Never imported |
| `@types/three` | Dev only | ❌ Not needed |

### How to Fix
```bash
npm uninstall @clerk/nextjs @react-three/drei @react-three/fiber three @types/three
```

> **Note:** These will be reinstalled in Phase 8 when 3D integration actually begins. Removing them now keeps the bundle clean.

### Verification
- [ ] `npm run build` succeeds
- [ ] Bundle size reduced (check `.next/` output)
- [ ] No import errors

---

## Task 1.14 — Remove Dead Files

### Problem
Several files exist but are completely empty or unused.

| File | Issue | Action |
|---|---|---|
| `lib/validators.ts` | Empty file (0 bytes) | Delete |
| `styles/globals.css` | Empty file (0 bytes), unused | Delete |
| `public/file.svg` | Default Next.js asset, unused | Delete |
| `public/globe.svg` | Default Next.js asset, unused | Delete |
| `public/next.svg` | Default Next.js asset, unused | Delete |
| `public/vercel.svg` | Default Next.js asset, unused | Delete |
| `public/window.svg` | Default Next.js asset, unused | Delete |
| `public/models/minimal_laptop.glb` | 28 bytes, corrupted/empty placeholder | Delete |

### How to Fix
Delete all listed files. Verify no file references them:
```bash
grep -r "file.svg\|globe.svg\|next.svg\|vercel.svg\|window.svg\|validators\|minimal_laptop" app/ components/ lib/
```

### Verification
- [ ] All listed files are deleted
- [ ] No broken imports
- [ ] Build succeeds

---

## Task 1.15 — Fix Navbar Aria-Label Error

### Problem
The "Get in Touch" CTA button in the navbar has `aria-label="Login to your account"` — a copy-paste error from a template.

### How to Fix
1. In `navbar.tsx`, desktop nav: Change `aria-label="Login to your account"` → `aria-label="Get in touch with VRTechBro"`
2. In `navbar.tsx`, mobile nav: Same fix for the mobile "Get in Touch" button

### Verification
- [ ] `grep -r "Login to your account" components/` returns zero results

---

## Task 1.16 — Fix Duplicate `<header role="banner">`

### Problem
Both `navbar.tsx` and `hero.tsx` render `<header role="banner">`. A page should have only ONE banner landmark.

### How to Fix
1. In `hero.tsx`: Change `<header role="banner">` to `<section role="region">`
2. Update `aria-label` to remain descriptive
3. The navbar remains the sole `<header role="banner">`

### Verification
- [ ] Only one `role="banner"` in the rendered HTML
- [ ] Accessibility audit passes (no duplicate landmark warning)

---

## Task 1.17 — Fix Blog Canonical URL Mismatch

### Problem
In `app/blog/[slug]/page.tsx`, the `generateMetadata()` function sets:
```ts
canonical: `${siteUrl}/blogs/${slug}`  // WRONG: /blogs/ (plural)
```
But the actual route is `/blog/${slug}` (singular).

### How to Fix
Change `blogs` to `blog` in the canonical URL:
```ts
const blogUrl = `${siteUrl}/blog/${slug}`
```

### Verification
- [ ] Canonical URL in page source matches the actual URL
- [ ] `grep -r "/blogs/" app/blog/` — only the variable name, not the URL path

---

## Task 1.18 — Fix `next-themes` Usage Without Provider

### Problem
`components/ui/sonner.tsx` imports `useTheme` from `next-themes`, but no `ThemeProvider` wraps the application. This means `useTheme()` always returns the default value.

### How to Fix (Temporary — Full theme support in Phase 6)
1. For now, remove the `useTheme` import from `sonner.tsx`
2. Hardcode the theme to `"dark"` since the entire site is dark-themed
3. This will be properly implemented with a `ThemeProvider` in Phase 6

### Verification
- [ ] Toast notifications still work
- [ ] No console warnings about missing ThemeProvider

---

## Task 1.19 — Fix Inconsistent Branding

### Problem
The company name appears differently across the site:
- "VRTechBro" (most common)
- "vrtechbro" (footer copyright)
- "VRTECHBRO Pvt. Ltd." (contact page)
- "VrTechBro" (careers page)

### How to Fix
Standardize to:
- **Brand name:** "VRTechBro" (PascalCase with VR uppercase)
- **Legal name:** "VRTechBro Pvt. Ltd." (when legal context requires it)
- **Copyright:** "© {year} VRTechBro. All rights reserved."

Files to update:
- `app/careers/page.tsx` — "VrTechBro" → "VRTechBro" (appears multiple times)
- `components/footer.tsx` — "vrtechbro" → "VRTechBro" in copyright text
- Review all pages for consistency

### Verification
- [ ] `grep -ri "vrtechbro" app/ components/` — all instances use consistent casing
- [ ] No "VrTechBro" (wrong case) anywhere

---

## Task 1.20 — Remove Emoji Comments from Source Code

### Problem
Production source code contains emoji-laden comments: `// 🛠️`, `// 👤`, `// 📰`, `// 📞`, `// 🚀`, `// ✅`, `// 🟡`, `// 🟠`, `// 🔁`, etc. along with TODO-style comments like `// Replace with your real URL`.

### How to Fix
1. Remove all emoji from code comments
2. Remove stale TODO/placeholder comments
3. Keep meaningful architectural comments (just without emoji)
4. Remove `'your@email.com'` fallback references (these should be proper env vars)

### Verification
- [ ] Code comments are clean and professional
- [ ] No placeholder comments remain

---

## Task 1.21 — Fix `ServiceCardProps` Icon Type

### Problem
`types/service-card.ts` defines `icon` as `LucideIcon | string`, but the component receives it as a component passed from `iconMap`. The Supabase data stores the icon as a string (e.g., "Bot"), then it's looked up in `iconMap`. The type should reflect this dual nature more clearly.

### How to Fix
1. Keep the type as-is but add a JSDoc comment explaining the mapping
2. In the service card, the `icon` prop receives the resolved component (not the string), so the component prop type should be `LucideIcon | undefined`
3. The raw Supabase data type can have `icon: string` separately

### Verification
- [ ] No TypeScript errors
- [ ] Service cards render with correct icons

---

## Task 1.22 — Remove Duplicate Logo Files

### Problem
Three files in `app/` are identical (all 1,222,665 bytes):
- `app/favicon.ico` (1.2MB — not a real ICO)
- `app/logo.png` (1.2MB)
- `app/vrtechbro-logo.png` (1.2MB)

### How to Fix (Temporary — proper optimization in Phase 3)
1. Keep `app/logo.png` as the reference logo
2. Keep `app/vrtechbro-logo.png` (used in OG metadata)
3. Note: The favicon will be properly created in Phase 3 (Performance)
4. For now, just note these are duplicates — don't break references

### Verification
- [ ] At minimum, document which files reference which logo

---

## Phase 1 — Final Verification Checklist

After all tasks are complete:

- [ ] `npm run build` succeeds with zero errors
- [ ] `grep -r "next/head" app/` returns zero results
- [ ] `grep -r "framer-motion" components/` returns zero results  
- [ ] `grep -r "Login to your account" components/` returns zero results
- [ ] Every page has working metadata (check page source of each route)
- [ ] Home page HTML source contains service and blog content
- [ ] Services page HTML source contains service cards
- [ ] Blog list page HTML source contains blog cards
- [ ] Only one `<h1>` per page
- [ ] Only one `role="banner"` landmark per page
- [ ] No duplicate JSON-LD Organization blocks
- [ ] All JSON-LD URLs are valid (no double protocols)
- [ ] Blog canonical URLs use `/blog/` not `/blogs/`
- [ ] Tailwind v3 config file is deleted
- [ ] All unused dependencies are removed
- [ ] All dead files are deleted
- [ ] Brand name is consistent across the site
- [ ] Build bundle size is noticeably smaller than before
