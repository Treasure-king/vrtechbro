import { Metadata } from 'next'

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
        url: '/opengraph-image.png',
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
    images: ['/opengraph-image.png'],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-5xl mx-auto py-24 px-6">
        <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6 text-center text-text-primary">
          Our <span className="text-gradient">Work</span>
        </h1>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-16 text-lg leading-relaxed">
          Discover how we craft modern web apps, scalable backends, and digital solutions for our clients.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border border-border-subtle rounded-2xl bg-bg-secondary transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-xl hover:shadow-accent-primary/5">
            <h2 className="text-xl font-display font-semibold mb-3 text-text-primary">Website for Tech Startup</h2>
            <p className="text-text-secondary leading-relaxed">High-performance Next.js SaaS platform with automated workflows.</p>
          </div>
          <div className="p-8 border border-border-subtle rounded-2xl bg-bg-secondary transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-xl hover:shadow-accent-primary/5">
            <h2 className="text-xl font-display font-semibold mb-3 text-text-primary">Mobile App for Healthcare</h2>
            <p className="text-text-secondary leading-relaxed">Cross-platform patient management system with real-time sync.</p>
          </div>
        </div>
      </main>
    </>
  )
}
