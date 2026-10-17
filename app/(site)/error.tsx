'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CONTACT_EMAIL } from '@/lib/constants'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error)
  }, [error])

  return (
    <section aria-labelledby="error-title" className="container-page py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="font-mono text-sm text-error">Something went wrong</p>
        <h1 id="error-title" className="type-heading mt-4 text-text-primary">
          This page didn&apos;t load
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text-secondary">
          An unexpected error stopped the page from loading. Try again; if it keeps happening, email{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-text-primary underline decoration-border-strong underline-offset-4 hover:decoration-accent-primary"
          >
            {CONTACT_EMAIL}
          </a>
          {error.digest ? ` and mention reference ${error.digest}` : ''}.
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
  )
}
