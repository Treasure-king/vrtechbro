import type { APIRequestContext, Page } from "@playwright/test";

export const STATIC_ROUTES = [
  "/",
  "/services",
  "/about",
  "/blog",
  "/contact",
  "/faq",
  "/careers",
  "/portfolio",
  "/privacy-policy",
  "/terms",
];

/** Finds the first link under `prefix/` on a listing page, e.g. a real service slug. */
export async function discoverSlug(
  request: APIRequestContext,
  listing: string,
  prefix: string,
): Promise<string | null> {
  const html = await (await request.get(listing)).text();
  const match = html.match(new RegExp(`href="(${prefix}/[a-z0-9-]+)"`));
  return match ? match[1] : null;
}

/** Static routes plus one real service and one real blog post. */
export async function allRoutes(request: APIRequestContext): Promise<string[]> {
  const service = await discoverSlug(request, "/services", "/services");
  const post = await discoverSlug(request, "/blog", "/blog");
  return [...STATIC_ROUTES, ...(service ? [service] : []), ...(post ? [post] : [])];
}

/**
 * Known messages that are not app bugs:
 *  - dev-only tooling noise;
 *  - careers falling back to its built-in roles until the owner runs
 *    supabase/migrations/2026-10-15_create_jobs.sql (logged on purpose).
 */
export function isDevNoise(text: string): boolean {
  return /React DevTools|Fast Refresh|\[HMR\]|webpack-hmr|turbopack|Download the React|could not load jobs from Supabase, using fallback list/i.test(
    text,
  );
}

/** Scrolls top-to-bottom so scroll-triggered reveals play, then back to top. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.7));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
  });
}

/** A unique fake client IP so each test gets its own rate-limit bucket. */
export function fakeIp(seed: string): string {
  let h = 0;
  for (const c of seed + Math.random()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `10.${(h >> 16) & 255}.${(h >> 8) & 255}.${h & 255}`;
}

export function slugName(route: string): string {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_");
}

/** Every page to test. The two dynamic entries are resolved per test. */
export const ROUTE_KEYS = [...STATIC_ROUTES, "service-detail", "blog-post"];

export async function resolveRoute(
  request: APIRequestContext,
  key: string,
): Promise<string> {
  if (key === "service-detail") {
    const slug = await discoverSlug(request, "/services", "/services");
    if (!slug) throw new Error("No service link found on /services");
    return slug;
  }
  if (key === "blog-post") {
    const slug = await discoverSlug(request, "/blog", "/blog");
    if (!slug) throw new Error("No post link found on /blog");
    return slug;
  }
  return key;
}
