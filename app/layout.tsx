// app/layout.tsx
import "./globals.css";
import { BRAND, fontMono, fontSans } from "@/lib/brand";
import { BrandStyle } from "@/components/brand/brand-style";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Curtain } from "@/components/layout/curtain";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

export const metadata = {
  title: {
    default: "VRTechBro | Custom Software & App Development Agency",
    template: "%s", // page titles already carry the brand suffix
  },
  description:
    "VRTechBro is a modern digital studio building custom software, web & mobile apps, SaaS platforms, and scalable backends using Next.js, Supabase, and Python.",
  robots: "index, follow",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "VRTechBro",
    "vrtechbro digital studio",
    "software development company",
    "custom web development agency",
    "Next.js development",
    "Supabase backend development",
    "cloud-native software solutions",
    "hire full stack developers",
    "enterprise IT services",
    "modern SaaS development",
    "mobile and web app development",
    "backend as a service",
    "digital transformation partner",
  ],
  authors: [{ name: "VRTechBro", url: "https://vrtechbro.com" }],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  metadataBase: new URL("https://vrtechbro.com"),
  openGraph: {
    title: "VRTechBro | Full-Stack Software Solutions & SaaS Development",
    description:
      "Build modern, scalable software with VRTechBro: experts in Next.js, Supabase, cloud-native backends, and custom app development.",
    url: "https://vrtechbro.com",
    siteName: "VRTechBro – Modern Digital Studio",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "VRTechBro - Digital Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VRTechBro – Full-Stack Software & SaaS Development Agency",
    description:
      "Offering custom software, SaaS, mobile, and backend services with Next.js, Supabase, and Python.",
    site: "@vrtechbro",
    creator: "@vrtechbro",
    images: ["/opengraph-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={BRAND.colors.canvas} />
        <BrandStyle />
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
                "https://x.com/vrtechbro",
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
      <body className="grain font-body antialiased">
        <ThemeProvider>
          <SmoothScroll />
          <TooltipProvider>
            <Curtain footer={<Footer />}>
              <Navbar />
              <main className="relative min-h-screen">{children}</main>
            </Curtain>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
