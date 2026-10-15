# Phase 3: ⚡ Performance Optimization

> **Goal:** Optimize every asset, eliminate render-blocking resources, add loading states, fix animation patterns, and achieve Lighthouse Performance > 90.
>
> **Estimated Tasks:** 12
> **Depends On:** Phase 1 (Architecture), Phase 2 (Security)

---

## Task 3.1 — Optimize Logo & Favicon

### Problem
- `app/favicon.ico` is 1.2MB (should be < 50KB)
- `app/logo.png` is 1.2MB (same file)  
- `app/vrtechbro-logo.png` is 1.2MB (same file, used in OG tags)
- All three are the same PNG file with different names

### How to Fix
1. **Favicon:** Generate a proper multi-size `.ico` file from the logo:
   - 16x16, 32x32, 48x48 sizes
   - Use a tool like `sharp` or https://favicon.io
   - Target size: < 30KB
2. **Logo PNG:** Optimize with `sharp` or TinyPNG:
   - Resize to max 512x512 for the largest use case
   - Compress to < 50KB
3. **OG Image:** Create a proper 1200x630 social share image:
   - Brand colors, logo, tagline
   - Separate file from the logo
   - Target size: < 150KB
4. **Apple Touch Icon:** Generate a 180x180 PNG
5. Add to `app/layout.tsx` metadata:
   ```ts
   icons: {
     icon: '/favicon.ico',
     apple: '/apple-touch-icon.png',
   }
   ```

### Verification
- [ ] Favicon loads correctly in browser tab (< 30KB)
- [ ] OG image renders correctly when sharing link on Twitter/LinkedIn
- [ ] No 1.2MB files remain in `app/`

---

## Task 3.2 — Optimize Service Images

### Problem
Images in `public/images/` are unoptimized PNGs ranging from 147KB to 1.47MB each:
| Image | Size |
|---|---|
| `IT.png` | 1.47MB |
| `e-commerce.png` | 1.47MB |
| `automation.png` | 1.44MB |
| `ui-ux-design.png` | 1.28MB |
| `digital-marketing.png` | 1.26MB |
| `seo.png` | 1.26MB |
| `website-development.png` | 1.10MB |
| `cloud.png` | 873KB |
| `artificial-intelligence.png` | 567KB |
| `mobile-apps.png` | 359KB |
| `vrTechBro-bg-remove.png` | 256KB |
| `AboutUs.png` | 147KB |

### How to Fix
1. Convert all PNGs to **WebP** format
2. Resize to max 800px width (service cards never display larger)
3. Target: < 100KB per image
4. Use a build script or manual conversion with `sharp`:
   ```bash
   npx sharp-cli --input public/images/*.png --output public/images/ --format webp --quality 80 --resize 800
   ```
5. Update all references from `.png` to `.webp`
6. Keep original PNGs as fallbacks if needed (or delete if WebP support is sufficient)
7. Ensure all `next/image` usage includes proper `width`, `height`, and `sizes` props

### Verification
- [ ] Total `public/images/` folder size reduced by > 80%
- [ ] All images still display correctly
- [ ] No broken image references

---

## Task 3.3 — Add Proper `next/image` Configuration

### Problem
Service images from Supabase storage (external URLs) are loaded via `next/image` but no remote patterns are configured in `next.config.ts`.

### How to Fix
Add image domains/remote patterns to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      // Add any other image CDN hostnames
    ],
  },
  // ... security headers
};
```

### Verification
- [ ] External Supabase images load without errors
- [ ] Next.js image optimization is active (check network tab for `/_next/image` URLs)

---

## Task 3.4 — Fix Animation Patterns (`animate` → `whileInView`)

### Problem
Every animated component uses `initial` + `animate`, meaning:
- Animations play immediately on page load, even for off-screen content
- Content below the fold is invisible for `delay * N` seconds
- Users never see the animation because it already played before they scrolled

### How to Fix
For all below-the-fold content, change from:
```tsx
// ❌ Bad — plays immediately on mount
<motion.div
  initial={{ opacity: 0, y: 80 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, delay }}
>
```

To:
```tsx
// ✅ Good — plays when element enters viewport
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-50px' }}
  transition={{ duration: 0.4, delay }}
>
```

### Files to Update
| File | Component | Above/Below Fold |
|---|---|---|
| `hero.tsx` | Hero text, CTA | Above fold → keep `animate` |
| `navbar.tsx` | Logo, nav links | Above fold → keep `animate` |
| `service-card.tsx` | Service cards | Below fold → use `whileInView` |
| `blog-card.tsx` | Blog cards | Below fold → use `whileInView` |
| `BlogClient.tsx` | Blog list cards | Below fold → use `whileInView` |
| `TechTags.tsx` | CSS-only animation | N/A — CSS handles this |

### Verification
- [ ] Service cards animate when scrolled into view
- [ ] Blog cards animate when scrolled into view
- [ ] Animations only play once (not on every scroll back)
- [ ] Hero still animates immediately on load

---

## Task 3.5 — Add `prefers-reduced-motion` Support

### Problem
No respect for users who have reduced motion enabled in their OS settings.

### How to Fix
1. Add a global CSS rule:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

2. For Motion components, use the `useReducedMotion` hook:
```tsx
import { useReducedMotion } from 'motion/react'

const shouldReduceMotion = useReducedMotion()

<motion.div
  initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
>
```

### Verification
- [ ] Enable reduced motion in OS settings → no animations play
- [ ] Disable reduced motion → animations work normally

---

## Task 3.6 — Add Loading States (Skeleton Screens)

### Problem
When pages fetch data from Supabase, there's no loading state — sections are just empty until data arrives.

### How to Fix
Create `loading.tsx` files for routes that fetch data:

1. **`app/loading.tsx`** — Global loading state (full page skeleton)
2. **`app/services/loading.tsx`** — Services page skeleton
3. **`app/blog/loading.tsx`** — Blog page skeleton

Example skeleton component:
```tsx
// app/services/loading.tsx
export default function ServicesLoading() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="h-12 w-96 bg-surface animate-pulse rounded-lg mx-auto mb-6" />
      <div className="h-6 w-2/3 bg-surface animate-pulse rounded mx-auto mb-12" />
      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-80 bg-surface animate-pulse rounded-2xl" />
        ))}
      </div>
    </main>
  )
}
```

### Verification
- [ ] Slow the network in DevTools → skeleton screens appear
- [ ] Skeletons have smooth pulse animation
- [ ] Content replaces skeletons when loaded

---

## Task 3.7 — Add Error Boundaries

### Problem
If any component throws (Supabase error, network failure, rendering error), the entire page crashes with no recovery UI.

### How to Fix
Create `error.tsx` files:

1. **`app/error.tsx`** — Global error boundary
2. **`app/services/error.tsx`** — Services-specific error
3. **`app/blog/error.tsx`** — Blog-specific error

```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-gray-400">We're sorry, an unexpected error occurred.</p>
        <button
          onClick={reset}
          className="btn rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
```

### Verification
- [ ] Simulate an error → error page renders with "Try Again" button
- [ ] "Try Again" resets the error and re-renders
- [ ] Error doesn't crash the entire application

---

## Task 3.8 — Add Custom 404 Page

### Problem
No custom `not-found.tsx` exists. Blog and service detail pages call `notFound()` but the default Next.js 404 is bland and unbranded.

### How to Fix
Create `app/not-found.tsx`:

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold text-accent">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-gray-400 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn inline-block rounded-lg">
          Go Home
        </Link>
      </div>
    </div>
  )
}
```

### Verification
- [ ] Visit `/nonexistent-page` → custom 404 renders
- [ ] 404 page matches site styling
- [ ] "Go Home" link works

---

## Task 3.9 — Dynamic Import Heavy Components

### Problem
`ServiceOverlay` (305 lines, Zod, modal) and `CareerForm` (269 lines, Zod, file upload) are statically imported even though they're only rendered when a user clicks a button.

### How to Fix
Use `next/dynamic` for these components:

```tsx
import dynamic from 'next/dynamic'

const ServiceOverlay = dynamic(() => import('@/components/ServiceOverlay'), {
  loading: () => <button className="btn rounded-full px-6 py-3" disabled>Loading...</button>,
})
```

Similarly for `CareerForm` on the careers page.

### Verification
- [ ] Initial bundle size reduced (check `_next/static/chunks`)
- [ ] Modals still open and function correctly
- [ ] Brief loading state shows before modal is ready

---

## Task 3.10 — Optimize TechTags Scroll Animation

### Problem
The CSS-only infinite scroll has a visible "jump" when the animation resets. The two `<ul>` elements aren't perfectly synced.

### How to Fix
1. Use a single container with `translateX` animation
2. Ensure the content is wide enough to seamlessly loop
3. Use `will-change: transform` for GPU acceleration
4. Consider using `IntersectionObserver` to pause when not visible

```css
.tech-marquee {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
  will-change: transform;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

Duplicate the content inside a single container so the content width is exactly 2x, and `-50%` brings it back to start.

### Verification
- [ ] No visible jump or stutter in the scroll
- [ ] Animation is smooth at 60fps
- [ ] Pauses when off-screen (optional)

---

## Task 3.11 — Add `sizes` Prop to All `next/image` Components

### Problem
Many `next/image` uses don't specify the `sizes` prop. Without it, Next.js generates full-width srcsets, serving larger images than necessary.

### How to Fix
Add appropriate `sizes` to each image:

```tsx
// Service card image
<Image
  src={image_url}
  alt={title}
  width={400}
  height={300}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// Hero logo
<Image
  src={vrTechBro}
  alt="VRTechBro logo"
  width={180}
  height={180}
  sizes="180px"
  priority
/>
```

### Verification
- [ ] Check network tab — images serve appropriate sizes for viewport
- [ ] No oversized images on mobile

---

## Task 3.12 — Remove Empty `styles/` Directory

### Problem
`styles/globals.css` is empty and unused. The real CSS is in `app/globals.css`. The `styles/` directory is dead weight.

### How to Fix
1. Delete `styles/` directory entirely
2. Verify no imports reference it

### Verification
- [ ] `styles/` directory is deleted
- [ ] Build succeeds

---

## Phase 3 — Final Verification Checklist

- [ ] Lighthouse Performance Score > **90**
- [ ] Total page weight < 500KB (gzipped, initial load)
- [ ] All images optimized (WebP, < 100KB each)
- [ ] Favicon < 30KB
- [ ] Loading skeletons appear on slow networks
- [ ] Error boundaries catch and display errors gracefully
- [ ] Custom 404 page exists
- [ ] Below-fold animations use `whileInView`
- [ ] `prefers-reduced-motion` is respected
- [ ] Heavy components are dynamically imported
- [ ] TechTags scroll is smooth with no jump
- [ ] All `next/image` components have `sizes` prop
- [ ] `npm run build` succeeds
