import { expect, test } from "@playwright/test";
import { discoverSlug } from "./helpers";

/* SAFETY: forms are only ever submitted empty, so nothing is sent. */

test("contact form validates locally and sends nothing when empty", async ({ page }) => {
  const apiCalls: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/")) apiCalls.push(r.url());
  });
  await page.goto("/contact", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert").filter({ hasText: /too short|at least|invalid/i }).first()).toBeVisible();
  expect(apiCalls, "no API request for an invalid form").toEqual([]);
});

test("honeypot field is invisible to people", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "networkidle" });
  const trap = page.locator('form input[name="website"]');
  await expect(trap).toHaveCount(1);
  await expect(trap).toHaveAttribute("tabindex", "-1");
  await expect(trap).toHaveAttribute("autocomplete", "off");
  const hiddenFromAT = await trap.evaluate((el) => !!el.closest('[aria-hidden="true"]'));
  expect(hiddenFromAT, "inside an aria-hidden wrapper").toBe(true);
  const box = await trap.boundingBox();
  expect(box === null || box.x + box.width <= 0, "positioned off-screen").toBe(true);
});

test("service enquiry sheet opens, validates and closes with Escape", async ({ page, request }) => {
  const slug = await discoverSlug(request, "/services", "/services");
  test.skip(!slug, "no services in the database");
  await page.goto(slug!, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Send an enquiry" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: "Send enquiry" }).click();
  await expect(dialog.locator(".text-error, [role='alert']").first()).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("careers application sheet validates and only accepts documents", async ({ page }) => {
  await page.goto("/careers", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Apply for the .* role/ }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await expect(dialog.locator('input[type="file"]')).toHaveAttribute("accept", ".pdf,.doc,.docx");
  await dialog.getByRole("button", { name: "Send application" }).click();
  await expect(dialog.locator(".text-error, [role='alert']").first()).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
