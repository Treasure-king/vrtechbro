# The VRTechBro Learning Guide

How this website was built, and why each decision was made, so you can build the next one yourself.

Every section explains the idea first, then shows where it lives in this codebase, then gives you a small exercise. The snippets are copied from the real files, so you can open them and read the full context.

## Contents

1. [How to work like this](#1-how-to-work-like-this)
2. [Next.js App Router fundamentals](#2-nextjs-app-router-fundamentals)
3. [Styling and design systems](#3-styling-and-design-systems)
4. [Animation done right](#4-animation-done-right)
5. [Performance and Lighthouse](#5-performance-and-lighthouse)
6. [Accessibility](#6-accessibility)
7. [Security](#7-security)
8. [Supabase, auth and the admin panel](#8-supabase-auth-and-the-admin-panel)
9. [Testing](#9-testing)
10. [Git, GitHub and CI](#10-git-github-and-ci)
11. [Upgrading dependencies safely](#11-upgrading-dependencies-safely)
12. [Deploying on Vercel and environment variables](#12-deploying-on-vercel-and-environment-variables)
13. [Debugging: two real bugs, step by step](#13-debugging-two-real-bugs-step-by-step)
14. [A checklist for any new website](#14-a-checklist-for-any-new-website)

---

## 1. How to work like this

The single most useful habit is not a tool. It is a loop:

**Audit → plan → small step → verify → commit safely → repeat.**

| Step | What it means here |
| --- | --- |
| Audit | Read the codebase before changing it. List what's broken, risky or slow. |
| Plan | Break the work into phases with a clear goal each (`docs/phases/`). |
| Small step | Change one thing at a time: one page, one component, one fix. |
| Verify | Type-check, lint, look at it in the browser, run the tests. |
| Commit safely | Check what you're committing (no secrets), write a clear message. |
| Push | Only after the checks pass. |

Big changes made all at once are hard to debug: when something breaks, you don't know which part broke it. Small verified steps mean that when something breaks, it's almost always the last thing you touched.

### Reading an unfamiliar codebase

When you open a project you didn't write (or wrote a year ago), go in this order:

1. **`package.json`**: what framework, what libraries, what scripts (`dev`, `build`, `lint`).
2. **Config files**: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`. They tell you the rules.
3. **The entry point**: `app/layout.tsx` (wraps every page), then `app/(site)/page.tsx` (the home page).
4. **Follow one feature end to end**: for example, the contact form, from `components/contact/contact-form.tsx` to `app/api/send-email/route.ts`.
5. **Search, don't scroll**: search for a word you can see on the page to find the file that renders it.

### Planning with phases

`docs/phases/` holds one file per phase, each with a goal, tasks and a verification checklist. The README in that folder is the index and records the status of each phase. Writing the plan down first does two things: it forces you to think through the order (you can't redesign pages before the design system exists), and it gives you a definition of "done" for each step.

`docs/memory.md` is the project's knowledge base: decisions, gotchas and where things live. Update it whenever you learn something you'd otherwise have to rediscover.

**Try it yourself:** Pick a feature you haven't looked at (the careers application form is a good one). Trace it from the button the visitor clicks to the email that gets sent, and write down every file it passes through.

**Learn more:** [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)

---

## 2. Next.js App Router fundamentals

### Server Components and Client Components

In the App Router, every component is a **Server Component** unless you say otherwise. Server Components run on the server (or at build time), send plain HTML to the browser, and add **no JavaScript** to the page.

A **Client Component** starts with `'use client'` at the top of the file. It runs in the browser too, so it can use state (`useState`), effects (`useEffect`), event handlers (`onClick`) and browser APIs (`window`). The cost: its code is downloaded and executed by every visitor.

**The rule we followed:** keep pages as Server Components, and push `'use client'` down to the smallest interactive piece. For example, `components/home/hero.tsx` is a Server Component (just text, images and links), while `components/home/workbench.tsx`, which types out code and switches tabs, is a Client Component.

```tsx
// components/motion/heading-reveal.tsx
"use client";

import { useInViewOnce } from "@/components/motion/use-in-view-once";
```

A Server Component can render a Client Component, and pass it props, but not the other way round for server-only code.

### Layouts and route groups

A `layout.tsx` wraps every page in its folder and all folders below it. Folders in brackets, like `(site)`, are **route groups**: they organise files without adding to the URL.

| Folder | URL | Layout |
| --- | --- | --- |
| `app/layout.tsx` | everything | Fonts, brand colours, the toaster |
| `app/(site)/layout.tsx` | `/`, `/about`, `/blog`… | Navbar, footer (`SiteChrome`) |
| `app/admin/layout.tsx` | `/admin/…` | The admin's own sidebar layout |

That's why the admin panel doesn't show the public navbar: it lives outside `(site)`.

```tsx
// app/(site)/layout.tsx
import { SiteChrome } from "@/components/layout/site-chrome";

/** Layout for every public page. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
```

### Static rendering and `revalidate`

Most pages are built once and served as static HTML, which is the fastest thing a server can do. But the content lives in Supabase and can change. The fix is **Incremental Static Regeneration (ISR)**: the page is static, but Next rebuilds it in the background at most once per interval.

```tsx
export const revalidate = 3600; // rebuild this page at most once an hour
```

When you edit content in the admin panel, we don't wait for the hour: `revalidatePath` (section 8) tells Next to rebuild those pages immediately.

### `generateStaticParams`

Dynamic routes like `/blog/[slug]` need to know which slugs exist at build time to pre-render them:

```tsx
// app/(site)/blog/[slug]/page.tsx
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase.from("blogs").select("slug");

  if (error || !data) return [];

  return data.map((blog: { slug: string }) => ({
    slug: blog.slug,
  }));
}
```

### Metadata and SEO

Search engines and social networks read a page's `<title>`, description and Open Graph tags. In the App Router you export a `metadata` object (or a `generateMetadata` function for dynamic pages), and Next writes the tags for you.

| Piece | Where | Purpose |
| --- | --- | --- |
| `title`, `description` | each `page.tsx` | Search result text |
| `openGraph.images` | each `page.tsx` | The preview card on WhatsApp, LinkedIn, X |
| JSON-LD `<script>` | pages like blog posts | Structured data Google uses for rich results |
| `app/sitemap.ts` | generated `/sitemap.xml` | Tells search engines every URL, including blog posts from the database |
| `app/robots.ts` | generated `/robots.txt` | Tells crawlers what not to index |

```ts
// app/robots.ts
rules: [
  {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/", "/admin"],
  },
],
```

### `proxy.ts` (formerly middleware)

`proxy.ts` runs **before** a request reaches a page. We use it to refresh the admin's login session and keep signed-out visitors away from `/admin`.

```ts
// proxy.ts
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only the admin area runs the proxy, so public pages stay static and fast.
export const config = {
  matcher: ["/admin/:path*"],
};
```

The `matcher` matters for performance. Code that runs on every request stops pages from being purely static, so we limit it to the admin area.

**Try it yourself:** Add a new static page at `app/(site)/test/page.tsx` that exports a `metadata` object with a title. Visit `/test` and check the browser tab title. Then delete it.

**Learn more:** [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) · [Layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) · [Metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) · [ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration)

---

## 3. Styling and design systems

### Tokens, not values

A **design token** is a named value: `text-text-primary` instead of `#EEEEF3`. Components use the names; the values live in one place. When the brand changes, you change one file and everything follows.

This project's chain looks like this:

```
lib/brand.ts  →  <BrandStyle /> injects CSS variables  →  app/globals.css maps them to Tailwind  →  components use classes
   (hex values)         (--brand-primary: #7B6CF6)           (--color-accent-primary)            (bg-accent-primary)
```

The single source of truth:

```ts
// lib/brand.ts
colors: {
  /* Surfaces, darkest to lightest */
  canvas: "#07070B", // page background
  surface: "#0E0E15", // cards, panels
  ...
  /* Primary accent: buttons, links, focus rings */
  primary: "#7B6CF6",
```

And the mapping in Tailwind v4's CSS-first config:

```css
/* app/globals.css */
@theme inline {
  --color-bg-primary: var(--brand-canvas);
  --color-text-primary: var(--brand-text);
  --color-accent-primary: var(--brand-primary);
  --color-signal: var(--brand-signal);
}
```

`@theme inline` creates Tailwind utilities (`bg-bg-primary`, `text-signal`…) whose values point at the CSS variables. **Rule: never hard-code a colour in a component.** If you need a new colour, add it to `lib/brand.ts` and map it in `globals.css`.

### Type scale utilities

Headline sizes are defined once as custom utilities, so every page title looks the same:

```css
@utility type-heading {
  font-family: var(--font-display);
  font-weight: 650;
  font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.375rem);
  line-height: 1.12;
}
```

`clamp(min, preferred, max)` makes the size fluid: it grows with the screen width but never below the minimum or above the maximum.

### The `type-*` naming gotcha

These utilities were first called `text-display` and `text-heading`. That broke headlines silently. The `cn()` helper uses **tailwind-merge**, which removes conflicting classes, and it assumed `text-display` and `text-text-primary` were both text *colours*, so it dropped one. Renaming them to `type-*` fixed it.

**Lesson:** when a class "does nothing", inspect the element in the browser's DevTools and check whether the class is actually there.

### Responsive design

Tailwind is mobile-first: unprefixed classes apply to every screen, and `md:` or `lg:` apply from that width up.

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12">  {/* one column on phones, 12 on desktop */}
```

Test at three widths: phone (390px), tablet (768px) and desktop (1440px). Chrome DevTools has a device toolbar (Ctrl+Shift+M) for this, and the Playwright suite (section 9) does it automatically. A common bug we hit: a wide child (the code workbench) forced a grid column wider than the phone screen. The fix was `min-w-0` on the column.

**Try it yourself:** Change `primary` in `lib/brand.ts` to another colour, run `npm run dev`, and watch every button and link change. Then change it back.

**Learn more:** [Tailwind v4 theme variables](https://tailwindcss.com/docs/theme) · [Responsive design](https://tailwindcss.com/docs/responsive-design) · [CSS clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)

---

## 4. Animation done right

### CSS animation vs JavaScript animation

| | CSS (`@keyframes`, `transition`) | JavaScript (Motion library) |
| --- | --- | --- |
| Starts | As soon as the HTML paints | Only after the JS downloads and runs |
| Cost | Almost free | Library code on every page that uses it |
| Good for | Fades, slides, hovers, entrances | Interaction-driven effects, scroll-linked values |

The hero's entrance is pure CSS for that reason:

```css
@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
}
.rise {
  animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--rise-delay, 0s);
}
```

### Scroll reveals with IntersectionObserver

To fade something in when it scrolls into view, you don't need a library. The browser's **IntersectionObserver** tells you when an element becomes visible:

```ts
// components/motion/use-in-view-once.ts
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setInView(true);
      observer.disconnect();
    }
  },
  { rootMargin },
);
observer.observe(node);
```

The component sets `data-shown` once it's visible, and CSS does the actual animation. The hidden state only applies when the `<html>` element has a `js` class (added by a one-line script in `app/layout.tsx`), so if JavaScript fails, content is never stuck invisible.

### Respect `prefers-reduced-motion`

Some people get dizzy or nauseous from motion and turn it off in their operating system. `globals.css` respects that setting by collapsing all animations:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### What we removed, and why

At one point the home page had parallax layers, a pinned horizontal-scroll section and a giant scroll-lit manifesto. You asked to remove them, and that was the right call:

- **Scroll-jacking** (taking over the scroll to move things sideways) fights the visitor's own hand.
- Lots of simultaneous motion competes for attention, so nothing stands out.
- Each effect added JavaScript and slowed the page.

**Rule of thumb:** motion should either answer something the visitor did (a click, a hover) or follow the reading flow (a section appearing as you reach it). One memorable moment per page is enough.

### The LCP lesson

The page-to-page fade once started every page at `opacity: 0` until JavaScript loaded. Lighthouse showed the main content appearing about 3.6 seconds late. The fix: never fade the **first** page load, only later navigations (`app/(site)/template.tsx`). The first paint must never wait for JavaScript.

**Try it yourself:** Turn on "Reduce motion" in Windows (Settings → Accessibility → Visual effects → Animation effects off). Reload the site and confirm everything still appears, just without movement.

**Learn more:** [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) · [Animations guide](https://web.dev/articles/animations-guide)

---

## 5. Performance and Lighthouse

### Core Web Vitals in plain terms

| Metric | Question it answers | Good |
| --- | --- | --- |
| **LCP** (Largest Contentful Paint) | When does the main content appear? | Under 2.5 s |
| **CLS** (Cumulative Layout Shift) | Does the page jump around while loading? | Under 0.1 |
| **INP** (Interaction to Next Paint) | When I tap something, how fast does it respond? | Under 200 ms |
| **TBT** (Total Blocking Time) | Lighthouse's lab stand-in for INP: how long was the main thread busy? | Under 200 ms |

### What hurt us, and the fixes

| Problem | Why it hurt | Fix |
| --- | --- | --- |
| Content hidden until JavaScript loaded | LCP waited for JS | First page load never faded; reveals only hide content when JS is running |
| Animation library in the navbar | The navbar is on every page, so every page loaded the library | Rebuilt the menu with CSS transitions |
| Theme and tooltip providers nobody needed | Extra JS on every page | Removed `next-themes` and the unused tooltip provider |
| Toast notifications in the first load | Only needed after a form submit | Lazy-loaded (`components/ui/toaster-lazy.tsx`) |

The lesson: **code in shared components (layout, navbar, footer) costs every page.** Be strictest there.

### Images

- **Format:** WebP or AVIF are much smaller than PNG or JPEG for the same quality. The original 37 MB of images became about 440 KB.
- **`next/image`**: resizes and converts images automatically and serves the right size for each screen. Always give it `sizes` so the browser knows which size to download:

```tsx
<Image src={aboutStudio} alt="…" sizes="(max-width: 1024px) 100vw, 50vw" />
```

- **`priority`**: add it to the one big image at the top of a page (the LCP image), so it loads first.
- **`minimumCacheTTL`** in `next.config.ts`: how long optimised copies are cached. We set 31 days because the source images rarely change.

### Running Lighthouse

1. Open the **live** site (or a production build; dev servers are always slow) in Chrome.
2. DevTools (F12) → **Lighthouse** tab → select **Mobile** → **Analyze page load**.
3. Read the score, then scroll to **Diagnostics**. The "Largest Contentful Paint element" item tells you exactly which element was slow and why.

Mobile scores are always lower than desktop because Lighthouse simulates a slow phone on a slow network. That's deliberate: it's what many real visitors have.

**Try it yourself:** Run Lighthouse on https://www.vrtechbro.com in mobile mode. Find the LCP element in the report and write down which phase (load delay, load time or render delay) took the longest.

**Learn more:** [Web Vitals](https://web.dev/articles/vitals) · [Optimise LCP](https://web.dev/articles/optimize-lcp) · [Image component](https://nextjs.org/docs/app/api-reference/components/image) · [Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview)

---

## 6. Accessibility

Accessibility means people using keyboards, screen readers, zoom or high contrast can use the site. It's also good for SEO, because search engines read the same structure screen readers do.

### Semantic HTML first

Use the element that matches the meaning: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<header>`, `<footer>` for page regions. A `<div onClick>` looks like a button but a keyboard can't reach it and a screen reader doesn't announce it.

One bug we fixed: "Start a project" was a `<button>` inside an `<a>`. That's invalid HTML and confusing for screen readers. With shadcn's `Button asChild`, the link itself gets the button styling:

```tsx
<Button asChild size="sm">
  <Link href="/contact">Start a project</Link>
</Button>
```

### Headings in order

Each page has exactly one `<h1>`, then `<h2>` for sections, `<h3>` inside those. Screen-reader users jump between headings to navigate, so skipping from `<h1>` to `<h3>` (a bug we fixed on the contact page) breaks their map of the page.

### Labels

Every form field needs a visible `<label>` linked to it (`htmlFor` matches the input's `id`). Placeholder text is not a label: it disappears as soon as you type.

### Focus management

- **Skip link:** the first thing a keyboard user reaches is "Skip to content", so they don't tab through the whole navbar on every page.
- **Mobile menu focus trap:** when the full-screen menu is open, Tab cycles inside it, and Escape closes it and returns focus to the menu button. Without this, keyboard focus escaped into the page hidden behind the overlay.
- **Visible focus rings:** never remove `outline` without replacing it with something just as visible.

### Contrast

Text needs a contrast ratio of at least 4.5:1 against its background (3:1 for large text). The only failure we had was the faint decorative footer wordmark. It's intentionally faint and carries no information, so it became an SVG graphic marked `aria-hidden`.

### How the automated check works

`tests/e2e/a11y.spec.ts` uses **axe**, the same engine as many browser accessibility extensions:

```ts
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
  .exclude('[aria-hidden="true"]')
  .analyze();
```

It fails the test on serious or critical problems. Automated tools catch roughly a third of real issues, so also try the site with only a keyboard.

**Try it yourself:** Unplug your mouse (or don't touch it) and use the site with Tab, Shift+Tab, Enter and Escape. Open the mobile menu at a narrow width and check you can reach and close everything.

**Learn more:** [MDN accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility) · [WCAG quick reference](https://www.w3.org/WAI/WCAG21/quickref/) · [web.dev accessibility](https://web.dev/learn/accessibility)

---

## 7. Security

Security is a way of thinking: **assume every input is hostile, and every layer might fail.** The industry reference is the OWASP Top 10. Here's how each idea shows up in this project.

### Security headers and CSP

HTTP headers tell the browser how to protect the page. They're defined in `lib/security-headers.ts` and attached to every response by `next.config.ts`.

```ts
export const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
  connect-src 'self' https://*.supabase.co;
  object-src 'none';
  frame-ancestors 'none';
`
```

| Header | Protects against |
| --- | --- |
| Content-Security-Policy | Injected scripts loading from other sites (XSS) |
| Strict-Transport-Security | Downgrade to unencrypted HTTP |
| X-Frame-Options / `frame-ancestors` | Your site being embedded in a frame to trick clicks (clickjacking) |
| X-Content-Type-Options | Browsers guessing file types |
| Referrer-Policy | Leaking full URLs to other sites |

**CSP's catch:** when you add a third-party service the browser talks to directly (analytics, error tracking, a chat widget), you must add its domain to the CSP, or the browser blocks it. That's a feature, not a bug.

### Validate everything on the server

The browser form validation is for convenience; anyone can bypass it by sending a request directly. Every API route validates its input with **zod**:

```ts
// app/api/send-email/route.ts
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(254, 'Email is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
})
```

Note the `max` lengths: without them, someone could send a 50 MB "name".

### Escape output

Visitor text goes into an HTML email. If someone typed `<script>…</script>` as their name, it would become real HTML. `escapeHtml()` in `lib/sanitize.ts` turns `<` into `&lt;` and so on. The general rule is to **escape at the point of output**, for the format you're outputting into.

### Rate limiting and its limits

`lib/rate-limit.ts` allows a few submissions per minute per IP address. It's **in-memory**, which has a real limitation on Vercel: each serverless instance has its own memory, so the limit is per instance, not global. A shared store (such as Upstash Redis) fixes that. Know the limits of your own protections.

### Honeypot spam traps

Each public form has a hidden "website" field that people never see. Bots fill in every field, so if it arrives filled, the API returns a fake "success" and sends nothing. The bot gets no signal that it was caught.

```ts
// lib/honeypot.ts
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
```

### File uploads: check the bytes, not the label

The browser tells you a file's type, but an attacker can lie. The career form checks the file's first bytes ("magic bytes"), which reveal what the file really is:

```ts
// app/api/career-apply/route.ts
// Magic bytes: PDF (%PDF), legacy DOC (OLE2 container), DOCX (ZIP container)
const FILE_SIGNATURES = [
  [0x25, 0x50, 0x44, 0x46],
  [0xd0, 0xcf, 0x11, 0xe0],
  [0x50, 0x4b, 0x03, 0x04],
]
```

### Secrets hygiene

- Secrets live in `.env.local` locally and in Vercel's settings online. **Never in Git.** `.gitignore` excludes `.env*`.
- **`NEXT_PUBLIC_` means public.** Any variable with that prefix is bundled into browser JavaScript, where anyone can read it. The Supabase URL and anon key are public by design; the Resend API key must never be.
- Before every push, scan what you're about to publish (section 10).

### Supabase: the anon key and RLS

The anon key is in every visitor's browser. Without protection, anyone could use it to read or change your tables through Supabase's Data API. **Row Level Security (RLS)** is the protection: every query is checked against policies, and anything not explicitly allowed is denied.

```sql
-- supabase/migrations/2026-10-18_lock_down_rls.sql
alter table public.services enable row level security;

create policy "Public can read services"
  on public.services for select to anon, authenticated using (true);

create policy "Public can read open jobs"
  on public.jobs for select to anon, authenticated using (is_open = true);
```

Read these as sentences: "anyone may **select** from services", "anyone may select **open** jobs". Writes are allowed only by policies that require `is_admin()`. The `contacts` table, which holds personal data, has no public policy at all, so the public can't read it.

### `security definer` and `search_path`

```sql
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
```

- `security definer` runs the function with its owner's rights, so it can read the `admins` table even though normal users can't.
- That makes it powerful, so `set search_path = ''` stops attackers from tricking it into using a lookalike table, and `revoke execute … from anon` stops signed-out visitors from calling it at all.

### Defence in depth

The admin area checks permissions in **three** places: `proxy.ts` (signed in?), `requireAdmin()` on every page and action (is this user an admin?), and RLS in the database (is this write allowed?). If any one layer has a bug, the others still hold. Never rely on a single check, and never trust the browser to enforce anything.

**Try it yourself:** In the Supabase SQL Editor, run `select tablename, rowsecurity from pg_tables where schemaname = 'public';` and confirm every table shows `true`. Then read each policy in the migration file aloud as a sentence.

**Learn more:** [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) · [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) · [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables)

---

## 8. Supabase, auth and the admin panel

### Two Supabase clients

| Client | File | Used by | Runs as |
| --- | --- | --- | --- |
| Anon client | `lib/supabase.ts` | Public pages | An anonymous visitor (read-only by RLS) |
| Server client | `lib/supabase/server.ts` | Admin pages and actions | The signed-in user, from their cookies |

The server client reads the login session from cookies using `@supabase/ssr`:

```ts
// lib/supabase/server.ts
return createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
```

Because queries run *as the user*, RLS knows who's asking, and the database can enforce "only admins can write".

### `requireAdmin()`

Every admin page and server action starts with this:

```ts
// lib/admin/auth.ts
export async function getAdmin(): Promise<AdminContext | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
```

Two details matter. `getUser()` asks Supabase to verify the token, whereas the cheaper `getSession()` only reads the cookie, which could be forged. And it's called on **every** page, not just the layout, because layouts don't re-run when you navigate between pages.

### Server actions with validation

A **server action** is a function marked `"use server"` that a form can call directly, with no API route to write. Treat it exactly like a public API endpoint, because that's what it is:

```ts
// app/admin/(panel)/careers/actions.ts
export async function saveJob(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();   // 1. who are you?

  const parsed = jobSchema.safeParse(readForm(formData));   // 2. is the input valid?
  if (!parsed.success) {
    return { ok: false, error: "Check the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };
  }
  // 3. write with the user's client (RLS applies), 4. refresh public pages
```

### `revalidatePath`

After a save, the public pages showing that content are rebuilt straight away instead of waiting for their hourly refresh:

```ts
// lib/admin/revalidate.ts
if (kind === "careers") revalidatePath("/careers");
```

### Storage uploads

Images go to a Supabase Storage bucket called `media`. The upload route (`app/admin/upload/route.ts`) checks that the request comes from the same site, that the user is an admin, the size limit, and the file's magic bytes, then saves it under a random name. Random names stop people from guessing or overwriting files.

**Try it yourself:** Sign in at `/admin`, create a test job opening, and watch it appear on `/careers`. Then set it to closed and check it disappears for visitors. Finally, delete it.

**Learn more:** [Supabase SSR auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) · [Server Actions](https://nextjs.org/docs/app/getting-started/updating-data) · [Supabase Storage](https://supabase.com/docs/guides/storage)

---

## 9. Testing

### Types of tests

| Type | Checks | Example |
| --- | --- | --- |
| Type-checking | Code is consistent | `npx tsc --noEmit` |
| Linting | Common mistakes and bad patterns | `npm run lint` |
| Unit | One function in isolation | Formatting a date |
| End-to-end (E2E) | The real site in a real browser | Playwright, `tests/e2e/` |

This project leans on E2E tests, because most risk is in how the pages render and behave.

### The Playwright suite

`playwright.config.ts` runs the dev server, uses your installed Chrome, and repeats every test at three screen sizes:

```ts
projects: [
  { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
  { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
  {
    name: "mobile",
    use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  },
],
```

| Spec | Checks |
| --- | --- |
| `pages.spec.ts` | Every page loads, has one `<h1>`, a title, a description and a share image, no console errors, no sideways scrolling, alt text on images, no broken internal links |
| `design.spec.ts` | Full-page screenshots, layout rules (navbar doesn't cover the headline, CTA above the fold), the mobile menu |
| `a11y.spec.ts` | Automated accessibility (axe) on every page |
| `security.spec.ts` | Security headers, API validation, honeypot, rate limits, upload checks, admin redirects |
| `forms.spec.ts` | Form validation and the hidden honeypot field |

### Running it

```bash
npm run test:e2e                                          # everything (slow, ~25 min cold)
npx playwright test tests/e2e/forms.spec.ts               # one file
npx playwright test --project=mobile -g "mobile menu"     # one viewport, tests matching a name
npx playwright show-report                                # open the HTML report
```

### Never send real emails in tests

The tests only send payloads that are **invalid** (rejected by zod), that **fill the honeypot** (faked success), or that carry a fake file rejected by the magic-byte check. None of them reach Resend. When you write tests for anything with side effects (emails, payments, deletions), design them so they can't trigger the real thing.

**Try it yourself:** Run `npx playwright test tests/e2e/forms.spec.ts --project=desktop`. Then break something on purpose (remove the `required` message from a form field), run it again, read the failure, and undo your change.

**Learn more:** [Playwright: writing tests](https://playwright.dev/docs/writing-tests) · [Test configuration](https://playwright.dev/docs/test-configuration) · [Accessibility testing](https://playwright.dev/docs/accessibility-testing)

---

## 10. Git, GitHub and CI

### Commits

A commit should be one logical change with a message that says **what and why**:

```
fix: phase 7 audits - accessibility 100, faster first paint, careers from Supabase
```

The prefix (`feat`, `fix`, `chore`, `security`, `refactor`) follows the Conventional Commits style, which makes the history easy to scan.

### Branches

For anything risky, work on a branch so `main` stays working:

```bash
git checkout -b upgrade/next-16      # new branch
# ...make changes, run checks...
git checkout main
git merge --ff-only upgrade/next-16  # bring it in only if main hasn't moved
git branch -d upgrade/next-16
```

### Scan before you push

Once something is pushed to GitHub, assume it's public forever, even if you delete it later. Before pushing:

```bash
git status                                  # what changed?
git diff --cached --name-only               # exactly which files will be committed?
git log origin/main..HEAD --oneline         # which commits will be pushed?
```

Look for `.env` files, keys (long random strings, `sk_…`, `eyJ…`), private emails and debug files. If a secret is ever pushed, **rotate it** (create a new one and disable the old) immediately; deleting the commit isn't enough.

### `.gitignore`

It lists what Git must never track: `node_modules`, `.next`, `.env*`, test output, and `assets-raw/` (large original images).

### CI with GitHub Actions

`.github/workflows/ci.yml` runs on every push and pull request, on GitHub's servers:

```yaml
- name: Type-check
  run: npx tsc --noEmit

- name: Lint
  run: npm run lint

# Fails only on critical advisories in runtime dependencies
- name: Dependency audit
  run: npm audit --omit=dev --audit-level=critical
```

If any step fails, GitHub shows a red cross on the commit. That's your early warning before a broken change reaches the live site.

**Try it yourself:** Open the repository on GitHub → **Actions** tab. Open the latest run and read each step's output.

**Learn more:** [GitHub Actions quickstart](https://docs.github.com/en/actions/writing-workflows/quickstart) · [Ignoring files](https://docs.github.com/en/get-started/git-basics/ignoring-files) · [Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

## 11. Upgrading dependencies safely

The process we used for Next.js 15 → 16:

1. **Read the official upgrade guide first.** Every major version lists its breaking changes.
2. **Check which ones affect you.** Search your code for the APIs mentioned (`middleware`, `next lint`, image `quality`, `revalidateTag`…).
3. **Work on a branch.**
4. **Upgrade, then fix what the tools report.** Type-check, lint, then test in the browser.
5. **Merge only when everything passes.**

What actually changed for us:

| Change | What we did |
| --- | --- |
| `middleware.ts` renamed to `proxy.ts` | Renamed the file and its export |
| `next lint` removed | `npm run lint` now runs `eslint .`, with a new flat config |
| Turbopack is the default bundler | Removed `--turbopack` from the dev script |
| Stricter React hooks lint rules | Rewrote 6 places that set state inside effects |
| React 19.2+ | Upgraded `react`, `react-dom` and their types |

The new lint rules found real (if minor) problems. A common one is setting state inside `useEffect` when you could **derive** the value instead:

```tsx
// Before: an effect copied the title into the slug
useEffect(() => { if (!touched) setSlug(slugify(title)); }, [title, touched]);

// After: just calculate it during render
const shownSlug = touched ? slug : slugify(title);
```

Run `npm audit` before and after upgrades. The Next 16 upgrade took us from two known vulnerabilities to zero.

**Try it yourself:** Run `npm outdated` to see which packages have newer versions. For one of them, find its changelog and decide whether the update is safe.

**Learn more:** [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) · [You might not need an effect](https://react.dev/learn/you-might-not-need-an-effect) · [npm audit](https://docs.npmjs.com/cli/commands/npm-audit)

---

## 12. Deploying on Vercel and environment variables

Vercel builds and deploys the site every time you push to GitHub. Each push to a non-`main` branch gets a **preview** URL; pushes to `main` go to **production** (www.vrtechbro.com).

### Environment variables

Set these in Vercel → your project → **Settings → Environment Variables**. Never commit their values.

| Variable | Public? | What it's for |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project's address |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public key; safe only because RLS protects every table |
| `RESEND_API_KEY` | **No** | Lets the server send email through Resend |
| `EMAIL_TO` | No | The inbox that receives form submissions |
| `EMAIL_FROM` | No | The sender address (must be on a domain verified in Resend) |

Error tracking with Sentry adds four more:

| Variable | Public? | What it's for |
| --- | --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN` | Yes | Where error reports are sent. Public by design: it only allows *sending* events |
| `SENTRY_ORG` / `SENTRY_PROJECT` | No | Which Sentry project receives source maps at build time |
| `SENTRY_AUTH_TOKEN` | **No** | Uploads source maps during the build; anyone holding it can act on your Sentry account |

The same rule applies: anything with `NEXT_PUBLIC_` is visible to visitors.

### How error tracking is wired in

Next.js calls `instrumentation.ts` once when the server starts, and `instrumentation-client.ts` once in the browser. Those files start Sentry; `onRequestError` reports errors thrown on the server, and the error boundaries (`app/(site)/error.tsx`, `app/global-error.tsx`) report errors that crash a page in the browser. Three choices worth understanding:

- **The tunnel route** (`/sentry-tunnel`): the browser sends reports to your own domain, which forwards them to Sentry. Your CSP's `connect-src 'self'` already allows that, and ad blockers that block `sentry.io` can't drop them.
- **Privacy** (`dataCollection` in each config): no user details, cookies or request bodies. Without this, an admin's session cookie or a visitor's contact-form message could end up in an error report.
- **No Session Replay:** it records what visitors do, which is useful but adds a lot of JavaScript to every page. On a marketing site, speed wins.

### Preview vs production

Each variable can be enabled for **Production**, **Preview** and **Development** separately. A common practice is to point previews at a separate test database, so testing a branch can never touch real data.

After changing an environment variable, you must **redeploy** for it to take effect: Deployments → the latest one → **Redeploy**.

**Try it yourself:** In Vercel, open the latest deployment and read its build logs from top to bottom. Find where it installs dependencies, builds pages, and lists the routes.

**Learn more:** [Vercel environment variables](https://vercel.com/docs/environment-variables) · [Preview deployments](https://vercel.com/docs/deployments/environments) · [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)

---

## 13. Debugging: two real bugs, step by step

Good debugging is a loop: **reproduce → measure → form one hypothesis → test it → fix the cause → verify**. Guessing and changing several things at once is how bugs survive. Both bugs below came from the live site.

### Bug 1: "The mobile menu opens weirdly; I only see the links from About down"

**Reproduce.** Open the site at phone width (390 px), tap the menu button.

**Measure, don't eyeball.** In the browser console (or a Playwright script) read the numbers:

```js
const m = document.getElementById('mobile-menu')
m.getBoundingClientRect().height // 96, not 844: the "full-screen" menu is header-sized
;[...m.querySelectorAll('a')].map(a => a.getBoundingClientRect().top) // Home at -144: above the screen
```

**Hypothesis.** A `position: fixed` element is normally sized against the screen. When it isn't, an ancestor has become its *containing block*. In CSS, any ancestor with `transform`, `filter`, `backdrop-filter`, `perspective` or `contain` does this. The header had `backdrop-blur` (a `backdrop-filter`), and the menu lived inside the header.

**Fix the cause.** Render the overlay somewhere that has no such ancestor: React's `createPortal(menu, document.body)` in `components/layout/navbar.tsx`. Then a second, smaller issue showed up in the screenshot: the page wrapper creates its own stacking context (`relative z-10`), so the header could never sit above a body-level overlay. The overlay therefore got its own logo and close button.

**Verify.** Re-measure: menu height 844 px, every link between the header and the bottom of the screen, tapping X closes it and restores page scrolling.

**The lesson:** "fixed doesn't fill the screen" or "sticky doesn't stick" almost always means an ancestor's CSS (`transform`, `filter`, `backdrop-filter`, or `overflow` for sticky). Walk up the parents in DevTools and check their computed styles.

### Bug 2: React error #418 in the live site's console

**Reproduce.** Lighthouse's "errors in console" pointed at minified React error #418. The URL in the message (react.dev/errors/418) says it's a **hydration mismatch**: the HTML the server sent contains different text from what React renders in the browser.

**Hypothesis.** Text that legitimately differs between two machines: the current time, random numbers, `window`-only values, or dates formatted in the machine's time zone. Vercel's servers run in UTC; visitors in India run in UTC+5:30. A post published at 22:00 UTC is "Aug 17" on the server and "Aug 18" in an Indian browser. Worse, `blogs.published_at` is a Postgres `timestamp without time zone`, so the browser read it as local time while the server read it as UTC.

**Test the hypothesis.** Load the page in browsers set to different time zones (Playwright: `browser.newContext({ timezoneId: 'Asia/Kolkata' })`) and watch the console.

**Fix the cause.** One helper for every date, `lib/format-date.ts`: parse zone-less timestamps as UTC and format with `timeZone: 'UTC'`, so both machines produce identical text. Every component that showed a date now uses it.

**Verify.** No hydration errors with the browser set to India or to Los Angeles, and identical dates in both.

**The lesson:** Anything rendered on the server must render *identically* in the browser. Keep dates, times, randomness and browser-only values out of the first render, or make them deterministic (fixed time zone, values passed from the server).

**Try it yourself:** In `components/home/writing-list.tsx`, temporarily replace `formatDate(post.published_at)` with `new Date(post.published_at).toLocaleString()`. Run `npm run dev`, switch your computer's time zone, reload, and find the hydration warning in the console. Then undo the change.

**Learn more:** [MDN: containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block) · [React: createPortal](https://react.dev/reference/react-dom/createPortal) · [React: hydration mismatches](https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content) · [Next.js: hydration errors](https://nextjs.org/docs/messages/react-hydration-error)

---

## 14. A checklist for any new website

**Plan**
- [ ] Write the goal, audience and the pages you need
- [ ] Split the work into phases with a "done" checklist each

**Foundation**
- [ ] Next.js App Router, TypeScript strict mode, ESLint
- [ ] One brand file for colours and fonts; no hard-coded colours
- [ ] Public pages server-rendered; `'use client'` only where needed
- [ ] `.gitignore` covers `.env*`, `node_modules`, build output

**Content and SEO**
- [ ] Title, description and share image on every page
- [ ] `sitemap.ts`, `robots.ts`, JSON-LD where it fits
- [ ] One `<h1>` per page, headings in order

**Design and motion**
- [ ] Mobile-first; test at 390, 768 and 1440 px
- [ ] Animations follow the reading flow; honour reduced motion
- [ ] Nothing hidden until JavaScript loads

**Security**
- [ ] Security headers and a CSP
- [ ] Server-side validation (zod) on every input, with max lengths
- [ ] Escape user text in emails and HTML
- [ ] Rate limits and a honeypot on public forms
- [ ] RLS on every database table; admin checks on every page and action
- [ ] Secrets only in environment variables; never `NEXT_PUBLIC_` a secret

**Quality**
- [ ] Type-check and lint pass
- [ ] E2E tests for pages, forms, accessibility and security
- [ ] Lighthouse on the live site: performance, accessibility, best practices and SEO

**Ship**
- [ ] CI runs on every push
- [ ] Scan staged files and commits for secrets before pushing
- [ ] Environment variables set in Vercel, then redeploy
- [ ] Error tracking and uptime monitoring connected

---

*When you find a gap in this guide, add to it. It's yours.*
