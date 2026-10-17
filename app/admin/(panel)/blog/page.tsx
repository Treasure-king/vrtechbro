import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable, formatDate } from "@/components/admin/data-table";
import { RowEditLink } from "@/components/admin/row-edit-link";
import { DeleteButton } from "@/components/admin/delete-button";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteBlog } from "./actions";

export default async function AdminBlogPage() {
  const { supabase } = await requireAdmin();
  const { data: posts, error } = await supabase
    .from("blogs")
    .select("id, title, slug, author, published_at, updated_at")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) console.error("Admin blog list failed:", error.message);

  return (
    <>
      <AdminPageHeader
        title="Blog posts"
        description="Articles on /blog and the home page."
        newHref="/admin/blog/new"
        newLabel="Write a post"
      />
      {error && (
        <p role="alert" className="text-error mb-6 text-sm">
          Couldn&apos;t load posts. Refresh to try again.
        </p>
      )}
      <DataTable
        headers={["Title", "Author", "Published", "Updated"]}
        isEmpty={!error && !posts?.length}
        empty={<>No posts yet. Write your first one.</>}
      >
        {posts?.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3">
              <Link
                href={`/admin/blog/${p.id}/edit`}
                className="text-text-primary hover:text-accent-hover font-medium"
              >
                {p.title}
              </Link>
              <div className="text-text-muted text-xs">/blog/{p.slug}</div>
            </td>
            <td className="text-text-secondary px-4 py-3">{p.author ?? "–"}</td>
            <td className="text-text-secondary px-4 py-3">
              {formatDate(p.published_at)}
            </td>
            <td className="text-text-secondary px-4 py-3">
              {formatDate(p.updated_at)}
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-end gap-1">
                <RowEditLink
                  href={`/admin/blog/${p.id}/edit`}
                  label={p.title}
                />
                <DeleteButton
                  itemLabel={p.title}
                  action={deleteBlog.bind(null, p.id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
