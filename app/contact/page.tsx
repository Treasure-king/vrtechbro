// app/contact/page.tsx
import { ContactForm } from '@/components/contact-form';
import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Contact Us | VRTECHBRO Pvt. Ltd.',
  description:
    'Get in touch with VRTECHBRO Pvt. Ltd. for your technology solutions. Reach out via email or our contact form.',
  keywords: [
    'Contact VRTECHBRO',
    'Technology solutions',
    'Contact form',
    'Bangalore tech company',
  ],
  openGraph: {
    title: 'Contact Us | VRTECHBRO Pvt. Ltd.',
    description:
      'Reach out to VRTECHBRO Pvt. Ltd. for innovative tech solutions. Fill our contact form or email us today.',
    url: 'https://www.vrtechbro.com/contact',
    siteName: 'VRTECHBRO Pvt. Ltd.',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | VRTECHBRO Pvt. Ltd.',
    description: 'Get in touch with VRTECHBRO Pvt. Ltd. for your technology solutions.',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://www.vrtechbro.com'),
  alternates: {
    canonical: '/contact',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VRTECHBRO Pvt. Ltd.',
  url: 'https://www.vrtechbro.com',
  logo: 'https://www.vrtechbro.com/logo.png',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '',
      contactType: 'customer service',
      email: 'vrtechbro@gmail.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
      hoursAvailable: 'Mon-Fri 09:00-18:00',
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          // JSON-LD script for SEO rich snippet structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <section
        aria-label="Contact VRTECHBRO Pvt. Ltd. team"
        className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-3xl font-semibold mb-6 text-white text-center md:text-left">
          Get in Touch
        </h1>
        <ContactForm />
      </section>
    </>
  );
}
