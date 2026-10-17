import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_IMAGES } from "@/lib/images";
import { supabase } from "@/lib/supabase";
import { Hero } from "@/components/home/hero";
import TechTags from "@/components/home/tech-tags";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceIndex } from "@/components/home/service-index";
import { Process } from "@/components/home/process";
import { WritingList } from "@/components/home/writing-list";
import { Comparison } from "@/components/home/comparison";
import { Capabilities } from "@/components/home/capabilities";
import { Button } from "@/components/ui/button";
import { ServiceCardProps } from "@/types/service-card";
import { BlogCardProps } from "@/types/blog-card";

export const metadata: Metadata = {
  title: "VRTechBro – Empowering Your Digital Future",
  description:
    "VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth. Trusted full-stack IT partner for startups and enterprises.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "VRTechBro – Empowering Your Digital Future",
    description:
      "VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth.",
    url: "https://vrtechbro.com",
    images: [
      {
        url: "/opengraph-image.jpg",
        alt: "VRTechBro - Full-Stack IT Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VRTechBro – Empowering Your Digital Future",
    description:
      "VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth.",
    images: ["/opengraph-image.jpg"],
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const [{ data: services }, { data: blogs }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("featured", true)
      .order("display_order", { ascending: true })
      .limit(6),
    supabase
      .from("blogs")
      .select("id, title, slug, description, tags, published_at")
      .order("published_at", { ascending: false })
      .limit(4),
  ]);
  const siteUrl = "https://vrtechbro.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "VRTechBro",
        description:
          "VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth.",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: "VRTechBro – Empowering Your Digital Future",
        description:
          "VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth.",
        isPartOf: { "@id": `${siteUrl}/#website` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <>
      {/* Page-specific WebSite + WebPage JSON-LD (Organization is in layout.tsx) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />

      <TechTags />

      <Capabilities />

      {/* Services */}
      {services && services.length > 0 && (
        <section aria-labelledby="services-title" className="pb-24 md:pb-32">
          <div className="container-page">
            <SectionHeading
              id="services-title"
              title="Pick a service"
              intro="Each one shows what's included, the stack we use and how to get started."
              action={
                <Button asChild variant="outline">
                  <Link href="/services">All services</Link>
                </Button>
              }
            />
            <ServiceIndex services={services as ServiceCardProps[]} />
          </div>
        </section>
      )}

      {/* Process */}
      <section
        aria-labelledby="process-title"
        className="border-border-subtle bg-bg-secondary/40 border-y py-24 md:py-32"
      >
        <div className="container-page">
          <SectionHeading
            id="process-title"
            title="How a project runs"
            intro="Four stages, with something you can see and react to at the end of each one."
          />
          <Process />
        </div>
      </section>

      <Comparison />

      {/* Writing */}
      {blogs && blogs.length > 0 && (
        <section aria-labelledby="blog-title" className="py-24 md:py-32">
          <div className="container-page">
            <SectionHeading
              id="blog-title"
              title="Notes from the studio"
              intro="What we're learning about building for the web, mobile and AI."
              action={
                <Button asChild variant="outline">
                  <Link href="/blog">All articles</Link>
                </Button>
              }
            />
            <WritingList posts={blogs as BlogCardProps[]} />
          </div>
        </section>
      )}

      {/* Contact */}
      <section
        aria-labelledby="contact-title"
        className="border-border-subtle relative overflow-hidden border-t py-24 md:py-32"
      >
        {/* Backdrop kept faint and pushed to the edges so the form stays the focus */}
        <Image
          src={SITE_IMAGES.ctaBg}
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none [mask-image:linear-gradient(180deg,black,transparent_85%)] object-cover opacity-35"
        />
        <div className="container-page relative">
          <SectionHeading
            id="contact-title"
            title="Tell us what you're planning"
            intro="Share a few lines about your project. We'll reply by email with questions or a next step."
          />
          <ContactForm />
        </div>
      </section>
    </>
  );
}
