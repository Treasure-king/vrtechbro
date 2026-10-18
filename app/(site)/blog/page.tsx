import { isoDate } from "@/lib/format-date";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { PostList } from "@/components/blog/post-list";
import { formatPostDate } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { BlogCardProps } from "@/types/blog-card";

export const metadata: Metadata = {
  title: "Tech Blogs & Insights | VRTechBro",
  description:
    "Read expert blogs by VRTechBro on web development, Next.js, backend systems, Supabase, frontend engineering, and digital innovation.",
  keywords: [
    "tech blog",
    "VRTechBro blog",
    "web development articles",
    "Next.js tutorials",
    "Supabase blogs",
    "software engineering",
    "frontend development",
    "backend architecture",
    "digital innovation",
  ],
  openGraph: {
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "VRTechBro",
      },
    ],
    title: "Tech Blogs & Developer Insights | VRTechBro",
    description:
      "Explore the latest tech blogs from VRTechBro: insights on modern stacks, frontend frameworks, scalable architecture, and digital product engineering.",
    url: "https://www.vrtechbro.com/blog",
    siteName: "VRTechBro",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    images: ["/opengraph-image.jpg"],
    card: "summary_large_image",
    title: "VRTechBro Blog – Modern Tech Insights",
    description:
      "VRTechBro shares modern development insights on React, Supabase, backend systems, cloud tools, and scalable web app strategies.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/blog",
  },
};

export const revalidate = 3600;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "VRTechBro Blog",
  url: "https://www.vrtechbro.com/blog",
  description:
    "Read developer insights, engineering tips, and backend/frontend articles from the VRTechBro team.",
  publisher: {
    "@type": "Organization",
    name: "VRTechBro",
    url: "https://www.vrtechbro.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.vrtechbro.com/logo.png",
    },
  },
};

export default async function BlogPage() {
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, description, tags, published_at")
    .order("published_at", { ascending: false });

  const blogs = (data ?? []) as BlogCardProps[];
  const [featured, ...rest] = blogs;

  return (
    <>
      {/* Blog structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title="Articles"
        intro="Writing on web development, mobile apps, backend systems and AI, drawn from the projects we build."
      />

      {!featured ? (
        <section className="container-page py-24">
          <p className="text-text-secondary max-w-xl text-lg">
            No articles are published yet. In the meantime, you can see what we
            build.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/services">Browse services</Link>
          </Button>
        </section>
      ) : (
        <>
          {/* Latest post, given the most room */}
          <section
            aria-labelledby="latest-title"
            className="border-border-subtle border-b"
          >
            <div className="container-page py-16 md:py-24">
              <h2 id="latest-title" className="sr-only">
                Latest article
              </h2>
              <Link
                href={`/blog/${featured.slug}`}
                className="group focus-visible:outline-accent-primary grid gap-6 outline-none focus-visible:outline-2 focus-visible:outline-offset-8 lg:grid-cols-12 lg:gap-12"
              >
                <div className="text-text-muted flex flex-wrap gap-x-4 gap-y-1 text-sm lg:col-span-3 lg:flex-col lg:pt-3">
                  <span className="text-accent-primary">Latest</span>
                  {featured.published_at && (
                    <time dateTime={isoDate(featured.published_at)}>
                      {formatPostDate(featured.published_at)}
                    </time>
                  )}
                  {(featured.tags ?? []).length > 0 && (
                    <span>{(featured.tags ?? []).slice(0, 3).join(", ")}</span>
                  )}
                </div>
                <div className="lg:col-span-9">
                  <p className="type-heading text-text-primary group-hover:text-accent-hover transition-colors">
                    {featured.title}
                  </p>
                  {featured.description && (
                    <p className="text-text-secondary mt-5 max-w-[60ch] text-lg leading-relaxed">
                      {featured.description}
                    </p>
                  )}
                  <span className="text-accent-primary decoration-accent-primary/40 group-hover:decoration-accent-primary mt-8 inline-block text-sm font-medium underline underline-offset-4">
                    Read the article
                  </span>
                </div>
              </Link>
            </div>
          </section>

          {rest.length > 0 && (
            <section
              aria-labelledby="all-posts-title"
              className="py-16 md:py-24"
            >
              <div className="container-page">
                <SectionHeading id="all-posts-title" title="More articles" />
                <PostList posts={rest} />
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
