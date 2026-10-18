"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { BRAND } from "@/lib/brand";

/**
 * Last-resort error screen: only shown if the root layout itself fails.
 * It replaces the whole document, so it renders its own <html> and <body>
 * with inline styles from lib/brand.ts (the site's stylesheet may not have loaded).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: BRAND.colors.canvas,
          color: BRAND.colors.text,
          fontFamily: "system-ui, sans-serif",
          padding: "1.5rem",
        }}
      >
        <main style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.75rem" }}>
            Something went wrong
          </h1>
          <p
            style={{
              color: BRAND.colors.textSecondary,
              lineHeight: 1.6,
              margin: "0 0 1.5rem",
            }}
          >
            The site hit an unexpected error. It has been reported. Try again,
            or come back in a few minutes.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: BRAND.colors.primary,
              color: BRAND.colors.onPrimary,
              border: 0,
              borderRadius: "0.75rem",
              padding: "0.75rem 1.25rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
