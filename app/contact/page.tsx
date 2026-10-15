import { ContactForm } from '@/components/contact-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | VRTechBro',
  description:
    'Get in touch with VRTechBro for your technology solutions. Reach out via email or our contact form to discuss your project.',
  keywords: [
    'Contact VRTechBro',
    'Technology solutions',
    'Contact form',
    'hire developers',
    'software consulting contact',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | VRTechBro',
    description:
      'Reach out to VRTechBro for innovative tech solutions. Fill our contact form or email us today.',
    url: 'https://vrtechbro.com/contact',
    siteName: 'VRTechBro',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact VRTechBro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | VRTechBro',
    description: 'Get in touch with VRTechBro for your custom software solutions.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact VRTechBro',
  url: 'https://vrtechbro.com/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'VRTechBro',
    url: 'https://vrtechbro.com',
    logo: 'https://vrtechbro.com/logo.png',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'vrtechbro@gmail.com',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      {/* JSON-LD structured data rendered directly in JSX body */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        aria-label="Contact VRTechBro Pvt. Ltd. team"
        className="max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-text-primary text-center md:text-left">
          Let&apos;s Build Something <span className="text-gradient">Together</span>
        </h1>
        <ContactForm />
      </section>
    </>
  );
}
