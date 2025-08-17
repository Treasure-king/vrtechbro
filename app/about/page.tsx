  // app/about/page.tsx
  import { Metadata } from 'next'

  export const metadata: Metadata = {
    title: 'About Us | VRTECHBRO Pvt. Ltd.',
    description:
      'Learn about VRTECHBRO Pvt. Ltd., a modern digital studio specializing in next-generation websites, apps, and backend solutions for businesses worldwide.',
    keywords: [
      'About VRTECHBRO',
      'Digital Studio',
      'Next.js Development',
      'Web Development Company',
      'Technology Partner',
    ],
    openGraph: {
      title: 'About Us | VRTECHBRO Pvt. Ltd.',
      description:
        'Discover VRTECHBRO Pvt. Ltd., crafting scalable and elegant digital experiences worldwide.',
      url: 'https://www.vrtechbro.com/about',
      siteName: 'VRTECHBRO Pvt. Ltd.',
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Us | VRTECHBRO Pvt. Ltd.',
      description:
        'Discover VRTECHBRO Pvt. Ltd., crafting scalable and elegant digital experiences worldwide.',
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
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'About VRTECHBRO Pvt. Ltd.',
    description:
      'Learn about VRTECHBRO Pvt. Ltd., a modern digital studio crafting next-generation websites, apps, and backend solutions.',
    url: 'https://www.vrtechbro.com/about',
    publisher: {
      '@type': 'Organization',
      name: 'VRTECHBRO Pvt. Ltd.',
      url: 'https://www.vrtechbro.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.vrtechbro.com/logo.png',
      },
    },
  }

  export default function AboutPage() {
    return (
      <>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="bg-dark text-white py-20">
          <section className="max-w-4xl mx-auto px-6 text-center">
            <h1
              className="text-4xl sm:text-5xl font-bold mb-6"
            >
              About Our Studio
            </h1>

            <p
              className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto"
            >
              We’re a modern digital studio crafting next-generation websites,
              apps, and backend solutions for businesses worldwide. Our mission is
              to turn complex problems into simple, scalable, and elegant
              experiences.
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
                To empower businesses with scalable, performant, and beautifully
                designed digital products that accelerate growth.
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
                To be recognized globally as a go-to tech partner for innovative
                and reliable web & mobile solutions.
              </p>
            </article>
          </section>

          <section className="max-w-4xl mx-auto px-6 mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Technologies We Love</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              We build with performance, scalability, and maintainability in mind.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
              <span className="bg-slate-800 px-3 py-1 rounded-full">Next.js</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full">React</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full">Node</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full">JavaScript</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full">TypeScript</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full">Tailwind CSS</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full">Supabase</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full">SQL</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full">MongoDB</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full">Motion</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full">Resend</span>
            </div>
          </section>
        </div>
      </>
    )
  }
