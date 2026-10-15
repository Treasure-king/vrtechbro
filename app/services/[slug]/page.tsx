import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JSX } from "react";
import { Check, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { iconMap } from "@/lib/helper";
import ServiceOverlay from "@/components/service-overlay";
import { SectionHeading } from "@/components/section-heading";
import { Process } from "@/components/home/process";
import { ServiceIndex } from "@/components/home/service-index";
import { RichText } from "@/components/services/rich-text";
import { ServiceArt } from "@/components/services/service-art";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import type { ServiceCardProps } from "@/types/service-card";

export const revalidate = 3600;

async function getService(slug: string) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

/** Up to three other services, same category first. */
async function getRelated(slug: string, category?: string | null): Promise<ServiceCardProps[]> {
  const { data } = await supabase
    .from("services")
    .select("title, slug, short_description, icon, image_url, category")
    .neq("slug", slug);

  if (!data) return [];
  const list = data as ServiceCardProps[];
  const sameCategory = list.filter((s) => category && s.category === category);
  const others = list.filter((s) => !category || s.category !== category);
  return [...sameCategory, ...others].slice(0, 3);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service)
    return {
      title: "Service Not Found | VRTechBro",
      description: "Sorry, we couldn't find the service you're looking for at VRTechBro.",
      openGraph: {
        title: "Service Not Found | VRTechBro",
        description: "Sorry, we couldn't find the service you're looking for at VRTechBro.",
        url: `https://vrtechbro.com/services/${slug}`,
        siteName: "VRTechBro",
        type: "website",
      },
    };

  const keywords =
    service.keywords && service.keywords.length > 0
      ? service.keywords.slice(0, 15).join(", ")
      : "IT services, software development, SaaS, custom software, mobile app development";

  return {
    title: `${service.title} | VRTechBro`,
    description: service.short_description,
    keywords,
    openGraph: {
      title: `${service.title} | VRTechBro`,
      description: service.short_description,
      url: `https://vrtechbro.com/services/${slug}`,
      siteName: "VRTechBro",
      type: "article",
      images: service.image_url ? [{ url: service.image_url, alt: service.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      site: "@vrtechbro",
      title: `${service.title} | VRTechBro`,
      description: service.short_description,
      images: service.image_url ? [service.image_url] : [],
    },
    alternates: {
      canonical: `/services/${slug}`,
    },
  };
}

const ServicePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> => {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) return notFound();

  const related = await getRelated(slug, service.category);
  const Icon =
    typeof service.icon === "string" ? iconMap[service.icon as keyof typeof iconMap] : undefined;
  const keywords: string[] = service.keywords ?? [];
  const overview: string | undefined = service.content || service.long_description;
  const ctaLabel: string =
    service.cta_enabled !== false && service.cta_label ? service.cta_label : "Enquire about this service";

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.short_description,
    provider: {
      "@type": "Organization",
      name: "VRTechBro",
      url: "https://vrtechbro.com",
    },
    keywords: service.keywords?.join(", "),
    image: service.image_url || undefined,
    url: `https://vrtechbro.com/services/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://vrtechbro.com" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://vrtechbro.com/services" },
      { "@type": "ListItem", position: 3, name: service.title, item: `https://vrtechbro.com/services/${slug}` },
    ],
  };

  return (
    <>
      {/* Service & Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border-subtle">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-page relative grid gap-12 pt-12 pb-16 md:pt-16 md:pb-20 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="mb-10">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-text-muted">
                <li>
                  <Link href="/services" className="transition-colors hover:text-text-primary">
                    Services
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li aria-current="page" className="text-text-secondary">
                  {service.title}
                </li>
              </ol>
            </nav>

            {Icon && <Icon className="mb-6 h-8 w-8 text-accent-primary" aria-hidden="true" />}
            <h1 className="type-display text-text-primary">{service.title}</h1>
            {service.short_description && (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
                {service.short_description}
              </p>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic className="w-full sm:w-auto">
                <ServiceOverlay
                  serviceId={service.slug}
                  serviceTitle={service.title}
                  triggerLabel={ctaLabel}
                  triggerClassName="w-full sm:w-auto"
                />
              </Magnetic>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Ask a question first</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary">
              {service.image_url ? (
                <Image
                  src={service.image_url}
                  alt={`${service.title} illustration`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : (
                <ServiceArt className="p-8" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overview + what it covers */}
      {(overview || keywords.length > 0) && (
        <section aria-labelledby="overview-title" className="py-20 md:py-28">
          <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 id="overview-title" className="type-heading mb-8 text-text-primary">
                Overview
              </h2>
              {overview ? (
                <RichText text={overview} skipHeading={service.title} />
              ) : (
                <p className="text-lg leading-relaxed text-text-secondary">{service.short_description}</p>
              )}
            </div>

            {keywords.length > 0 && (
              <aside aria-labelledby="covers-title" className="lg:col-span-5">
                <div className="rounded-2xl border border-border-subtle bg-bg-secondary/50 p-6 md:p-8 lg:sticky lg:top-28">
                  <h2 id="covers-title" className="font-display text-xl font-semibold text-text-primary">
                    What this covers
                  </h2>
                  <ul className="mt-5 divide-y divide-border-subtle">
                    {keywords.map((k) => (
                      <li key={k} className="flex items-start gap-3 py-3 text-text-secondary">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </section>
      )}

      {/* Process */}
      <section
        aria-labelledby="process-title"
        className="border-y border-border-subtle bg-bg-secondary/40 py-20 md:py-28"
      >
        <div className="container-page">
          <SectionHeading
            id="process-title"
            title="How the work runs"
            intro="Four stages, with something you can review at the end of each one."
          />
          <Process />
        </div>
      </section>

      {/* Enquiry */}
      <section aria-labelledby="enquiry-title" className="py-20 md:py-28">
        <div className="container-page">
          <div className="grid gap-8 rounded-2xl border border-border-strong bg-bg-secondary p-8 md:p-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 id="enquiry-title" className="type-heading text-text-primary">
                Planning a {service.title} project?
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
                Send a short enquiry with your goals, timeline and budget range. We&apos;ll reply by email with
                questions or a proposed next step.
              </p>
            </div>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <ServiceOverlay
                serviceId={service.slug}
                serviceTitle={service.title}
                triggerLabel="Send an enquiry"
                triggerClassName="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="pb-20 md:pb-28">
          <div className="container-page">
            <SectionHeading
              id="related-title"
              title="Often paired with"
              action={
                <Button asChild variant="outline">
                  <Link href="/services">All services</Link>
                </Button>
              }
            />
            <ServiceIndex services={related} />
          </div>
        </section>
      )}
    </>
  );
};

export default ServicePage;

export async function generateStaticParams() {
  const { data, error } = await supabase.from("services").select("slug");
  if (error || !data) return [];

  return data.map((service: { slug: string }) => ({
    slug: service.slug,
  }));
}
