import { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Process } from '@/components/home/process'
import { ServiceList } from '@/components/services/service-list'
import { Button } from '@/components/ui/button'
import { ServiceCardProps } from '@/types/service-card'

export const metadata: Metadata = {
  title: 'IT Services & Software Development Solutions | VRTechBro',
  description:
    'Explore full-stack IT services including SaaS development, custom web apps, mobile solutions, and scalable backend systems delivered by VRTechBro.',
  keywords: [
    'IT services',
    'software development',
    'SaaS development',
    'custom web apps',
    'mobile app development',
    'scalable backend systems',
    'cloud integration',
    'Next.js developers',
    'hire software team',
    'digital transformation',
    'enterprise software solutions',
    'full-stack development',
    'mobile solutions',
    'software consulting',
    'API development',
    'VRTechBro',
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'IT Services & Software Development Solutions | VRTechBro',
    description:
      'Explore full-stack IT services including SaaS development, custom web apps, mobile solutions, and scalable backend systems delivered by VRTechBro.',
    url: 'https://vrtechbro.com/services',
    siteName: 'VRTechBro',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'VRTechBro IT Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT Services & Software Development Solutions | VRTechBro',
    description:
      'Full-stack IT services including SaaS development, web apps, and cloud backend solutions.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const revalidate = 3600;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'IT Services & Software Development Solutions – VRTechBro',
  description:
    'Explore full-stack IT services including SaaS development, custom web apps, mobile solutions, and scalable backend systems delivered by VRTechBro.',
  url: 'https://vrtechbro.com/services',
  publisher: {
    '@type': 'Organization',
    name: 'VRTechBro',
    url: 'https://vrtechbro.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://vrtechbro.com/logo.png',
    },
  },
}

export default async function ServicesPage() {
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        title="Services for every part of your product"
        intro="Websites, mobile apps, cloud backends, AI features and the marketing that brings people to them. Take one service on its own, or have us build the whole thing."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/contact">Discuss your project</Link>
            </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#process">See how we work</a>
          </Button>
        </div>
      </PageHero>

      {/* Catalogue */}
      <section aria-label="Service catalogue" className="py-20 md:py-28">
        <div className="container-page">
          {error ? (
            <div role="alert" className="rounded-xl border border-error/40 bg-error/5 p-6 text-text-secondary">
              <p className="font-medium text-text-primary">The service list couldn&apos;t be loaded.</p>
              <p className="mt-1">
                Refresh the page to try again, or{' '}
                <Link href="/contact" className="text-accent-primary underline underline-offset-2">
                  tell us what you need
                </Link>{' '}
                and we&apos;ll point you to the right service.
              </p>
            </div>
          ) : !services || services.length === 0 ? (
            <div role="status" className="rounded-xl border border-border-subtle p-6 text-text-secondary">
              <p className="font-medium text-text-primary">Our service list is being updated.</p>
              <p className="mt-1">
                <Link href="/contact" className="text-accent-primary underline underline-offset-2">
                  Describe your project
                </Link>{' '}
                and we&apos;ll tell you how we can help.
              </p>
            </div>
          ) : (
            <ServiceList services={services as ServiceCardProps[]} />
          )}
        </div>
      </section>

      {/* Process */}
      <section id="process" aria-labelledby="process-title" className="scroll-mt-24 border-y border-border-subtle bg-bg-secondary/40 py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            id="process-title"
            title="How a project runs"
            intro="Every service follows the same four stages, with something you can see and react to at the end of each one."
          />
          <Process />
        </div>
      </section>

      {/* Closing CTA */}
      <section aria-labelledby="services-cta-title" className="py-20 md:py-28">
        <div className="container-page grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 id="services-cta-title" className="type-heading text-text-primary">
              Not sure which service you need?
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
              Describe the problem you&apos;re trying to solve. We&apos;ll suggest an approach and tell you which
              pieces it involves.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/contact">Describe your project</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
