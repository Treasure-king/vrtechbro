// app/about/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

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
      'Discover VRTechBro’s mission, vision, and expertise in crafting scalable websites, mobile applications, and backend systems.',
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
  "@type": "WebPage",
  "name": "About Us – VRTechBro",
  "description":
    "Learn about VRTechBro, a modern digital studio crafting scalable websites, apps, and backend solutions with skill and vision.",
  "url": "https://www.vrtechbro.com/about",
  "publisher": {
    "@type": "Organization",
    "name": "VRTechBro",
    "url": "https://www.vrtechbro.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.vrtechbro.com/logo.png"
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

      <div className="bg-dark text-white py-20">
        <section className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            About VRTechBro
          </h1>
          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
            We’re a modern digital studio crafting next-generation websites,
            mobile applications, and backend solutions for clients worldwide. Our
            mission is to transform complex challenges into simple, scalable, and
            elegant digital experiences.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 grid sm:grid-cols-2 gap-8">
          <article
            className="bg-transparent border border-slate-700 p-6 rounded-xl shadow"
            aria-labelledby="mission-heading"
          >
            <h3 id="mission-heading" className="text-xl font-semibold mb-3">
              🚀 Our Mission
            </h3>
            <p className="text-gray-300">
              To empower businesses with beautifully designed, high-performance digital
              products that drive growth and deliver real-world impact.
            </p>
          </article>

          <article
            className="bg-transparent border border-slate-700 p-6 rounded-xl shadow"
            aria-labelledby="vision-heading"
          >
            <h3 id="vision-heading" className="text-xl font-semibold mb-3">
              💡 Our Vision
            </h3>
            <p className="text-gray-300">
              To become the trusted technology partner for forward-thinking businesses,
              recognized globally for innovation, reliability, and elegance in digital solutions.
            </p>
          </article>
        </section>

        <section className="max-w-4xl mx-auto px-6 mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Technologies We Love</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Crafting every solution with performance, scalability, and maintainability in mind.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
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
              <span key={idx} className="bg-slate-800 px-3 py-1 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Optional Add-On: CTA for deeper engagement */}
        <section className="max-w-3xl mx-auto px-6 mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Know More?</h2>
          <p className="text-gray-400 mb-6">
            Explore our services or check out our blog to see how we solve complex
            challenges with elegant, scalable solutions.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/services" className="btn">
              Our Services
            </Link>
            <Link href="/blog" className="btn">
              Our Blog
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
