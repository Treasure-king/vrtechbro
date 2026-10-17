import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ROUTE_KEYS, resolveRoute, scrollThrough } from "./helpers";

for (const key of ROUTE_KEYS) {
  test(`accessibility ${key}`, async ({ page, request }) => {
    const route = await resolveRoute(request, key);
    await page.goto(route, { waitUntil: "networkidle" });
    // Reveal animations start at opacity 0; play them so axe measures final colours
    await scrollThrough(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      // The footer wordmark and hero/backdrop art are aria-hidden decoration
      // with deliberately low contrast; they carry no information.
      .exclude('[aria-hidden="true"]')
      .analyze();

    const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const minor = results.violations.filter((v) => !blocking.includes(v));
    for (const v of minor) {
      console.log(`[a11y ${route}] ${v.impact}: ${v.id} (${v.nodes.length}) ${v.help}`);
    }
    expect(
      blocking.map((v) => `${v.id}: ${v.help} -> ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`),
      `serious/critical axe violations on ${route}`,
    ).toEqual([]);
  });
}
