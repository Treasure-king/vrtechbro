// Sentry on the Edge runtime (only used if a route opts into `runtime = "edge"`).
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  // Privacy: never send who the visitor is, their cookies (admin sessions),
  // or request/response bodies (contact-form messages, uploads)
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpBodies: [],
  },
});
