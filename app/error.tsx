'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-5xl font-display font-extrabold text-error">Something Went Wrong</h1>
        <p className="text-text-secondary text-lg">
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="secondary"
            onClick={() => reset()}
          >
            Try Again
          </Button>
          <Link href="/">
            <Button>
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
