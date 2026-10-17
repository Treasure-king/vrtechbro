import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | VRTechBro",
  description:
    "Get in touch with VRTechBro for your technology solutions. Reach out via email or our contact form to discuss your project.",
  keywords: [
    "Contact VRTechBro",
    "Technology solutions",
    "Contact form",
    "hire developers",
    "software consulting contact",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | VRTechBro",
    description:
      "Reach out to VRTechBro for innovative tech solutions. Fill our contact form or email us today.",
    url: "https://vrtechbro.com/contact",
    siteName: "VRTechBro",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact VRTechBro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | VRTechBro",
    description:
      "Get in touch with VRTechBro for your custom software solutions.",
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact VRTechBro",
  url: "https://vrtechbro.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "VRTechBro",
    url: "https://vrtechbro.com",
    logo: "https://vrtechbro.com/logo.png",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "vrtechbro@gmail.com",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title="Let's talk about your project"
        intro="Whether it's a new website, an app, or an idea you're still shaping, tell us a little about it. You'll be talking with the people who would build it."
      />

      <section aria-labelledby="contact-form-title" className="py-16 md:py-24">
        <div className="container-page">
          <h2 id="contact-form-title" className="sr-only">
            Send us a message
          </h2>
          <ContactForm />
        </div>
      </section>

      <section
        aria-labelledby="faq-teaser-title"
        className="border-border-subtle border-t py-16 md:py-20"
      >
        <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2
              id="faq-teaser-title"
              className="font-display text-text-primary text-2xl font-semibold tracking-tight"
            >
              Questions about pricing, timelines or process?
            </h2>
            <p className="text-text-secondary mt-2">
              The FAQ covers the things people usually ask before getting in
              touch.
            </p>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link href="/faq">Read the FAQ</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
