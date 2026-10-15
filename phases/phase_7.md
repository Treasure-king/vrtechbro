# Phase 7: 📄 Page Redesign & UX Storytelling

> **Goal:** Rebuild every page from scratch using the new design system, with a focus on narrative flow, emotional impact, and conversion. Each page should tell a story.
>
> **Estimated Tasks:** 11 (7.0 – 7.10)
> **Depends On:** Phase 6 (Design System)
> **Recommended order:** 7.0 → 7.1 (Home) → 7.3/7.4 (Services) → 7.7 (Contact) → 7.2 (About) → remaining pages

---

## Task 7.0 — Motion & Asset Foundation (do this first)

Every redesigned page reuses these, so build them once before touching any page.

### Motion system
- **Install:** `npm install lenis` (smooth scroll). Keep **Motion** (`motion/react`) as the only animation library — do **not** add GSAP.
- **`components/motion/`** — small reusable primitives:
  - `reveal.tsx` — fade/slide-in on `whileInView` (`once: true`), with optional stagger for children
  - `split-text.tsx` — word-by-word headline reveal
  - `counter.tsx` — animated number for stats (`useInView` + `animate`)
  - `marquee.tsx` — infinite logo/tech strip (CSS transform, pauses on hover)
  - `magnetic.tsx` — subtle magnetic pull for primary CTAs (pointer devices only)
  - `smooth-scroll.tsx` — Lenis provider mounted once in `app/layout.tsx`
- **Rules:**
  - Every primitive respects `prefers-reduced-motion` (`useReducedMotion()`); Lenis is disabled when reduced motion is on
  - Animate only `transform` and `opacity` (no layout-thrashing properties)
  - Primitives are client components; pages stay Server Components and wrap sections
- **shadcn additions:** `npx shadcn@latest add accordion tabs sheet tooltip badge`
- Copy-paste components from Magic UI / Aceternity UI are allowed, but must be restyled to the Phase 6 tokens (no hard-coded colors).

### Visual assets (generated with Gemini)
Use one shared style prefix so every image looks like one set:
> *"Dark premium tech aesthetic, near-black background (#0d0d14), glowing indigo (#7b6cf6) and magenta (#d97bd0) accent lighting, soft volumetric glow, clean minimal composition, no text, no logos, high detail."*

| File (in `public/images/`) | Size | Used in |
|---|---|---|
| `hero-bg.webp` | 2560×1440 | Home hero background (empty center for text) |
| `about-studio.webp` | 1600×1200 | Home about teaser + About page |
| `services/<slug>.webp` (one per service) | 1200×900 | Service cards + detail hero (same camera angle & lighting for all) |
| `process-1..4.webp` | 800×800 | Process section (Discover / Design / Build / Launch) |
| `cta-bg.webp` | 2400×800 | Final CTA band |
| `blog-fallback.webp` | 1200×630 | Blog posts without a cover |
| `not-found.webp` | 1200×900 | 404 page |

- Convert everything to `.webp` (quality ~80) before committing; delete the legacy `.png` duplicates once nothing imports them.
- **Never** use AI images for portfolio work — real screenshots only (see Phase 9).

### Verification
- [ ] All primitives render with reduced motion on/off
- [ ] No horizontal scroll introduced by marquee/reveal at 360px width
- [ ] Lenis does not break anchor links or the navbar mobile menu

---

## Design Philosophy for This Phase

Every page follows the **"Hook → Prove → Convert"** pattern:
1. **Hook:** Immediately capture attention (bold headline, striking visual, 3D element)
2. **Prove:** Demonstrate capability with evidence (portfolio, metrics, testimonials)
3. **Convert:** Make it effortless to take the next step (clear CTAs, low-friction forms)

---

## Task 7.1 — Redesign Home Page (The Story)

### Layout Structure (Scroll Journey)
1. **Hero Section** — 3D scene + headline + CTA (placeholder for Phase 8's 3D integration)
   - Full viewport height
   - Bold display typography with text gradient
   - Subtitle with typed/animated text effect
   - Two CTAs: "See Our Work" (primary) + "Get in Touch" (secondary)
   - Scroll indicator at bottom

2. **Social Proof Bar** — Logos of tools/tech used (refined TechTags)
   - Subtle, elegant marquee
   - Grayscale logos that colorize on hover

3. **About Teaser** — Brief identity statement
   - Split layout: compelling copy on left, visual element on right
   - "We build things that work and look incredible doing it"
   - Link to full about page

4. **Proof Strip** — 3–4 animated counters (projects shipped, years building, technologies, extensions/packages published)
   - Numbers must be **real**; leave a stat out rather than inflate it

5. **Featured Work** — 2–3 showcase projects (links to Phase 9's portfolio)
   - Large image cards with overlay text
   - Hover: reveal tech stack + link
   - "View All Projects →"
   - Until Phase 9 data exists, hide this section rather than show placeholders

6. **Services Overview** — Featured services from Supabase
   - New service card design from Phase 6
   - 3 or 6 cards in a grid
   - "Explore All Services →"

7. **Process** — How we work in 4 steps (Discover → Design → Build → Launch) with `process-*.webp` visuals

8. **Testimonials** — Only real client quotes (name + role + company). Skip the section if there are none yet.

9. **Blog Highlights** — Latest 3 posts
   - New blog card design
   - "Read More →"

10. **Contact CTA** — Final conversion section
    - Bold headline: "Let's Build Something Together"
    - Inline contact form OR prominent CTA button
    - Company info sidebar

### Verification
- [ ] Page tells a coherent story from top to bottom
- [ ] Each section has a clear purpose
- [ ] CTAs are prominent and clear
- [ ] Screenshots checked with Playwright at 375px, 768px and 1440px
- [ ] Lighthouse mobile performance ≥ 90 (LCP image uses `priority`, no layout shift from animations)

---

## Task 7.2 — Redesign About Page

### Layout
1. **Hero:** Full-width headline with subtitle
2. **Story Section:** The founder's story — why VRTechBro exists, what drives it
3. **Mission & Vision:** Side-by-side cards with icons (not emoji)
4. **Skills/Tech:** Visual skill grid or radar chart
5. **Timeline:** Company milestones (even if just a few)
6. **CTA:** "Want to work with us? →"

### Key Differences from Current
- Personal tone — this is a founder-led studio, not a corporation
- Visual storytelling with images or illustrations
- Tech stack shown as an interactive grid, not just text pills

---

## Task 7.3 — Redesign Services Page

### Layout
1. **Hero:** "What We Build" with subtitle
2. **Service Grid:** All services from Supabase with new card design
3. **Process Section:** How we work (Discovery → Design → Develop → Deploy → Support)
4. **CTA:** "Not sure what you need? Let's talk →"

### Key Differences
- Services now have rich images/icons
- Grid has subtle entrance animations
- Process section adds credibility

---

## Task 7.4 — Redesign Service Detail Page (`/services/[slug]`)

### Layout
1. **Hero:** Service title + short description + CTA
2. **Overview:** Long description with visual elements
3. **What's Included:** Bulleted feature list with icons
4. **Use Cases:** Who this service is for
5. **Tech Stack:** Technologies used for this service
6. **Related Services:** Cross-sell other services
7. **Enquiry Form:** Rebuilt form (not the current basic modal)

### Key Differences
- Much richer content layout
- Related services for internal linking (SEO boost)
- Enquiry form is inline, not a modal (or a well-designed slide-out)

---

## Task 7.5 — Redesign Blog List Page

### Layout
1. **Hero:** "Insights & Articles" with subtitle
2. **Featured Post:** Large card for latest/pinned post
3. **Blog Grid:** All posts with new card design
4. **Category Filter:** Filter by tag (optional — progressive enhancement)
5. **Newsletter CTA:** "Get new posts in your inbox" (placeholder)

---

## Task 7.6 — Redesign Blog Detail Page (`/blog/[slug]`)

### Layout
1. **Header:** Title, author, date, reading time, tags
2. **Featured Image:** Full-width blog image (if available)
3. **Content:** Proper Markdown rendering (from Phase 4)
4. **Author Card:** Brief author bio at the bottom
5. **Share Buttons:** Twitter, LinkedIn, copy link
6. **Related Posts:** 2–3 suggested posts

### Key Differences
- Professional article layout (like Medium or dev.to)
- Table of contents for long posts (auto-generated from headings)
- Share functionality

---

## Task 7.7 — Redesign Contact Page

### Layout
1. **Hero:** "Let's Talk" with warm, inviting copy
2. **Contact Form:** Redesigned with new input styles
3. **Contact Info:** Email, working hours, timezone
4. **Map or Location:** Simple text-based location info
5. **FAQ Teaser:** "Check our FAQ for quick answers →"

### Key Differences
- Feels welcoming, not transactional
- Form uses the design system's input components
- Clear what happens after submitting

---

## Task 7.8 — Redesign FAQ Page

### Layout
1. **Hero:** "Frequently Asked Questions"
2. **FAQ Accordion:** Properly animated expand/collapse
3. **Category Groups:** Group FAQs by topic if there are enough
4. **Contact CTA:** "Didn't find your answer? →"

### Key Differences
- Smooth accordion animations (not the native `<details>` jump)
- Better visual hierarchy
- Grouped by category

---

## Task 7.9 — Redesign Careers Page

### Layout
1. **Hero:** "Join Our Team" with culture statement
2. **Why VRTechBro:** Benefits, culture, growth opportunities
3. **Open Positions:** Cards from Supabase (migrated from hardcoded)
4. **Application Form:** Redesigned modal or inline form

### Key Differences
- Pulls jobs from Supabase (not hardcoded)
- Has a "Why work here" section to attract talent
- Application form is polished

---

## Task 7.10 — Redesign Legal Pages (Privacy, Terms)

### Layout
- Clean, readable typography
- Proper section numbering
- Sticky table of contents sidebar (desktop)
- Last updated date
- Back to top button

### Key Differences
- Actually readable and well-structured
- Professional appearance

---

## Phase 7 — Final Verification Checklist

- [ ] Every page redesigned with new design system
- [ ] Consistent visual language across all pages
- [ ] Every page follows Hook → Prove → Convert pattern
- [ ] Responsive on mobile, tablet, desktop
- [ ] All animations smooth and purposeful
- [ ] Internal linking between pages (SEO)
- [ ] CTAs are clear and prominent on every page
- [ ] Page transitions feel smooth
- [ ] Accessibility audit passes (`design:accessibility-review` skill + axe)
- [ ] Design critique run on Home, Services and Contact (`design:design-critique` skill)
- [ ] All animations respect `prefers-reduced-motion`
- [ ] `npx tsc --noEmit`, `npm run lint` and `npm run build` succeed
