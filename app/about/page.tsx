// app/about/page.tsx
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/motion/reveal'
import { Principles } from '@/components/about/principles'
import { Disciplines } from '@/components/about/disciplines'
import AboutUs from '@/public/images/AboutUs.webp'

export const metadata: Metadata = {
  title: 'About Us – VRTechBro | Modern Digital Studio for Web, Apps & Backends',
  description:
    'Learn about VRTechBro, a modern digital studio building scalable websites, mobile apps, and backend solutions. Discover our mission, vision, and expertise.',
  keywords: [
    'about VRTechBro',
    'modern digital studio',
    'Next.js development',
    'web development company',
    'backend solutions',
    'scalable software',
  ],
  openGraph: {
    title: 'About Us – VRTechBro | Modern Digital Studio',
    description:
      "Discover VRTechBro's mission, vision, and expertise in crafting scalable websites, mobile applications, and backend systems.",
    url: 'https://www.vrtechbro.com/about',
    siteName: 'VRTechBro',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About VRTechBro — Modern Digital Studio',
    description: 'Meet VRTechBro: our mission, vision & approach to scalable digital experiences.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/about',
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Us – VRTechBro",
  "description":
    "Learn about VRTechBro, a modern digital studio crafting scalable websites, apps, and backend solutions with skill and vision.",
  "url": "https://vrtechbro.com/about",
  "publisher": {
    "@type": "Organization",
    "name": "VRTechBro",
    "url": "https://vrtechbro.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vrtechbro.com/logo.png"
    }
  }
}


export default function AboutPage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        title="A small studio that designs, builds and runs your product"
        intro="VRTechBro is a founder-led digital studio. We make websites, mobile apps, Chrome extensions, npm packages and the backends behind them, and you talk directly to the people doing the work."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/contact">Start a project</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/services">See our services</Link>
          </Button>
        </div>
      </PageHero>

      {/* Story */}
      <section aria-labelledby="story-title" className="py-24 md:py-32">
        <div className="container-page grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 id="story-title" className="type-heading text-text-primary">
              Not an agency, a workshop
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-text-secondary">
              <p>
                Most software projects pass through a chain of people: a salesperson, a project manager, a designer,
                a developer you never meet. Things get lost at every handoff.
              </p>
              <p>
                We work differently. The same small team scopes your project, designs it, writes the code and keeps
                it running after launch. When you ask a question, the person answering is the one who built it.
              </p>
              <p>
                That range is the point. One project might be a fast marketing site, the next a mobile app with a
                Supabase backend, a browser extension or a published npm package.
              </p>
            </div>
          </div>
          <div className="lg:col-span-6">
            <Image
              src={AboutUs}
              alt="A laptop on a desk in the VRTechBro studio"
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              className="aspect-[4/3] w-full rounded-2xl border border-border-subtle object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section aria-label="Mission and vision" className="border-y border-border-subtle bg-bg-secondary/40">
        <div className="container-page grid md:grid-cols-2">
          <div className="border-b border-border-subtle py-14 md:border-r md:border-b-0 md:py-20 md:pr-12">
            <h2 className="font-display text-sm font-medium text-text-muted">Mission</h2>
            <p className="mt-4 font-display text-2xl leading-snug font-medium tracking-tight text-text-primary md:text-3xl">
              Give businesses well-designed, fast software that makes a measurable difference to how they work.
            </p>
          </div>
          <div className="py-14 md:py-20 md:pl-12">
            <h2 className="font-display text-sm font-medium text-text-muted">Vision</h2>
            <p className="mt-4 font-display text-2xl leading-snug font-medium tracking-tight text-text-primary md:text-3xl">
              Be the technology partner that forward-thinking teams trust for reliable, carefully made products.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles-title" className="py-24 md:py-32">
        <div className="container-page">
          <SectionHeading
            id="principles-title"
            title="What we hold ourselves to"
            intro="The rules we use to make decisions, on client work and on this website."
          />
          <Reveal>
            <Principles />
          </Reveal>
        </div>
      </section>

      {/* Disciplines */}
      <section aria-labelledby="disciplines-title" className="pb-24 md:pb-32">
        <div className="container-page">
          <SectionHeading
            id="disciplines-title"
            title="What we work on"
            intro="The kinds of things we build, and the tools we usually reach for."
          />
          <Disciplines />
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="about-cta-title" className="border-t border-border-subtle py-24 md:py-32">
        <div className="container-page flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 id="about-cta-title" className="type-heading text-text-primary">
              Have something you want built?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-text-secondary">
              Tell us what you have in mind. We&apos;ll reply by email with questions or a suggested next step.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Start a project</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">Read our articles</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
