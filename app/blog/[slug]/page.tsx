import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JSX } from "react";
import { supabase } from "@/lib/supabase";
import { Markdown, extractHeadings, readingTime } from "@/components/blog/markdown";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareLinks } from "@/components/blog/share-links";
import { formatPostDate } from "@/components/blog-card";
import { SectionHeading } from "@/components/section-heading";
import { WritingList } from "@/components/home/writing-list";
import type { BlogCardProps } from "@/types/blog-card";

// Fetch a blog by slug
async function getBlog(slug: string) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

// Up to three other posts, ranked by shared tags, falling back to the latest
async function getRelated(slug: string, tags: string[]): Promise<BlogCardProps[]> {
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, tags, published_at")
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(30);

  const posts = (data ?? []) as BlogCardProps[];
  const score = (p: BlogCardProps) => (p.tags ?? []).filter((t) => tags.includes(t)).length;
  return posts
    .map((p, i) => ({ p, s: score(p), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, 3)
    .map(({ p }) => p);
}

// Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return { title: "Blog Not Found | VRTechBro" };

  const blogUrl = `https://vrtechbro.com/blog/${slug}`;

  return {
    title: `${blog.title} | VRTechBro Blog`,
    description: blog.description,
    keywords: blog.keywords?.slice(0, 10),
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: blogUrl,
      siteName: "VRTechBro",
      type: "article",
      locale: "en_IN",
      images: blog.thumbnail || blog.image_url ? [{ url: blog.thumbnail || blog.image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: blog.thumbnail || blog.image_url ? [blog.thumbnail || blog.image_url] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
// Main page component
const BlogPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> => {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return notFound();

  const tags: string[] = blog.tags ?? [];
  const headings = extractHeadings(blog.content);
  const minutes: number = blog.reading_time || readingTime(blog.content);
  const related = await getRelated(slug, tags);
  const url = `https://vrtechbro.com/blog/${slug}`;

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description,
    author: {
      "@type": "Person",
      name: blog.author || "VRTechBro Team",
    },
    publisher: {
      "@type": "Organization",
      name: "VRTechBro",
      url: "https://vrtechbro.com",
      logo: {
        "@type": "ImageObject",
        url: "https://vrtechbro.com/logo.png",
      },
    },
    datePublished: blog.published_at,
    dateModified: blog.updated_at || blog.published_at,
    url: `https://vrtechbro.com/blog/${slug}`,
    image: blog.thumbnail || blog.image_url || "https://vrtechbro.com/opengraph-image.png",
    inLanguage: "en-US",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://vrtechbro.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://vrtechbro.com/blog" },
      { "@type": "ListItem", position: 3, name: blog.title, item: `https://vrtechbro.com/blog/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article>
        <header className="border-b border-border-subtle">
          <div className="container-page pt-12 pb-14 md:pt-16 md:pb-20">
            <nav aria-label="Breadcrumb" className="text-sm text-text-muted">
              <Link href="/blog" className="transition-colors hover:text-text-primary">
                Articles
              </Link>
            </nav>
            <h1 className="mt-8 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance text-text-primary sm:text-5xl lg:text-6xl">
              {blog.title}
            </h1>
            {blog.description && (
              <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-text-secondary md:text-xl">
                {blog.description}
              </p>
            )}
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
              {blog.published_at && (
                <div>
                  <dt className="text-text-muted">Published</dt>
                  <dd className="mt-1 text-text-primary">
                    <time dateTime={new Date(blog.published_at).toISOString()}>
                      {formatPostDate(blog.published_at)}
                    </time>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-text-muted">Reading time</dt>
                <dd className="mt-1 text-text-primary">{minutes} min</dd>
              </div>
              {blog.author && (
                <div>
                  <dt className="text-text-muted">Written by</dt>
                  <dd className="mt-1 text-text-primary">{blog.author}</dd>
                </div>
              )}
              {tags.length > 0 && (
                <div>
                  <dt className="text-text-muted">Topics</dt>
                  <dd className="mt-1 text-text-primary">{tags.join(", ")}</dd>
                </div>
              )}
            </dl>
          </div>
        </header>

        <div className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-12">
          <div className="max-w-[68ch] text-lg leading-[1.75] text-text-secondary lg:col-span-8">
            <Markdown content={blog.content} />
          </div>

          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="space-y-10 border-t border-border-subtle pt-8 lg:sticky lg:top-28 lg:border-t-0 lg:pt-0">
              <div className="hidden lg:block">
                <TableOfContents headings={headings} />
              </div>
              <div>
                <h2 className="mb-4 text-sm font-medium text-text-primary">Share this article</h2>
                <ShareLinks url={url} title={blog.title} />
              </div>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-border-subtle py-16 md:py-24">
          <div className="container-page">
            <SectionHeading id="related-title" title="Keep reading" />
            <WritingList posts={related} />
          </div>
        </section>
      )}
    </>
  );
};

export default BlogPage;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase.from("blogs").select("slug");

  if (error || !data) return [];

  return data.map((blog: { slug: string }) => ({
    slug: blog.slug,
  }));
}
