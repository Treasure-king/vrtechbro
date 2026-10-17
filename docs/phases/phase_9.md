# Phase 9: 🏆 Portfolio & Showcase Architecture

> **Goal:** Create a dedicated, high-impact Showcase section highlighting real projects, Chrome Extensions, npm packages, and open-source work with rich visuals, code snippets, metrics, and live demos. Replace the placeholder portfolio entirely.
>
> **Estimated Tasks:** 10
> **Depends On:** Phase 7 (Page Redesign). Does **not** need Phase 8 — run this phase before the 3D work.
>
> **Content rule:** every project, screenshot, metric and testimonial must be real. Use real screenshots (captured with Playwright at fixed viewport sizes for consistency), never AI-generated mockups of work that wasn't done.

---

## Why This Phase

A developer studio's credibility lives and dies by its portfolio. The site currently has a placeholder `/portfolio` page with two hardcoded `<div>` elements ("Project A" and "Project B"). This phase replaces that with a world-class Showcase experience that lets visitors interact with real work.

---

## Task 9.1 — Supabase Database Migration for Portfolio

### Tables to Create in Supabase

1. **`projects` table:**
   ```sql
   CREATE TABLE projects (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     tagline TEXT NOT NULL,
     description TEXT NOT NULL,
     long_description TEXT, -- Markdown format
     category TEXT NOT NULL, -- 'web', 'mobile', 'ai', 'blockchain', 'other'
     tech_stack TEXT[] NOT NULL,
     live_url TEXT,
     github_url TEXT,
     featured_image TEXT NOT NULL,
     screenshots TEXT[],
     video_url TEXT,
     featured BOOLEAN DEFAULT false,
     display_order INT DEFAULT 0,
     metrics JSONB, -- e.g. {"users": "10k+", "stars": 450}
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **`chrome_extensions` table:**
   ```sql
   CREATE TABLE chrome_extensions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     tagline TEXT NOT NULL,
     description TEXT NOT NULL,
     webstore_url TEXT NOT NULL,
     install_count INT DEFAULT 0,
     rating NUMERIC(2,1),
     icon_url TEXT NOT NULL,
     screenshots TEXT[] NOT NULL,
     video_url TEXT,
     features TEXT[] NOT NULL,
     display_order INT DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **`npm_packages` table:**
   ```sql
   CREATE TABLE npm_packages (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     description TEXT NOT NULL,
     npm_url TEXT NOT NULL,
     github_url TEXT NOT NULL,
     install_command TEXT NOT NULL,
     weekly_downloads INT DEFAULT 0,
     github_stars INT DEFAULT 0,
     version TEXT NOT NULL,
     tags TEXT[] NOT NULL,
     display_order INT DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### RLS Policies
- Enable RLS on all three tables
- Add `anon` SELECT policy for public read access
- Restrict write access to authenticated admin users

### Verification
- [ ] Tables created in Supabase
- [ ] Public read access works without auth
- [ ] Write access requires authentication

---

## Task 9.2 — Create TypeScript Types for Showcase

Create `types/showcase.ts`:

```ts
export interface Project {
  id: string
  title: string
  slug: string
  tagline: string
  description: string
  long_description?: string
  category: 'web' | 'mobile' | 'ai' | 'blockchain' | 'other'
  tech_stack: string[]
  live_url?: string
  github_url?: string
  featured_image: string
  screenshots?: string[]
  video_url?: string
  featured: boolean
  display_order: number
  metrics?: Record<string, string | number>
  created_at: string
  updated_at: string
}

export interface ChromeExtension {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  webstore_url: string
  install_count: number
  rating?: number
  icon_url: string
  screenshots: string[]
  video_url?: string
  features: string[]
  display_order: number
}

export interface NpmPackage {
  id: string
  name: string
  slug: string
  description: string
  npm_url: string
  github_url: string
  install_command: string
  weekly_downloads: number
  github_stars: number
  version: string
  tags: string[]
  display_order: number
}
```

### Verification
- [ ] Shared showcase interfaces defined cleanly
- [ ] No `any` types

---

## Task 9.3 — Build Main Showcase Page (`/showcase`)

Replace `/portfolio` with `/showcase` (redirect `/portfolio` to `/showcase`).

### Page Sections
1. **Hero Header:** Bold headline ("Crafted with Intent"), filter tabs (All, Web & Mobile, Chrome Extensions, npm Packages, Open Source)
2. **Featured Hero Project:** Full-width spotlight card for the flagship project
3. **Interactive Project Grid:** Filterable card grid with smooth transitions
4. **Chrome Extensions Carousel/Grid:** Specialized cards with Web Store badges and install metrics
5. **npm Packages Matrix:** Command terminal cards with copyable `npm i` commands and live download/star badges
6. **CTA:** "Have a project in mind?" conversion block

### Server Component Implementation
- Server-side fetch for all initial showcase items
- Pass data to filterable client wrapper for tab switching

### Verification
- [ ] Server-rendered initial state
- [ ] Tab switching updates items instantly without reloads
- [ ] Route `/portfolio` redirects (301) to `/showcase`

---

## Task 9.4 — Build Individual Project Case Study Page (`/showcase/[slug]`)

### Structure
1. **Header:** Title, tagline, tech stack tags, live links, launch date
2. **Hero Media:** High-resolution screenshot gallery or video demo player
3. **Overview & Challenge:** Problem statement and project scope
4. **Architecture & Solution:** Deep-dive into technical decisions, system diagrams, and code snippets
5. **Impact & Metrics:** Key metrics achieved (speed, users, stars, conversion)
6. **Interactive Gallery:** Multi-device preview (desktop + mobile frames)
7. **Next Project Link:** Seamless pagination to next project

### SEO & Metadata
- Dynamic metadata generator with OG image set to project screenshot
- Project schema (`SoftwareApplication` or `CreativeWork`)

### Verification
- [ ] Full case study renders cleanly with Markdown content
- [ ] Code blocks formatted with syntax highlighting
- [ ] Structured data passes Google Rich Results test

---

## Task 9.5 — Build Chrome Extension Showcase Component

### Component: `components/showcase/extension-card.tsx`
- Icon, title, rating stars, install count badge
- Direct link to Chrome Web Store with official icon badge
- Hover effect: plays short preview MP4 or shows screenshot carousel
- Key feature list with checkmarks
- Minimalist modal for full screenshot preview

### Verification
- [ ] Web Store link opens correctly in new tab with `rel="noopener noreferrer"`
- [ ] Install count formatted (e.g. `1,200+ active users`)
- [ ] Image modal displays screenshots in full resolution

---

## Task 9.6 — Build npm Package Terminal Component

### Component: `components/showcase/npm-package-card.tsx`
- Terminal style container (dark background, header dots, monospaced font)
- Interactive copy button for `npm install package-name` with toast notification
- Version badge, weekly downloads count, GitHub stars count
- Direct links to npmjs.com and GitHub repository
- Compact README excerpt or usage example snippet

### Interactive Behavior
```tsx
const copyCommand = () => {
  navigator.clipboard.writeText(pkg.install_command)
  toast.success('Copied to clipboard!')
}
```

### Verification
- [ ] Copy button copies exact command
- [ ] Toast notification triggers on click
- [ ] Links to npm and GitHub function correctly

---

## Task 9.7 — Multi-Device Frame Component for Web/App Projects

### Component: `components/showcase/device-frame.tsx`
- CSS/SVG browser frame for web projects (address bar, dots)
- Mobile mockup frame for app projects
- Light/Dark viewport toggle inside frame (if project supports it)
- Responsive scale so frames look crisp on all screens

### Verification
- [ ] Devices scale without overflow on mobile screens
- [ ] Frame visuals look sleek and integrated into the design system

---

## Task 9.8 — Integrate Showcase Items into Home Page

### Updates to `app/page.tsx`
1. Replace generic hardcoded cards with top 3 featured projects from Supabase
2. Add a compact npm packages snippet strip
3. Add Chrome Extension spotlight badge
4. Update home page JSON-LD to include top creative works

### Verification
- [ ] Home page displays real project data dynamically
- [ ] Links navigate directly to detailed case studies

---

## Task 9.9 — Add Sitemap Routes for Showcase Items

Update `app/sitemap.ts` to query `projects`, `chrome_extensions`, and `npm_packages` and include their URLs in the sitemap output.

```ts
const { data: projects } = await supabase.from('projects').select('slug, updated_at')
const projectPages: MetadataRoute.Sitemap = (projects || []).map(p => ({
  url: `${baseUrl}/showcase/${p.slug}`,
  lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
  changeFrequency: 'monthly',
  priority: 0.85,
}))
```

### Verification
- [ ] `/sitemap.xml` contains all project case study URLs

---

## Task 9.10 — Performance & Image Optimization for Showcase Media

### Guidelines
1. All project screenshots converted to WebP/AVIF format
2. Responsive `sizes` configured for standard cards vs full hero case study
3. Videos use `video/mp4` with `muted`, `loop`, `playsInline`, `autoPlay` and are lazily loaded with `IntersectionObserver`
4. Preload hero project images

### Verification
- [ ] Page weight stays < 600KB initial load
- [ ] Video playback starts smoothly without blocking main thread
- [ ] Lighthouse Performance score remains > 90

---

## Phase 9 — Final Verification Checklist

- [ ] Supabase tables (`projects`, `chrome_extensions`, `npm_packages`) active with RLS
- [ ] `/showcase` page replaces `/portfolio` with full filterable view
- [ ] `/portfolio` performs 301 redirect to `/showcase`
- [ ] Dynamic project case studies at `/showcase/[slug]` render correctly
- [ ] Chrome Extensions gallery renders with ratings, installs, and Web Store links
- [ ] npm package components allow one-click command copy with toast feedback
- [ ] Device frames display web/app screenshots crisply
- [ ] Home page features live projects fetched from Supabase
- [ ] Sitemap includes all showcase URLs
- [ ] `npm run build` succeeds
