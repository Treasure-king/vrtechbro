# 🎨 VRTechBro — Design System Specification

> **Version:** 2.0 (Phase 6 Design Revolution)  
> **Last Updated:** 2026-08-31  
> **Status:** Active & Canonical  
> **Framework:** Next.js 15 + Tailwind CSS v4 (`@theme`) + Motion v12 + ShadCN UI (new-york)

---

## 1. 🌈 Color Palette (OKLCH Native)

The color palette is built using perceptual OKLCH color space for uniform lightness, vibrant chroma, and accessible contrast ratios against dark backgrounds.

### Color Tokens (`app/globals.css`)

| Token | OKLCH Value | Hex Approx | Role / Usage | Contrast vs bg-primary |
|---|---|---|---|---|
| `--color-bg-primary` | `oklch(0.09 0.005 280)` | `#0d0e14` | Canonical page background (deep dark) | Base surface |
| `--color-bg-secondary` | `oklch(0.13 0.01 275)` | `#171926` | Card surfaces, modal containers, inputs | Elevated +4% lightness |
| `--color-bg-tertiary` | `oklch(0.17 0.015 275)` | `#1f2237` | Hover states, active pill badges, skeletons | Elevated +8% lightness |
| `--color-border-subtle` | `oklch(0.22 0.01 270)` | `#2a2d42` | Default subtle borders on cards and dividers | Low visual noise |
| `--color-border-strong` | `oklch(0.30 0.015 270)` | `#3a3e59` | Focused, hovered, and active borders | High emphasis |
| `--color-text-primary` | `oklch(0.95 0.005 260)` | `#eff0f6` | Primary headings, titles, high-contrast text | > 14:1 (AAA) |
| `--color-text-secondary` | `oklch(0.72 0.01 260)` | `#a5a8c0` | Body copy, descriptions, subtitles | > 7:1 (AAA) |
| `--color-text-muted` | `oklch(0.50 0.01 260)` | `#6b6f89` | Timestamps, captions, metadata labels | > 4.5:1 (AA) |
| `--color-accent-primary` | `oklch(0.68 0.19 275)` | `#6366f1` | Primary interactive color (indigo brand) | > 5.5:1 (AA) |
| `--color-accent-hover` | `oklch(0.73 0.20 275)` | `#818cf8` | Hover state for interactive primary accents | > 7:1 (AAA) |
| `--color-accent-secondary` | `oklch(0.72 0.16 330)` | `#e879a0` | Secondary accent (rose) for dual gradients | Accent highlights |
| `--color-success` | `oklch(0.72 0.16 155)` | `#34d399` | Success toasts, live indicators, code blocks | Status green |
| `--color-error` | `oklch(0.65 0.22 25)` | `#f87171` | Form validation errors, destructive buttons | Status red |
| `--color-warning` | `oklch(0.80 0.16 85)` | `#fbbf24` | Warning alerts, status indicators | Status amber |

### Gradient System

```css
/* Primary Interactive Gradient (Indigo → Rose) */
--gradient-primary: linear-gradient(135deg, oklch(0.60 0.22 275), oklch(0.72 0.16 330));

/* Subtle Surface Gradient (Navy → Dark) */
--gradient-subtle: linear-gradient(135deg, oklch(0.13 0.01 275), oklch(0.09 0.005 280));

/* Ambient Radial Glow Effect */
--gradient-glow: radial-gradient(circle at 50% 50%, oklch(0.68 0.19 275 / 15%), transparent 70%);
```

---

## 2. 🔤 Typography & Font Hierarchy

Three Google Fonts loaded via `next/font/google` with zero layout shift (`display: 'swap'`):

1. **Space Grotesk** (`--font-display`): Expressive, modern geometric sans-serif for headings and brand titles.
2. **Inter** (`--font-body`): Highly legible neutral workhorse for body copy, paragraphs, and UI labels.
3. **JetBrains Mono** (`--font-mono`): High-clarity monospace font for code blocks, snippets, and data values.

### Type Scale

| Level | Target Elements | Font Family | Size | Weight | Tracking | Line Height |
|---|---|---|---|---|---|---|
| **Display (Hero)** | Hero H1 | Space Grotesk | `4rem`–`5rem` (`text-5xl`–`6xl`) | 800 (ExtraBold) | `-0.02em` | `1.1` |
| **H1** | Page Titles | Space Grotesk | `2.5rem`–`3rem` (`text-4xl`–`5xl`) | 700 (Bold) | `-0.015em` | `1.2` |
| **H2** | Section Headings | Space Grotesk | `1.875rem`–`2.25rem` (`text-3xl`–`4xl`) | 700 (Bold) | `-0.01em` | `1.25` |
| **H3** | Card / Subsection Titles | Space Grotesk | `1.25rem`–`1.5rem` (`text-xl`–`2xl`) | 600 (SemiBold) | `0` | `1.3` |
| **H4** | Subheadings | Space Grotesk | `1.125rem` (`text-lg`) | 600 (SemiBold) | `0` | `1.4` |
| **Body Large** | Intros, Lead Paragraphs | Inter | `1.125rem` (`text-lg`) | 400 (Regular) | `0` | `1.6` |
| **Body** | Default Content | Inter | `1rem` (`text-base`) | 400 (Regular) | `0` | `1.65` |
| **Small** | Captions, Metadata, Badges | Inter | `0.875rem` (`text-sm`) | 500 (Medium) | `0.01em` | `1.5` |
| **Micro** | Tags, Timestamps, Legal | Inter | `0.75rem` (`text-xs`) | 500 (Medium) | `0.02em` | `1.4` |
| **Code** | Inline Code, Pre Blocks | JetBrains Mono | `0.875rem` (`text-sm`) | 400 (Regular) | `0` | `1.5` |

---

## 3. 📐 Spacing & Layout System

All padding, margins, and gaps adhere to a structured spacing scale:

```css
--spacing-xs:  0.25rem;  /* 4px  - micro gaps, badge padding */
--spacing-sm:  0.5rem;   /* 8px  - icon gaps, button padding-y */
--spacing-md:  1rem;     /* 16px - container padding, card gaps */
--spacing-lg:  1.5rem;   /* 24px - card internal padding */
--spacing-xl:  2rem;     /* 32px - section element spacing */
--spacing-2xl: 3rem;     /* 48px - subsection margins */
--spacing-3xl: 4rem;     /* 64px - page padding */
--spacing-4xl: 6rem;     /* 96px - standard major section spacing (py-24) */
```

### Layout Rules
- **Major Section Gap:** Standardized `py-24` (96px) across all pages for consistent breathing room.
- **Max Content Widths:**
  - Standard container: `max-w-7xl` (1280px)
  - Focused / Form layout: `max-w-5xl` or `max-w-6xl`
  - Reading / Legal copy: `max-w-3xl` or `max-w-4xl`
- **Border Radii:**
  - Buttons / Badges: `rounded-xl` (12px)
  - Cards / Modals: `rounded-2xl` (16px)
  - Pills: `rounded-full` (9999px)

---

## 4. 🧩 Component Specifications

### 4.1 Button (`components/ui/button.tsx`)
Polymorphic Radix Slot button with CVA variants and micro-interactions:
- **`default` (Primary):** `gradient-primary text-white shadow-lg shadow-accent-primary/20 hover:scale-[1.02] active:scale-[0.98]`
- **`secondary`:** `bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary/10 hover:scale-[1.02]`
- **`ghost`:** `bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary`
- **`outline`:** `border border-border-subtle bg-transparent text-text-primary hover:bg-bg-tertiary hover:border-border-strong`
- **`destructive`:** `bg-error text-white hover:bg-error/90 hover:scale-[1.02]`
- **`link`:** `text-accent-primary underline-offset-4 hover:underline`
- **Sizes:** `sm` (px-3 py-1.5), `default` (px-5 py-2.5), `lg` (px-7 py-3.5), `icon` (h-10 w-10)
- **Built-in `isLoading` state:** Shows spinning `<Loader2 />` and disables button.

### 4.2 Card (`components/ui/card.tsx`)
Composable container primitives:
- Base style: `bg-bg-secondary border border-border-subtle rounded-2xl p-6 shadow-lg shadow-black/10`
- Hover state: `hover:-translate-y-0.5 hover:border-border-strong hover:shadow-xl hover:shadow-accent-primary/5`
- Sub-components: `CardHeader`, `CardTitle` (`font-display`), `CardDescription`, `CardContent`, `CardFooter`.

### 4.3 Service Card (`components/service-card.tsx`)
- Featured service card with dynamic Lucide icon or WebP image.
- Image zoom on hover (`group-hover:scale-105`) with gradient overlay.
- Categorized OKLCH tag badges.
- Animated "Learn more →" link with arrow offset on hover.
- Viewport entrance via Motion `whileInView`.

### 4.4 Blog Card (`components/blog-card.tsx`)
- Technical article preview card.
- Space Grotesk title with accent color transition on hover.
- Category tag chips, published date with `<Calendar />` icon, and reading time with `<Clock />` icon.
- Line-clamped excerpt for clean visual rhythm.

### 4.5 Navbar (`components/navbar.tsx`)
- Glassmorphic navigation header with dynamic scroll shrink.
- Background: `bg-bg-primary/80 backdrop-blur-md` → `glass py-2 shadow-lg` on scroll (>50px).
- Bottom accent border: subtle indigo gradient rule.
- Animated link underline: expands from center (`scale-x-0` → `scale-x-100`).
- Mobile menu: Full-screen `backdrop-blur-xl` overlay with staggered motion entrance.

### 4.6 Footer (`components/footer.tsx`)
- 4-column responsive grid: Company Brand + Newsletter preview, Quick Links, Services, Legal & Social.
- Gradient top border divider.
- Branded hover states on social icons (LinkedIn blue, Instagram pink, GitHub white, X white).

---

## 5. ⚡ Utility CSS Classes (`app/globals.css`)

| Class | Purpose | CSS Definition |
|---|---|---|
| `.glass` | Glassmorphism surface | `background: oklch(0.13 0.01 275 / 70%); backdrop-filter: blur(20px); border: 1px solid oklch(0.22 0.01 270 / 50%);` |
| `.glow` | Accent lighting box shadow | `box-shadow: 0 0 20px oklch(0.68 0.19 275 / 20%);` |
| `.text-gradient` | Dual-tone text fill | `background: linear-gradient(135deg, oklch(0.60 0.22 275), oklch(0.72 0.16 330)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;` |
| `.gradient-primary` | Indigo-rose gradient fill | `background: linear-gradient(135deg, oklch(0.60 0.22 275), oklch(0.72 0.16 330));` |
| `.gradient-subtle` | Deep navy dark gradient | `background: linear-gradient(135deg, oklch(0.13 0.01 275), oklch(0.09 0.005 280));` |
| `.gradient-glow` | Radial backdrop lighting | `background: radial-gradient(circle at 50% 50%, oklch(0.68 0.19 275 / 15%), transparent 70%);` |
| `.animate-scroll` | Infinite marquee scroll | Hardware-accelerated 25s linear infinite transform |
| `.animate-in` | Fade-in-up entrance | `animation: fadeInUp 0.6s ease-out forwards;` |

---

## 6. ♿ Accessibility & Motion Compliance

1. **Contrast:** All text colors exceed WCAG 2.1 AA (4.5:1) standards against their respective background surfaces.
2. **Reduced Motion:** Handled via `@media (prefers-reduced-motion: reduce)` in CSS and Motion's `useReducedMotion()` hook across all client-animated components.
3. **Keyboard Focus:** Visible 2px focus ring (`focus-visible:ring-accent-primary/50`) with proper offset on all interactive primitives.
4. **Landmark Roles & Headings:** Every page maintains semantic landmarks (`role="banner"`, `role="main"`, `role="contentinfo"`), strict single `<h1>` hierarchy, and accessible ARIA attributes.
