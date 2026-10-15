import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Hero } from "@/components/hero";
import TechTags from "@/components/tech-tags";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { ServiceIndex } from "@/components/home/service-index";
import { Process } from "@/components/home/process";
import { WritingList } from "@/components/home/writing-list";
import { Button } from "@/components/ui/button";
import AboutUs from "@/public/images/AboutUs.webp";
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
        url: "/images/vrTechBro.webp",
        alt: "VRTechBro - Full-Stack IT Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VRTechBro – Empowering Your Digital Future",
    description:
      "VRTechBro offers scalable websites, applications, and cloud solutions tailored to accelerate your business growth.",
    images: ["/images/vrTechBro.webp"],
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

      {/* Studio */}
      <section aria-labelledby="about-title" className="py-24 md:py-32">
        <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 id="about-title" className="type-heading text-text-primary">
              A small studio that covers the whole build
            </h2>
            <div className="text-text-secondary mt-6 max-w-xl space-y-4 text-lg leading-relaxed">
              <p>
                Most projects need more than one skill: design, front end, back
                end, hosting, and someone to keep it running afterwards. We
                handle all of it, so you are not stitching together three
                agencies and a freelancer.
              </p>
              <p>
                That ranges from a fast marketing site to a mobile app, a Chrome
                extension or a SaaS platform with its own API.
              </p>
            </div>
            <Button
              asChild
              variant="link"
              className="mt-6 h-auto px-0 text-base"
            >
              <Link href="/about">How we work and who we are</Link>
            </Button>
          </div>
          <div className="lg:col-span-6">
            <Image
              src={AboutUs}
              alt="The VRTechBro team at work"
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              className="border-border-subtle aspect-[4/3] w-full rounded-2xl border object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      {services && services.length > 0 && (
        <section aria-labelledby="services-title" className="pb-24 md:pb-32">
          <div className="container-page">
            <SectionHeading
              id="services-title"
              title="What we build"
              intro="Pick a service to see what's included, the stack we use and how to get started."
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
        className="border-border-subtle border-t py-24 md:py-32"
      >
        <div className="container-page">
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
