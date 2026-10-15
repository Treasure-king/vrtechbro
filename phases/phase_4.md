# Phase 4: 🔍 SEO Foundation

> **Goal:** Achieve 100/100 Lighthouse SEO score, proper structured data on every page, dynamic sitemap, analytics integration, and Google Search Console connection.
>
> **Estimated Tasks:** 10
> **Depends On:** Phase 1–3

---

## Task 4.1 — Create Dynamic Sitemap (`app/sitemap.ts`)

### Problem
The current `app/sitemap.xml` is a static file with hardcoded URLs and frozen `lastmod` dates. New blog posts and services added to Supabase won't appear.

### How to Fix
1. Delete `app/sitemap.xml`
2. Create `app/sitemap.ts`:

```ts
import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vrtechbro.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${baseUrl}/careers`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Dynamic service pages
  const { data: services } = await supabase.from('services').select('slug, updated_at')
  const servicePages: MetadataRoute.Sitemap = (services || []).map(s => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Dynamic blog pages
  const { data: blogs } = await supabase.from('blogs').select('slug, updated_at, published_at')
  const blogPages: MetadataRoute.Sitemap = (blogs || []).map(b => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : new Date(b.published_at),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...servicePages, ...blogPages]
}
```

### Verification
- [ ] Visit `/sitemap.xml` — auto-generated XML with current data
- [ ] All service and blog URLs are present
- [ ] `lastmod` dates are current
- [ ] Submit to Google Search Console

---

## Task 4.2 — Create Dynamic Robots (`app/robots.ts`)

### Problem
The current `app/robots.txt` is a static file. Using a programmatic `robots.ts` allows future flexibility.

### How to Fix
1. Delete `app/robots.txt`
2. Create `app/robots.ts`:

```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://www.vrtechbro.com/sitemap.xml',
  }
}
```

### Verification
- [ ] Visit `/robots.txt` — proper rules displayed
- [ ] `/api/` is disallowed
- [ ] Sitemap URL is present

---

## Task 4.3 — Fix All Metadata Consistency

### Problem
Metadata across pages uses inconsistent patterns — different `metadataBase` values, inconsistent canonical URL formats, some pages missing critical fields.

### How to Fix
1. In `app/layout.tsx`, ensure `metadataBase` is set: `metadataBase: new URL('https://www.vrtechbro.com')`
2. All canonical alternates should be relative (Next.js resolves against `metadataBase`):
   ```ts
   alternates: { canonical: '/about' }  // NOT the full URL
   ```
3. Audit every page's metadata:

| Page | Title ✅ | Description ✅ | Canonical ✅ | OG ✅ | Twitter ✅ |
|---|---|---|---|---|---|
| Home (`/`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| About | ✅ | ✅ | ✅ | ✅ | ✅ |
| Services | ✅ | ✅ | ✅ | ✅ | ✅ |
| Services/[slug] | ✅ | ✅ | ✅ | ✅ | ✅ |
| Blog | ✅ | ✅ | ✅ | ✅ | ✅ |
| Blog/[slug] | ✅ | ✅ | ⚠️ Fix `/blogs/` | ✅ | ✅ |
| Contact | ✅ | ✅ | ✅ | ✅ | ✅ |
| Careers | ❌ Add | ❌ Add | ❌ Add | ❌ Add | ❌ Add |
| FAQ | ✅ | ✅ | ⚠️ Use relative | ✅ | ✅ |
| Terms | ❌ Add | ❌ Add | ❌ Add | ❌ Add | ❌ Add |
| Privacy | ✅ | ✅ | ⚠️ Use relative | ✅ | ✅ |

### Verification
- [ ] Every page has title, description, canonical, OG, and Twitter tags
- [ ] All canonical URLs are correct (check page source)
- [ ] No duplicate or conflicting metadata

---

## Task 4.4 — Add Structured Data to Every Page Type

### Problem
Structured data is inconsistent — some pages have it, some have duplicates, some have none.

### How to Fix — Structured Data Plan

| Page | Schema Type | Location |
|---|---|---|
| Layout (global) | `Organization` | `app/layout.tsx` — single global instance |
| Home | `WebPage` + `WebSite` | `app/page.tsx` |
| About | `AboutPage` | `app/about/page.tsx` |
| Services list | `WebPage` | `app/services/page.tsx` |
| Service/[slug] | `Service` | `app/services/[slug]/page.tsx` |
| Blog list | `Blog` | `app/blog/page.tsx` |
| Blog/[slug] | `BlogPosting` with `Article` | `app/blog/[slug]/page.tsx` |
| Contact | `ContactPage` + `ContactPoint` | `app/contact/page.tsx` |
| FAQ | `FAQPage` (already done ✅) | `app/faq/page.tsx` |
| Careers | `JobPosting` per listing | `app/careers/page.tsx` |

### Key: Blog Post Schema
```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: blog.title,
  description: blog.description,
  author: { "@type": "Person", name: blog.author || "VRTechBro" },
  publisher: {
    "@type": "Organization",
    name: "VRTechBro",
    logo: { "@type": "ImageObject", url: "https://www.vrtechbro.com/logo.png" }
  },
  datePublished: blog.published_at,
  dateModified: blog.updated_at || blog.published_at,
  url: `https://www.vrtechbro.com/blog/${slug}`,
  image: blog.thumbnail || blog.image_url,
  wordCount: blog.content?.split(' ').length,
  timeRequired: `PT${blog.reading_time || 5}M`,
}
```

### Verification
- [ ] Test each page with Google Rich Results Test
- [ ] No errors or warnings
- [ ] Only one Organization schema per page load

---

## Task 4.5 — Add BreadcrumbList Schema

### How to Fix
Add breadcrumb JSON-LD to nested pages (services/[slug], blog/[slug]):

```ts
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vrtechbro.com" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://www.vrtechbro.com/services" },
    { "@type": "ListItem", position: 3, name: service.title, item: `https://www.vrtechbro.com/services/${slug}` },
  ]
}
```

### Verification
- [ ] Breadcrumbs show in Google Rich Results Test
- [ ] Navigation hierarchy is correct

---

## Task 4.6 — Add Google Analytics 4 (GA4)

### How to Fix
1. Create GA4 property in Google Analytics
2. Get Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to environment variables: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
4. Use `@next/third-parties/google` (official package):

```bash
npm install @next/third-parties
```

```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}
```

### Verification
- [ ] GA4 tracking code present in page source
- [ ] Real-time view in GA4 shows visits
- [ ] No console errors

---

## Task 4.7 — Connect Google Search Console

### Steps
1. Go to https://search.google.com/search-console
2. Add property: `https://www.vrtechbro.com`
3. Verify via DNS TXT record or HTML file method
4. Submit sitemap: `https://www.vrtechbro.com/sitemap.xml`
5. Check for crawl errors
6. Request indexing for key pages

### Verification
- [ ] Property verified
- [ ] Sitemap submitted and accepted
- [ ] No critical crawl errors

---

## Task 4.8 — Add Vercel Analytics (Optional)

### How to Fix
```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

// In body:
<Analytics />
```

### Verification
- [ ] Vercel dashboard shows analytics data

---

## Task 4.9 — Fix Heading Hierarchy on All Pages

### Problem
Some pages skip heading levels or have incorrect hierarchy.

### Audit & Fix
| Page | Current | Should Be |
|---|---|---|
| Home | Two `<h1>` tags | One `<h1>` in Hero, rest `<h2>` |
| About | `<h1>` then `<h3>` (skips h2) | `<h1>` → `<h2>` → `<h3>` |
| Services | `<h1>` correct | ✅ OK |
| Blog | `<h1>` correct | ✅ OK |
| FAQ | `<h1>` correct | ✅ OK |
| Contact | `<h1>` then `<h2>` inside `ContactForm` | Review nesting |

### Verification
- [ ] Lighthouse Accessibility passes heading hierarchy check
- [ ] Each page has exactly one `<h1>`
- [ ] No heading levels are skipped

---

## Task 4.10 — Implement Proper Blog Markdown Renderer

### Problem
`renderBlogContent()` in `app/blog/[slug]/page.tsx` is a hand-rolled parser that only supports `##`, `###`, `---`, bold, and paragraphs. No lists, links, images, code blocks, etc.

### How to Fix
Install a proper Markdown renderer:

```bash
npm install react-markdown remark-gfm rehype-highlight
```

Replace the custom renderer:
```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

// In the component:
<article className="prose prose-invert prose-lg max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeHighlight]}
  >
    {blog.content}
  </ReactMarkdown>
</article>
```

Add highlight.js CSS for code blocks:
```tsx
import 'highlight.js/styles/github-dark.css'
```

### Verification
- [ ] Bold text renders correctly
- [ ] Headings render correctly
- [ ] Code blocks have syntax highlighting
- [ ] Links are clickable
- [ ] Lists render correctly
- [ ] Images render correctly
- [ ] Tables render correctly (GFM)

---

## Phase 4 — Final Verification Checklist

- [ ] Lighthouse SEO Score: **100/100**
- [ ] Dynamic sitemap at `/sitemap.xml` with all pages
- [ ] Dynamic robots at `/robots.txt`
- [ ] Every page has complete metadata
- [ ] Structured data on every page type (test with Google Rich Results)
- [ ] GA4 tracking active
- [ ] Google Search Console connected and sitemap submitted
- [ ] Proper heading hierarchy on all pages
- [ ] Blog posts render full Markdown with syntax highlighting
- [ ] `npm run build` succeeds
