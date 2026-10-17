import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { BlogForm } from "@/components/admin/blog-form";
import { requireAdmin } from "@/lib/admin/auth";
import { UUID_PATTERN } from "@/lib/admin/revalidate";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!post) notFound();

  return (
    <>
      <AdminPageHeader title={`Edit: ${post.title}`} />
      <BlogForm post={post} />
    </>
  );
}
