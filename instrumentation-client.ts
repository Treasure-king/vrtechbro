// Sentry in the browser. Does nothing until NEXT_PUBLIC_SENTRY_DSN is set.
// Session Replay and the feedback widget are left out on purpose: they add a
// lot of JavaScript to every page and would hurt the Lighthouse score.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  // Trace 10% of page loads and navigations in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  // Privacy: never send who the visitor is, their cookies (admin sessions),
  // or request/response bodies (contact-form messages, uploads)
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpBodies: [],
  },
});

// Lets Sentry time client-side navigations between pages
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
