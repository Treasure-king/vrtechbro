import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { ServiceCard } from '@/components/service-card'
import { ServiceCardProps } from '@/types/service-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

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
    .order('created_at', { ascending: false })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-7xl mx-auto px-6 py-24" role="main">
      {/* Page Heading */}
      <h1 className="text-4xl sm:text-5xl font-display font-bold text-center mb-6 text-text-primary" tabIndex={-1}>
        Full-Stack IT Services & Custom{' '}
        <span className="text-gradient">Software Solutions</span>
      </h1>

      {/* Intro Paragraph */}
      <p className="text-lg text-center max-w-3xl mx-auto mb-14 text-text-secondary">
        At VRTechBro, we offer a wide range of digital solutions tailored to your business goals — from frontend development with{' '}
        <strong className="text-text-primary">Next.js</strong> to powerful backend APIs, cloud integrations, mobile app builds, and scalable SaaS platforms. Whether you&apos;re a startup or an enterprise, our team delivers reliable, high-performance software across the stack.
      </p>

      {/* Services Grid */}
      {error ? (
        <p className="text-error text-center mt-10" role="alert" aria-live="assertive">
          Failed to load services.
        </p>
      ) : !services || services.length === 0 ? (
        <p className="text-center text-info text-lg" role="status" aria-live="polite">
          No services found.
        </p>
      ) : (
        <section
          aria-labelledby="services-list-heading"
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
        >
          <h2 id="services-list-heading" className="sr-only">
            Our Services
          </h2>
          {services.map((service: ServiceCardProps, index: number) => {
            return (
              <ServiceCard
                key={service.id}
                title={service.title}
                slug={service.slug}
                short_description={service.short_description}
                icon={service.icon}
                keywords={service.keywords || []}
                delay={index * 0.15}
              />
            )
          })}
        </section>
      )}

      {/* Call to Action */}
      <div className="text-center mt-20">
        <h2 className="text-2xl font-display font-semibold mb-4 text-text-primary">Need help choosing the right solution?</h2>
        <p className="mb-8 text-text-secondary">
          Reach out to our experts today and discover how we can build, scale, and maintain your next digital product.
        </p>
        <Link
          href="/contact"
          aria-label="Get a free consultation from VRTechBro"
        >
          <Button size="lg">
            Get a Free Consultation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
    </>
  )
}
