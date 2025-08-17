// app/services/[slug]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from '@/lib/supabase' // 👈 your Supabase server client
import ServiceOverlay from "@/components/ServiceOverlay";


type PageProps = {
  params: {
    slug: string;
  };
};

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
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  
  const service = await getService(params.slug);

  if (!service) return { title: "Service Not Found" };

  return {
    title: service.title,
    description: service.short_description,
    keywords: service.keywords?.slice(0, 10).join(", "),
    openGraph: {
      title: service.title,
      description: service.short_description,
      images: service.image_url ? [service.image_url] : [],
    },
  };
}

const ServicePage = async ({ params }: PageProps) => {

  const {slug} = await params
  const service = await getService(slug);
  if (!service) return notFound();

  

  return (
    <div
      className="max-w-7xl m-auto grid lg:grid-cols-2 gap-10 items-start text-white p-10"
    >
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
            className="rounded-2xl shadow-lg"
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
  );
}

export default ServicePage

export async function generateStaticParams() {
  const { data, error } = await supabase.from("services").select("slug");
  if (error || !data) return [];

  return data.map((service: { slug: string }) => ({
    slug: service.slug  
  }));
}
