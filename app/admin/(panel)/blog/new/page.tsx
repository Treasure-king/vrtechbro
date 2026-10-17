import { AdminPageHeader } from "@/components/admin/page-header";
import { BlogForm } from "@/components/admin/blog-form";
import { requireAdmin } from "@/lib/admin/auth";

export default async function NewBlogPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Write a post" />
      <BlogForm />
    </>
  );
}
