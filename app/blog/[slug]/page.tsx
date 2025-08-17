import { Metadata } from "next";
import { FiUser, FiClock } from "react-icons/fi";
import { notFound } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { BlogCardProps } from "@/types/blog-card";

// Fetch a blog by slug
async function getBlog(slug: string): Promise<BlogCardProps | null> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return data as BlogCardProps;
}

// Metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  if (!blog) return { title: "Blog Not Found" };

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.description,
    keywords: blog.keywords?.join(", "),
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: blog.thumbnail ? [blog.thumbnail] : [],
    },
  };
}

// Blog Page
const BlogPage = async ({
  params,
}: {
  params: { slug: string };
}): Promise<JSX.Element> => {
  const blog = await getBlog(params.slug);
  if (!blog) return notFound();

  return (
    <main className="bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-400">{blog.description}</p>
        {/* Add more render logic here */}
      </div>
    </main>
  );
};

export default BlogPage;

// Static Params for Pre-rendering
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase.from("blogs").select("slug");

  if (error || !data) return [];

  return data.map((blog) => ({ slug: blog.slug }));
}
