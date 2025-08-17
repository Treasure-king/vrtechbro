// app/blogs/[slug]/page.tsx

import { Metadata } from "next";
import { FiUser, FiClock } from "react-icons/fi";
import { notFound } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { JSX } from "react";

// Type for PageProps to include `params` explicitly
type PageProps = {
  params: {
    slug: string;
  };
};

// Fetch a blog by slug
async function getblog(slug: string) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

// Bold text parser
const parseBoldText = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );
};

// Content renderer
const renderBlogContent = (content: string) => {
  const lines = content.split('\n');

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={index} className="text-xl font-semibold mt-8 mb-3 text-blue-400">
          {parseBoldText(trimmed.replace('### ', ''))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      return (
        <h2 key={index} className="text-3xl font-bold mt-10 mb-4 text-white border-b border-gray-700 pb-2">
          {parseBoldText(trimmed.replace('## ', ''))}
        </h2>
      );
    } else if (trimmed === '---') {
      return <div key={index} className="my-6 border-t border-gray-700" />;
    } else if (trimmed === '') {
      return null;
    } else {
      return (
        <p key={index} className="text-gray-300 leading-7 text-lg mb-5">
          {parseBoldText(trimmed)}
        </p>
      );
    }
  });
};

// Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const blog = await getblog(params.slug);

  if (!blog) return { title: "Blog Not Found" };

  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.keywords?.slice(0, 10).join(", "),
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: blog.image_url ? [blog.image_url] : [],
    },
  };
}

// Main page with explicit typing for params
const BlogPage = async ({ params }: PageProps): Promise<JSX.Element> => {
  const blog = await getblog(params.slug);
  if (!blog) return notFound();

  return (
    <main className="bg-black min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
          {blog.title}
        </h1>

        {/* Author and Reading Time */}
        <div className="flex items-center text-gray-400 mb-6 space-x-6 text-sm md:text-base">
          {blog.author && (
            <div className="flex items-center gap-2">
              <FiUser className="text-blue-400" />
              <span>{blog.author}</span>
            </div>
          )}
          {blog.reading_time && (
            <div className="flex items-center gap-2">
              <FiClock className="text-blue-400" />
              <span>{blog.reading_time} min read</span>
            </div>
          )}
        </div>

        {/* Keywords */}
        {blog.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.keywords.map((keyword: string) => (
              <span
                key={keyword}
                className="bg-blue-500/10 text-blue-400 text-sm px-3 py-1 rounded-full border border-blue-500/30"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-400 text-lg mb-10 max-w-2xl">{blog.description}</p>

        {/* Blog Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          {renderBlogContent(blog.content)}
        </article>
      </div>
    </main>
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
