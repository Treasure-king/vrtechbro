// app/about/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target, Eye } from 'lucide-react'

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-24">
        <section className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6 text-text-primary">
            About <span className="text-gradient">VRTechBro</span>
          </h1>
          <p className="text-lg text-text-secondary mb-16 max-w-3xl mx-auto leading-relaxed">
            We&apos;re a modern digital studio crafting next-generation websites,
            mobile applications, and backend solutions for clients worldwide. Our
            mission is to transform complex challenges into simple, scalable, and
            elegant digital experiences.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 grid sm:grid-cols-2 gap-6">
          <article
            className="bg-bg-secondary border border-border-subtle p-8 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-xl hover:shadow-accent-primary/5"
            aria-labelledby="mission-heading"
          >
            <div className="p-3 rounded-xl bg-accent-primary/10 w-fit mb-4">
              <Target className="h-6 w-6 text-accent-primary" />
            </div>
            <h2 id="mission-heading" className="text-xl font-display font-semibold mb-3 text-text-primary">
              Our Mission
            </h2>
            <p className="text-text-secondary leading-relaxed">
              To empower businesses with beautifully designed, high-performance digital
              products that drive growth and deliver real-world impact.
            </p>
          </article>

          <article
            className="bg-bg-secondary border border-border-subtle p-8 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-xl hover:shadow-accent-primary/5"
            aria-labelledby="vision-heading"
          >
            <div className="p-3 rounded-xl bg-accent-secondary/10 w-fit mb-4">
              <Eye className="h-6 w-6 text-accent-secondary" />
            </div>
            <h2 id="vision-heading" className="text-xl font-display font-semibold mb-3 text-text-primary">
              Our Vision
            </h2>
            <p className="text-text-secondary leading-relaxed">
              To become the trusted technology partner for forward-thinking businesses,
              recognized globally for innovation, reliability, and elegance in digital solutions.
            </p>
          </article>
        </section>

        <section className="max-w-4xl mx-auto px-6 mt-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4 text-text-primary">Technologies We Love</h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Crafting every solution with performance, scalability, and maintainability in mind.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {[
              'Next.js',
              'React',
              'Node.js',
              'JavaScript',
              'TypeScript',
              'Tailwind CSS',
              'Supabase',
              'SQL',
              'MongoDB',
              'Motion',
              'Resend',
              'React Native',
            ].map((tech, idx) => (
              <span key={idx} className="bg-bg-secondary border border-border-subtle px-4 py-2 rounded-full text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 transition-colors duration-200">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 mt-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4 text-text-primary">Want to Know More?</h2>
          <p className="text-text-secondary mb-8">
            Explore our services or check out our blog to see how we solve complex
            challenges with elegant, scalable solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/services">
              <Button>
                Our Services
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="secondary">
                Our Blog
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
