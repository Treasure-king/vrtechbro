

import { Metadata } from "next";
import { FiUser, FiClock } from "react-icons/fi";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JSX } from "react";

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

// Inline formatting parser (links, code, bold, italic)
const parseInlineFormatting = (text: string): React.ReactNode[] => {
  const pattern = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-primary underline hover:text-accent-hover transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="bg-bg-tertiary text-accent-secondary px-1.5 py-0.5 rounded font-mono text-sm"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-text-secondary">
          {part.slice(1, -1)}
        </em>
      );
    }

    return part;
  });
};

// Full Block Markdown renderer
const renderBlogContent = (content: string) => {
  if (!content) return null;
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      const ListTag = currentList.type;
      nodes.push(
        <ListTag
          key={`list-${nodes.length}`}
          className={`my-4 pl-6 space-y-2 text-gray-300 text-lg ${
            currentList.type === 'ul' ? 'list-disc' : 'list-decimal'
          }`}
        >
          {currentList.items.map((item, idx) => (
            <li key={idx}>{parseInlineFormatting(item)}</li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushList();
      if (inCodeBlock) {
        nodes.push(
          <pre
            key={`code-${nodes.length}`}
            className="my-6 p-4 rounded-xl bg-bg-secondary border border-border-subtle overflow-x-auto text-sm text-success font-mono"
          >
            <code>{codeBlockContent.join("\n")}</code>
          </pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemText = trimmed.replace(/^[-*]\s+/, "");
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [olMatch[1]] };
      } else {
        currentList.items.push(olMatch[1]);
      }
      continue;
    }

    flushList();

    if (trimmed.startsWith("#### ")) {
      nodes.push(
        <h4 key={`h4-${nodes.length}`} className="text-lg font-display font-semibold mt-6 mb-2 text-text-primary">
          {parseInlineFormatting(trimmed.replace("#### ", ""))}
        </h4>
      );
    } else if (trimmed.startsWith("### ")) {
      nodes.push(
        <h3 key={`h3-${nodes.length}`} className="text-xl font-display font-semibold mt-8 mb-3 text-accent-primary">
          {parseInlineFormatting(trimmed.replace("### ", ""))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      nodes.push(
        <h2
          key={`h2-${nodes.length}`}
          className="text-2xl sm:text-3xl font-display font-bold mt-10 mb-4 text-text-primary border-b border-border-subtle pb-2"
        >
          {parseInlineFormatting(trimmed.replace("## ", ""))}
        </h2>
      );
    } else if (trimmed.startsWith("> ")) {
      nodes.push(
        <blockquote
          key={`quote-${nodes.length}`}
          className="my-6 pl-4 border-l-4 border-accent-primary text-text-secondary italic text-lg bg-bg-secondary py-3 pr-4 rounded-r-xl"
        >
          {parseInlineFormatting(trimmed.replace(/^>\s*/, ""))}
        </blockquote>
      );
    } else if (trimmed === "---") {
      nodes.push(<hr key={`hr-${nodes.length}`} className="my-8 border-border-subtle" />);
    } else if (trimmed === "") {
      continue;
    } else {
      nodes.push(
        <p key={`p-${nodes.length}`} className="text-text-secondary leading-relaxed text-lg mb-5">
          {parseInlineFormatting(trimmed)}
        </p>
      );
    }
  }

  flushList();
  return nodes;
};

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

      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight text-text-primary mb-6">
            {blog.title}
          </h1>

          <div className="flex items-center text-text-muted mb-8 space-x-6 text-sm md:text-base">
            {blog.author && (
              <div className="flex items-center gap-2">
                <FiUser className="text-accent-primary" />
                <span>{blog.author}</span>
              </div>
            )}
            {blog.reading_time && (
              <div className="flex items-center gap-2">
                <FiClock className="text-accent-primary" />
                <span>{blog.reading_time} min read</span>
              </div>
            )}
          </div>

          {blog.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.keywords.map((keyword: string) => (
                <span
                  key={keyword}
                  className="bg-accent-primary/10 text-accent-primary text-sm px-3 py-1 rounded-full border border-accent-primary/20 font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}

          <p className="text-text-secondary text-lg mb-12 max-w-2xl leading-relaxed">{blog.description}</p>

          <article className="prose prose-invert prose-lg max-w-none">
            {renderBlogContent(blog.content)}
          </article>
        </div>
      </main>
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

