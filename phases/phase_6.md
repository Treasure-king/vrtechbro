# Phase 6: 🎨 Design System Revolution

> **Goal:** Build a complete, premium design system from scratch — new color palette, typography, spacing, component library, glassmorphism, gradients, and micro-interactions. Every component gets rebuilt to feel Awwwards-worthy.
>
> **Estimated Tasks:** 12
> **Depends On:** Phases 1–5 (Foundation Complete)

---

## Why A Full Design System

The current site uses ad-hoc Tailwind classes with no consistent system. Colors are defined in three places, typography is just "Inter," and components have inconsistent padding, borders, and shadows. A design system ensures every element feels cohesive, premium, and intentional.

---

## Task 6.1 — Define New Color Palette

Replace all existing color tokens in `globals.css` `@theme` block.

### New Dark Mode Palette
| Token | OKLCH Value | Hex Approx | Usage |
|---|---|---|---|
| `--color-bg-primary` | `oklch(0.09 0.005 280)` | #0d0e14 | Main background |
| `--color-bg-secondary` | `oklch(0.13 0.01 275)` | #171926 | Cards, elevated surfaces |
| `--color-bg-tertiary` | `oklch(0.17 0.015 275)` | #1f2237 | Hover states, active states |
| `--color-border-subtle` | `oklch(0.22 0.01 270)` | #2a2d42 | Default borders |
| `--color-border-strong` | `oklch(0.30 0.015 270)` | #3a3e59 | Focused borders |
| `--color-text-primary` | `oklch(0.95 0.005 260)` | #eff0f6 | Headings |
| `--color-text-secondary` | `oklch(0.72 0.01 260)` | #a5a8c0 | Body text |
| `--color-text-muted` | `oklch(0.50 0.01 260)` | #6b6f89 | Captions, timestamps |
| `--color-accent-primary` | `oklch(0.68 0.19 275)` | #6366f1 | Primary interactive — indigo |
| `--color-accent-hover` | `oklch(0.73 0.20 275)` | #818cf8 | Hover on primary |
| `--color-accent-secondary` | `oklch(0.72 0.16 330)` | #e879a0 | Secondary accent — rose |
| `--color-success` | `oklch(0.72 0.16 155)` | #34d399 | Success |
| `--color-error` | `oklch(0.65 0.22 25)` | #f87171 | Error |
| `--color-warning` | `oklch(0.80 0.16 85)` | #fbbf24 | Warning |

### Gradient System
```css
--gradient-primary: linear-gradient(135deg, oklch(0.60 0.22 275), oklch(0.68 0.19 330));
--gradient-subtle: linear-gradient(135deg, oklch(0.13 0.01 275), oklch(0.09 0.005 280));
--gradient-glow: radial-gradient(circle at 50% 50%, oklch(0.68 0.19 275 / 15%), transparent 70%);
```

### Verification
- [ ] All color tokens defined in `@theme` block
- [ ] Old color tokens removed or aliased
- [ ] Visual check: dark, sophisticated, premium feel

---

## Task 6.2 — Set Up Typography System

### Fonts
```tsx
// app/layout.tsx
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

// In <html>:
<html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
```

### Type Scale
```css
@theme {
  --font-display: var(--font-space-grotesk), system-ui, sans-serif;
  --font-body: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}
```

| Level | Font | Size | Weight | Tracking |
|---|---|---|---|---|
| Display (Hero H1) | Space Grotesk | 4rem–5rem | 800 | -0.02em |
| H1 | Space Grotesk | 2.5rem–3rem | 700 | -0.015em |
| H2 | Space Grotesk | 2rem | 600 | -0.01em |
| H3 | Space Grotesk | 1.5rem | 600 | 0 |
| Body Large | Inter | 1.125rem | 400 | 0 |
| Body | Inter | 1rem | 400 | 0 |
| Small | Inter | 0.875rem | 400 | 0.01em |
| Code | JetBrains Mono | 0.875rem | 400 | 0 |

### Verification
- [ ] Three fonts loaded via `next/font`
- [ ] Display headings use Space Grotesk
- [ ] Body text uses Inter
- [ ] Code blocks use JetBrains Mono

---

## Task 6.3 — Build New Button Component

Replace the `.btn` utility class with a proper variant-based button system.

### Variants
| Variant | Style |
|---|---|
| `primary` | Gradient background (indigo → rose), white text |
| `secondary` | Transparent, accent border, accent text |
| `ghost` | Transparent, no border, text color on hover |
| `destructive` | Red background, white text |

### Sizes
| Size | Padding | Font |
|---|---|---|
| `sm` | px-3 py-1.5 | text-sm |
| `md` | px-5 py-2.5 | text-base |
| `lg` | px-7 py-3.5 | text-lg |

### Micro-Interactions
- Hover: subtle scale (1.02) + shadow increase
- Active: scale down (0.98)
- Focus: accent ring with offset
- Transition: 200ms ease-out

### Verification
- [ ] All buttons across the site use the new component
- [ ] Hover, active, focus states all work
- [ ] Accessible (keyboard focusable, visible focus ring)

---

## Task 6.4 — Build New Card Component

### Design
- Background: `bg-secondary` with subtle border
- Hover: lift effect (translateY -2px) + border color change + subtle glow
- Border radius: 16px (rounded-2xl)
- Padding: consistent 24px
- Shadow: layered shadows for depth

### Verification
- [ ] Service cards, blog cards use new card system
- [ ] Hover effects are smooth and premium

---

## Task 6.5 — Rebuild Navbar with Glassmorphism

### Design
- Background: `rgba(13, 14, 20, 0.7)` with `backdrop-blur-xl`
- Subtle bottom border with gradient
- Logo with hover glow effect
- Nav links with underline animation (width 0 → 100% from center)
- Active link indicator: dot or gradient underline
- CTA button: gradient, stands out from nav links
- Mobile menu: full-screen overlay with staggered animations
- Shrink on scroll: reduce padding when scrolled past hero

### Verification
- [ ] Glassmorphism effect visible when content scrolls behind
- [ ] Mobile menu has smooth open/close
- [ ] Active route clearly indicated
- [ ] Accessible (keyboard navigation, focus trap on mobile)

---

## Task 6.6 — Rebuild Footer

### Design
- Multi-column layout: Company info, Quick Links, Services, Social
- Gradient top border
- Newsletter signup form (placeholder for now)
- Social icons with hover color effects
- Subtle pattern or gradient background
- Copyright with proper legal name

### Verification
- [ ] Footer has rich content layout
- [ ] All links work
- [ ] Responsive on all breakpoints

---

## Task 6.7 — Build Spacing & Layout System

### Spacing Scale
Use consistent spacing values across the site:
```css
--space-xs: 0.25rem;  /* 4px */
--space-sm: 0.5rem;   /* 8px */
--space-md: 1rem;     /* 16px */
--space-lg: 1.5rem;   /* 24px */
--space-xl: 2rem;     /* 32px */
--space-2xl: 3rem;    /* 48px */
--space-3xl: 4rem;    /* 64px */
--space-4xl: 6rem;    /* 96px */
```

### Section Spacing
- Between major sections: `py-24` or `py-32`
- Within sections: consistent `gap` values from the scale

### Verification
- [ ] Consistent spacing throughout the site
- [ ] No ad-hoc padding/margin values

---

## Task 6.8 — Add Theme Provider for Dark/Light Mode

### How to Fix
1. Install `next-themes` (already installed):
2. Create a `ThemeProvider` wrapper:
```tsx
// components/theme-provider.tsx
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
```

3. Wrap the app in `layout.tsx`
4. Fix `sonner.tsx` to use the real `useTheme` now
5. **No toggle yet** — dark is default, light mode comes in a future update

### Verification
- [ ] `ThemeProvider` wraps the app
- [ ] `useTheme()` returns correct theme
- [ ] Dark mode is the default

---

## Task 6.9 — Create Utility CSS Classes

### Common Patterns
```css
/* Glassmorphism */
.glass {
  background: oklch(0.13 0.01 275 / 70%);
  backdrop-filter: blur(20px);
  border: 1px solid oklch(0.22 0.01 270 / 50%);
}

/* Glow effect */
.glow {
  box-shadow: 0 0 20px oklch(0.68 0.19 275 / 20%);
}

/* Text gradient */
.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Smooth entrance */
.animate-in {
  animation: fadeInUp 0.6s ease-out forwards;
}
```

### Verification
- [ ] Utility classes work and are reusable
- [ ] Used consistently across components

---

## Task 6.10 — Build New Service Card Component

### Design
- Uses new card system
- Image with overlay gradient on hover
- Elegant tag pills
- "Learn more" with arrow animation
- Smooth entrance with `whileInView`

---

## Task 6.11 — Build New Blog Card Component

### Design
- Uses new card system
- Prominent title with hover color shift
- Date and reading time
- Tag pills with category colors
- Author avatar (future)

---

## Task 6.12 — Design System Documentation

Create `research/design-system.md` documenting:
- Color tokens and their usage
- Typography scale
- Spacing system
- Component variants
- Animation patterns
- Accessibility requirements

---

## Phase 6 — Final Verification Checklist

- [ ] New color palette applied across entire site
- [ ] Three fonts loaded and used correctly
- [ ] New button component with all variants
- [ ] New card component with hover effects
- [ ] Glassmorphism navbar
- [ ] Rich footer layout
- [ ] Consistent spacing throughout
- [ ] ThemeProvider wraps the app
- [ ] Design feels premium, dark, cinematic
- [ ] All interactive elements have hover/focus/active states
- [ ] Site passes accessibility contrast checks
- [ ] `npm run build` succeeds
