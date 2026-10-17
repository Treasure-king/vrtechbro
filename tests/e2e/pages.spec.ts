import { expect, test } from "@playwright/test";
import { ROUTE_KEYS, isDevNoise, resolveRoute } from "./helpers";

// Link checks are shared across tests in a worker so each URL is fetched once.
const linkStatus = new Map<string, number>();

for (const key of ROUTE_KEYS) {
  test(`page ${key} is healthy`, async ({ page, request }) => {
    const route = await resolveRoute(request, key);
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isDevNoise(msg.text())) consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status(), `${route} status`).toBe(200);

    // Structure and metadata
    await expect(page.locator("h1"), "exactly one h1").toHaveCount(1);
    const title = await page.title();
    expect(title.match(/VRTechBro/g)?.length ?? 0, `title "${title}"`).toBe(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{20,}/);
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /\S/);

    // Layout: no sideways scrolling
    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(overflow.scroll, "horizontal overflow").toBeLessThanOrEqual(overflow.client);

    // Every image declares alt text (empty alt is fine for decorative art)
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt, "images without alt").toBe(0);

    // Internal links resolve
    const hrefs = await page.$$eval("a[href^='/']", (as) =>
      [...new Set(as.map((a) => a.getAttribute("href")!.split("#")[0]))].filter(
        (h) => h && !h.startsWith("/api/"),
      ),
    );
    const broken: string[] = [];
    for (const href of hrefs) {
      if (!linkStatus.has(href)) {
        const res = await request.get(href, { maxRedirects: 5 });
        linkStatus.set(href, res.status());
      }
      if (linkStatus.get(href)! >= 400) broken.push(`${href} -> ${linkStatus.get(href)}`);
    }
    expect(broken, "broken internal links").toEqual([]);

    expect(consoleErrors, "console errors").toEqual([]);
  });
}

test("unknown route returns the 404 page", async ({ page }) => {
  const response = await page.goto("/nope", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/This page doesn.t exist/);
  // Next adds its own noindex tag for 404s next to the page's, so check the first
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});
