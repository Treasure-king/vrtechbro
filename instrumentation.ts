// Next.js loads this once per server start: it picks the Sentry setup for the
// runtime the code runs in, and reports errors thrown while handling requests.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Errors from Server Components, server actions, route handlers and the proxy
export const onRequestError = Sentry.captureRequestError;
