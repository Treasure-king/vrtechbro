import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { Hero } from '@/components/hero'
import { ServiceCard } from '@/components/service-card'
import { BlogCard } from '@/components/blog-card'
import { ContactForm } from '@/components/contact-form'
import TechTags from '@/components/tech-tags'
import AboutUs from '@/public/images/AboutUs.webp'
import Image from 'next/image'
import { ServiceCardProps } from '@/types/service-card'
import { BlogCardProps } from '@/types/blog-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'VRTechBro – Empowering Your Digital Future',
  description:
    'VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth. Trusted full-stack IT partner for startups and enterprises.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'VRTechBro – Empowering Your Digital Future',
    description:
      'VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth.',
    url: 'https://vrtechbro.com',
    images: [
      {
        url: '/images/vrTechBro.webp',
        alt: 'VRTechBro - Full-Stack IT Partner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VRTechBro – Empowering Your Digital Future',
    description:
      'VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth.',
    images: ['/images/vrTechBro.webp'],
  },
}

export const revalidate = 3600;

export default async function HomePage() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: true })
    .limit(3)

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .limit(3)

  const siteUrl = 'https://vrtechbro.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'VRTechBro',
        description:
          'VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth.',
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: 'VRTechBro – Empowering Your Digital Future',
        description:
          'VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth.',
        isPartOf: { '@id': `${siteUrl}/#website` },
        inLanguage: 'en-US',
      },
    ],
  }

  return (
    <div className="min-h-screen">
      {/* Page-specific WebSite + WebPage JSON-LD (Organization is in layout.tsx) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />

      <TechTags />

      {/* About Section */}
      <section
        aria-labelledby="about-title"
        className="relative py-24 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-glow opacity-30" />

        <div className="relative z-10 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <Image
              src={AboutUs}
              alt="About VRTechBro - IT Services Company"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full rounded-2xl shadow-2xl shadow-black/20 object-cover border border-border-subtle"
            />
          </div>
          <div className="text-center md:text-left md:w-1/2">
            <h2
              id="about-title"
              className="text-3xl sm:text-4xl font-display font-bold mb-5 text-text-primary"
            >
              Your Trusted Full-Stack{' '}
              <span className="text-gradient">IT Partner</span>
            </h2>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              At VRTechBro, we help startups and enterprises transform ideas
              into intelligent, scalable, and secure software solutions. With
              expertise across technologies like{' '}
              <strong className="text-text-primary">Next.js</strong>,{' '}
              <strong className="text-text-primary">Node.js</strong>,{' '}
              <strong className="text-text-primary">Supabase</strong>,{' '}
              <strong className="text-text-primary">Python</strong>, and more,
              our full-stack team builds high-impact web & mobile apps, cloud
              platforms, and enterprise systems that fuel real-world success.
            </p>
            <div className="mt-6">
              <Link href="/about">
                <Button variant="secondary">
                  Learn More About Us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24" aria-labelledby="services-title">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2
              id="services-title"
              className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-4"
            >
              Custom IT Services That{' '}
              <span className="text-gradient">Drive Results</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-text-secondary">
              Explore our featured services including full-stack development,
              backend integrations, mobile applications, and scalable SaaS
              platforms using modern technologies.
            </p>
          </div>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {(services ?? []).map((service: ServiceCardProps, index: number) => {
              return (
                <ServiceCard
                  key={service.id}
                  slug={service.slug}
                  title={service.title}
                  short_description={service.short_description}
                  image_url={service.image_url}
                  icon={service.icon}
                  keywords={service.keywords || []}
                  delay={index * 0.05}
                />
              )
            })}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/services">
              <Button>
                Explore More Services
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-24" aria-labelledby="blog-title">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2
              id="blog-title"
              className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-4"
            >
              Insights, Trends &{' '}
              <span className="text-gradient">Tech News</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-text-secondary">
              Stay ahead with expert-written articles on software development,
              emerging frameworks, cloud engineering, and tech strategy.
            </p>
          </div>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {(blogs ?? []).map((blog: BlogCardProps, index: number) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                description={blog.description}
                slug={blog.slug}
                published_at={blog.published_at}
                tags={blog.tags || []}
                delay={index * 0.05}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/blog">
              <Button variant="secondary">
                Read More Articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24" aria-labelledby="contact-title">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2
              id="contact-title"
              className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-4"
            >
              Let&apos;s Build Something{' '}
              <span className="text-gradient">Incredible</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Need a reliable software development team? Let&apos;s talk about your
              business needs and how VRTechBro can deliver value.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
