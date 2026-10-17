import Link from 'next/link'
import { Metadata } from 'next'
import { PageHero } from '@/components/shared/page-hero'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Portfolio & Client Projects | VRTechBro',
  description:
    'Explore featured projects, applications, and digital products engineered by VRTechBro for startups and enterprise clients.',
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Portfolio & Client Projects | VRTechBro',
    description:
      'Explore featured software projects and digital solutions delivered by VRTechBro.',
    url: 'https://vrtechbro.com/portfolio',
    siteName: 'VRTechBro',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VRTechBro Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio & Client Projects | VRTechBro',
    description: 'Explore featured software projects and digital solutions delivered by VRTechBro.',
    images: ['/opengraph-image.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'VRTechBro Portfolio',
  description: 'Featured software engineering and product development portfolio by VRTechBro.',
  url: 'https://vrtechbro.com/portfolio',
}

export default function PortfolioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        title="Our work"
        intro="We're writing up detailed case studies of recent projects: what the problem was, how we built it and what changed afterwards. They'll be published here soon."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/contact">Ask about similar work</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/services">See what we build</Link>
          </Button>
        </div>
      </PageHero>

      <section aria-labelledby="portfolio-meanwhile-title" className="py-16 md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <h2
            id="portfolio-meanwhile-title"
            className="font-display text-2xl font-semibold tracking-tight text-text-primary lg:col-span-4"
          >
            In the meantime
          </h2>
          <ul className="divide-y divide-border-subtle border-y border-border-subtle lg:col-span-8">
            <li className="py-6">
              <p className="text-lg text-text-primary">Want to see examples before you decide?</p>
              <p className="mt-1 text-text-secondary">
                Tell us what you&apos;re planning and we&apos;ll share relevant past work directly.{' '}
                <Link href="/contact" className="text-text-primary underline decoration-border-strong underline-offset-4 hover:decoration-accent-primary">
                  Get in touch
                </Link>
              </p>
            </li>
            <li className="py-6">
              <p className="text-lg text-text-primary">Curious how a project runs?</p>
              <p className="mt-1 text-text-secondary">
                Each service page explains what&apos;s included and the stack we use.{' '}
                <Link href="/services" className="text-text-primary underline decoration-border-strong underline-offset-4 hover:decoration-accent-primary">
                  Browse services
                </Link>
              </p>
            </li>
            <li className="py-6">
              <p className="text-lg text-text-primary">Prefer to read first?</p>
              <p className="mt-1 text-text-secondary">
                Our articles cover how we think about building for the web, mobile and AI.{' '}
                <Link href="/blog" className="text-text-primary underline decoration-border-strong underline-offset-4 hover:decoration-accent-primary">
                  Read the blog
                </Link>
              </p>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
