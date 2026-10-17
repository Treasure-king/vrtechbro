import { expect, test } from "@playwright/test";
import { ROUTE_KEYS, resolveRoute, scrollThrough, slugName } from "./helpers";

for (const key of ROUTE_KEYS) {
  test(`design ${key}`, async ({ page, request }, testInfo) => {
    const route = await resolveRoute(request, key);
    await page.goto(route, { waitUntil: "networkidle" });

    // Navbar sits above the page title rather than covering it
    const header = page.getByRole("banner");
    await expect(header).toBeVisible();
    const h1 = page.locator("h1");
    const [headerBox, h1Box] = [await header.boundingBox(), await h1.boundingBox()];
    expect(headerBox && h1Box, "header and h1 boxes").toBeTruthy();
    expect(h1Box!.y, "h1 starts below the navbar").toBeGreaterThanOrEqual(
      headerBox!.y + headerBox!.height - 1,
    );

    // Let scroll-triggered reveals play, then capture the whole page
    await scrollThrough(page);
    const footer = page.getByRole("contentinfo");
    await expect(footer, "footer reachable at page end").toBeInViewport();

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `test-results/screenshots/${testInfo.project.name}/${slugName(route)}.png`,
      fullPage: true,
    });
  });
}

test("home hero headline stays moderate and the CTA is above the fold", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const h1 = page.locator("h1");
  const fontSize = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  if (testInfo.project.name === "desktop") {
    expect(fontSize, "desktop hero font-size (px)").toBeLessThanOrEqual(56);
  }

  const cta = page.locator("main").getByRole("link", { name: "Start a project" }).first();
  await expect(cta).toBeVisible();
  const box = await cta.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.y + box!.height, "CTA bottom edge within the first screen").toBeLessThanOrEqual(viewport.height);
});

test.describe("mobile menu", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // The menu button only exists below the md breakpoint (768px)
    test.skip((testInfo.project.use.viewport?.width ?? 0) >= 768, "No menu button at md and up");
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile primary navigation" })).toBeVisible();
  });

  test("keeps keyboard focus inside the open menu", async ({ page }) => {
    for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
    const focusInsideOverlay = await page.evaluate(() => {
      const active = document.activeElement;
      const nav = document.querySelector('nav[aria-label="Mobile primary navigation"]');
      const overlay = nav?.closest("[class*='fixed']") ?? nav?.parentElement;
      return !!active && !!overlay && overlay.contains(active);
    });
    expect(focusInsideOverlay, "focus trapped in the open menu").toBe(true);
  });

  test("closes with Escape", async ({ page }) => {
    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Mobile primary navigation" })).toBeHidden();
  });
});
