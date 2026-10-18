"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report it (no-op until Sentry's DSN is configured) and keep the console trace
    Sentry.captureException(error);
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <section
      aria-labelledby="error-title"
      className="container-page py-24 md:py-32"
    >
      <div className="max-w-2xl">
        <p className="text-error font-mono text-sm">Something went wrong</p>
        <h1 id="error-title" className="type-heading text-text-primary mt-4">
          This page didn&apos;t load
        </h1>
        <p className="text-text-secondary mt-6 text-lg leading-relaxed">
          An unexpected error stopped the page from loading. Try again; if it
          keeps happening, email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-text-primary decoration-border-strong hover:decoration-accent-primary underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
          {error.digest ? ` and mention reference ${error.digest}` : ""}.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => reset()}>
            Try again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Go to the home page</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
