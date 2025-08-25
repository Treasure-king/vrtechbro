// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: {
    default: 'VRTechBro | Custom Software & App Development Agency',
    template: '%s | VRTechBro',
  },
  description:
    'VRTechBro is a modern digital studio building custom software, web & mobile apps, SaaS platforms, and scalable backends using Next.js, Supabase, and Python.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://vrtechbro.com',
  },
  keywords: [
    'VRTechBro',
    'vrtechbro digital studio',
    'software development company',
    'custom web development agency',
    'Next.js development',
    'Supabase backend development',
    'cloud-native software solutions',
    'hire full stack developers',
    'enterprise IT services',
    'modern SaaS development',
    'mobile and web app development',
    'backend as a service',
    'digital transformation partner'
  ],
  authors: [{ name: 'VRTechBro', url: 'https://vrtechbro.com' }],
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://vrtechbro.com'),
  openGraph: {
    title: 'VRTechBro | Full-Stack Software Solutions & SaaS Development',
    description:
      'Build modern, scalable software with VRTechBro: experts in Next.js, Supabase, cloud-native backends, and custom app development.',
    url: 'https://vrtechbro.com',
    siteName: 'VRTechBro – Modern Digital Studio',
    images: [
      {
        url: '/vrtechbro-logo.png',
        width: 1200,
        height: 630,
        alt: 'VRTechBro - Digital Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VRTechBro – Full-Stack Software & SaaS Development Agency',
    description:
      'Offering custom software, SaaS, mobile, and backend services with Next.js, Supabase, and Python.',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "VRTechBro",
              url: "https://vrtechbro.com",
              logo: "https://vrtechbro.com/logo.png",
              sameAs: [
                "https://www.linkedin.com/company/vrtechbro",
                "https://www.instagram.com/vrtechbro_official",
                'https://x.com/vrtechbro',
              ],
              description:
                "VRTechBro is a full-service IT company delivering web, mobile, backend, and cloud-native solutions using modern technologies like Next.js, Supabase, Node.js, Python, and React.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "",
                contactType: "Customer Service",
                areaServed: "Worldwide",
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
