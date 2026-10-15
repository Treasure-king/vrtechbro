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

const DESTINATIONS = [
  { href: '/services', label: 'Services', note: 'What we build and how' },
  { href: '/blog', label: 'Blog', note: 'Articles from the studio' },
  { href: '/contact', label: 'Contact', note: 'Ask us directly' },
]

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-page relative grid gap-12 py-24 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-sm text-accent-primary">Error 404</p>
          <h1 id="not-found-title" className="type-display mt-4 text-text-primary">
            This page doesn&apos;t exist
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
            The link may be out of date, or the address may have a typo. Check the URL, or head to one of the pages
            below.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/">Go to the home page</Link>
            </Button>
          </div>
        </div>

        <nav aria-label="Popular pages" className="self-end lg:col-span-4 lg:col-start-9">
          <ul className="divide-y divide-border-subtle border-y border-border-subtle">
            {DESTINATIONS.map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  className="group flex items-baseline justify-between gap-4 py-4 outline-none focus-visible:bg-bg-secondary"
                >
                  <span className="font-display text-lg font-medium text-text-primary group-hover:text-accent-hover">
                    {d.label}
                  </span>
                  <span className="text-sm text-text-muted">{d.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
