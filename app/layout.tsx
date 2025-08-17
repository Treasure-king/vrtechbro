// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'VRTechBro | Custom IT Services & Software Development Company',
  description:
    'VRTechBro is a full-stack IT services company delivering modern software solutions including custom web development, SaaS platforms, mobile apps, cloud integrations, and scalable backends using Next.js, Supabase, Python, Node.js, and more.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://vrtechbro.com',
  },
  keywords: [
    'IT services',
    'software development company',
    'custom web development',
    'enterprise IT solutions',
    'mobile app development',
    'cloud application development',
    'Next.js developers',
    'Supabase backend',
    'hire full stack developers',
    'digital transformation agency',
  ],
  authors: [{ name: 'VRTechBro', url: 'https://vrtechbro.com' }],
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://vrtechbro.com'),
  openGraph: {
    title: 'VRTechBro | Full-Stack IT Services & Modern Software Solutions',
    description:
      'Partner with VRTechBro for scalable IT solutions: from custom web and mobile app development to backend systems and cloud-native architectures.',
    url: 'https://vrtechbro.com',
    siteName: 'VRTechBro',
    images: [
      {
        url: '/vrtechbro-logo.png',
        width: 1200,
        height: 630,
        alt: 'VRTechBro - Full-Stack IT Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VRTechBro | Your Partner in Scalable Software & IT Services',
    description:
      'Offering end-to-end IT services: web & mobile apps, SaaS solutions, backend development, and more with modern stacks like Next.js, Supabase, and Node.js.',
    site: '@vrtechbro',
    creator: '@vrtechbro',
    images: ['/vrtechbro-logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F172A" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "VRTechBro",
              url: "https://vrtechbro.com",
              logo: "https://vrtechbro.com/vrtechbro-logo.png",
              sameAs: [
                "https://twitter.com/vrtechbro",
                "https://www.linkedin.com/company/vrtechbro",
              ],
              description:
                "VRTechBro is a full-service IT company delivering web, mobile, backend, and cloud-native solutions using modern technologies like Next.js, Supabase, Node.js, Python, and React.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "",
                contactType: "customer support",
                areaServed: "Global",
                availableLanguage: ["English"],
              },
            }),
          }}
        />
      </head>
      <body className={inter.className} >
        <Navbar />
        <main className="min-h-screen" >{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
