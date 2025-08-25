// app/services/[slug]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from '@/lib/supabase';
import ServiceOverlay from "@/components/ServiceOverlay";
import { JSX } from "react";

// ✅ Fetch a single service by slug
async function getService(slug: string) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

// ✅ Dynamic SEO metadata
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

  const canonicalUrl = `https://vrtechbro.com/services/${slug}`;

  return {
    title: `${service.title} | VRTechBro`,
    description: service.short_description,
    keywords,
    openGraph: {
      title: `${service.title} | VRTechBro`,
      description: service.short_description,
      url: canonicalUrl,
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
      canonical: canonicalUrl,
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

  const jsonLd = {
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

  return (
    <>
      <head>
        <title>{service.title} | VRTechBro</title>
        <meta name="description" content={service.short_description} />
        <meta name="keywords" content={service.keywords?.slice(0, 15).join(", ")} />
        <link rel="canonical" href={`https://vrtechbro.com/services/${slug}`} />

        {/* Open Graph */}
        <meta property="og:title" content={`${service.title} | VRTechBro`} />
        <meta property="og:description" content={service.short_description} />
        <meta property="og:url" content={`https://vrtechbro.com/services/${slug}`} />
        <meta property="og:site_name" content="VRTechBro" />
        <meta property="og:type" content="article" />
        {service.image_url && <meta property="og:image" content={service.image_url} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vrtechbro" />
        <meta name="twitter:title" content={`${service.title} | VRTechBro`} />
        <meta name="twitter:description" content={service.short_description} />
        {service.image_url && <meta name="twitter:image" content={service.image_url} />}

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <div className="max-w-7xl m-auto grid lg:grid-cols-2 gap-10 items-start text-white p-10">
        {/* Left Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{service.title}</h1>

          {/* Keywords */}
          {service.keywords?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {service.keywords.map((k: string) => (
                <span
                  key={k}
                  className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full"
                >
                  {k}
                </span>
              ))}
            </div>
          )}

          <p className="text-lg text-gray-200">{service.short_description}</p>
          <p className="text-gray-300 leading-relaxed">{service.long_description}</p>

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
              className="rounded-2xl shadow-lg w-auto h-auto"
            />
          ) : service.icon ? (
            <Image
              src={service.icon}
              alt={service.title}
              width={100}
              height={100}
              className="opacity-80"
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ServicePage;

// Generate static params for SSG
export async function generateStaticParams() {
  const { data, error } = await supabase.from("services").select("slug");
  if (error || !data) return [];

  return data.map((service: { slug: string }) => ({
    slug: service.slug,
  }));
}
