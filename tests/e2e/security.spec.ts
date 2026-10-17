import { expect, test } from "@playwright/test";
import { fakeIp } from "./helpers";

/*
 * SAFETY: no test here may cause a real email. Every API payload is either
 * invalid (rejected by validation) or trips the honeypot (fake success,
 * nothing sent), or carries a file that fails the magic-byte check.
 */

const isDev = !process.env.PLAYWRIGHT_PROD;

test.describe("security headers", () => {
  for (const path of ["/", "/api/send-email"]) {
    test(`headers on ${path}`, async ({ request }) => {
      const res = await request.get(path);
      const h = res.headers();
      const csp = h["content-security-policy"] ?? "";

      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("object-src 'none'");
      // 'unsafe-eval' is only allowed by the dev server (React Refresh needs it);
      // next.config omits it in production, so only check that outside dev.
      if (!isDev) expect(csp).not.toContain("'unsafe-eval'");

      expect(h["strict-transport-security"]).toMatch(/max-age=\d{7,}/);
      expect(h["x-frame-options"]).toBe("DENY");
      expect(h["x-content-type-options"]).toBe("nosniff");
      expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(h["permissions-policy"]).toContain("camera=()");
      expect(h["x-powered-by"]).toBeUndefined();
    });
  }
});

test.describe("API hardening", () => {
  test("invalid payload is rejected without leaking internals", async ({ request }, info) => {
    const res = await request.post("/api/send-email", {
      headers: { "x-forwarded-for": fakeIp(info.title + info.project.name) },
      data: { name: "a", email: "not-an-email", message: "hi" },
    });
    expect(res.status()).toBe(400);
    const body = await res.text();
    expect(body).not.toMatch(/at \w+ \(|node_modules|stack/i);
  });

  test("malformed JSON is a client error, not a server error", async ({ request }, info) => {
    const res = await request.post("/api/send-email", {
      headers: {
        "x-forwarded-for": fakeIp(info.title + info.project.name),
        "content-type": "application/json",
      },
      data: "{not json",
    });
    expect(res.status(), "malformed JSON status").toBe(400);
    expect(await res.text()).not.toMatch(/at \w+ \(|node_modules/);
  });

  test("honeypot runs before validation on every form API", async ({ request }, info) => {
    const ip = () => fakeIp(info.title + info.project.name);
    const contact = await request.post("/api/send-email", {
      headers: { "x-forwarded-for": ip() },
      data: { name: "a", email: "bad", message: "x", website: "http://spam.example" },
    });
    expect(contact.status()).toBe(200);
    expect(await contact.json()).toMatchObject({ status: "success" });

    const enquiry = await request.post("/api/enquiry-email", {
      headers: { "x-forwarded-for": ip() },
      data: { clientName: "a", website: "http://spam.example" },
    });
    expect(enquiry.status()).toBe(200);

    const career = await request.post("/api/career-apply", {
      headers: { "x-forwarded-for": ip() },
      multipart: { name: "a", website: "http://spam.example" },
    });
    expect(career.status()).toBe(200);
  });

  test("rate limit returns 429 with Retry-After", async ({ request }, info) => {
    const ip = fakeIp(info.title + info.project.name);
    let last;
    for (let i = 0; i < 6; i++) {
      last = await request.post("/api/send-email", {
        headers: { "x-forwarded-for": ip },
        data: { name: "a" }, // invalid on purpose
      });
    }
    expect(last!.status()).toBe(429);
    expect(Number(last!.headers()["retry-after"])).toBeGreaterThan(0);
  });

  test("résumé upload with a fake PDF is rejected by its file signature", async ({ request }, info) => {
    const res = await request.post("/api/career-apply", {
      headers: { "x-forwarded-for": fakeIp(info.title + info.project.name) },
      multipart: {
        name: "Test Applicant",
        email: "applicant@example.com",
        position: "Frontend Developer",
        resume: {
          name: "resume.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.from("MZ this is really an executable"),
        },
      },
    });
    expect(res.status()).toBe(400);
    expect(await res.text()).toMatch(/Invalid file type/);
  });
});

test.describe("framing and crawling", () => {
  test("robots.txt keeps crawlers out of the admin and API", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \/api\//);
    expect(robots, "robots.txt should disallow /admin").toMatch(/Disallow: \/admin/);
  });
});

/*
 * Admin panel checks. The admin area is being built in parallel; until it
 * exists these fail with 404s rather than redirects. That is expected for now.
 */
test.describe("admin access control", () => {
  for (const path of ["/admin", "/admin/services"]) {
    test(`${path} requires a session`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(/\/admin\/login/);
    });
  }

  test("login page is not indexed", async ({ page }) => {
    const res = await page.goto("/admin/login", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});
