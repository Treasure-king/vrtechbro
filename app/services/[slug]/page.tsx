import { Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { JSX } from "react";

const ServiceOverlay = dynamic(() => import("@/components/service-overlay"), {
  loading: () => (
    <div className="gradient-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl opacity-70">
      Loading...
    </div>
  ),
});

async function getService(slug: string) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
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

      <div className="max-w-7xl m-auto grid lg:grid-cols-2 gap-12 items-start p-10">
        {/* Left Content */}
        <div className="space-y-5">
          <h1 className="text-4xl font-display font-bold text-text-primary">{service.title}</h1>

          {/* Keywords */}
          {service.keywords?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {service.keywords.map((k: string) => (
                <span
                  key={k}
                  className="bg-accent-primary/10 text-accent-primary text-sm px-3 py-1 rounded-full font-medium"
                >
                  {k}
                </span>
              ))}
            </div>
          )}

          <p className="text-lg text-text-secondary">{service.short_description}</p>
          <p className="text-text-secondary/80 leading-relaxed">{service.long_description}</p>

          {/* Action Button */}
          <ServiceOverlay serviceId={service.slug} serviceTitle={service.title} />
        </div>

        {/* Right Side Image/Icon */}
        <div className="flex justify-center lg:justify-end">
          {service.image_url ? (
            <Image
              src={service.image_url}
              alt={service.title}
              width={400}
              height={300}
              sizes="(max-width: 1024px) 100vw, 400px"
              className="rounded-2xl shadow-lg w-auto h-auto"
            />
          ) : service.icon ? (
            <Image
              src={service.icon}
              alt={service.title}
              width={100}
              height={100}
              sizes="100px"
              className="opacity-80"
            />
          ) : null}
        </div>
      </div>
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
