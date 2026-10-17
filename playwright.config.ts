import { defineConfig } from "@playwright/test";

/**
 * End-to-end suite: design, accessibility, security and forms.
 * Runs against the DEV server only (the owner does production builds).
 * Uses the locally installed Google Chrome, so no browser download is needed.
 *
 *   npm run test:e2e              # everything, all three viewports
 *   npx playwright test --project=mobile tests/e2e/forms.spec.ts
 */
const PORT = 3460;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  timeout: 120_000,
  expect: { timeout: 15_000 },
  retries: 1,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    channel: "chrome",
    navigationTimeout: 90_000,
    actionTimeout: 20_000,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 240_000,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    {
      name: "mobile",
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
});
