import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Page Not Found | VRTechBro',
  description: 'Sorry, the page you are looking for does not exist on VRTechBro.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-8xl font-display font-extrabold text-gradient">
          404
        </h1>
        <h2 className="text-3xl font-display font-bold text-text-primary">Page Not Found</h2>
        <p className="text-text-secondary text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button size="lg">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
