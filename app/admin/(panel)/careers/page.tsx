import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable, formatDate } from "@/components/admin/data-table";
import { RowEditLink } from "@/components/admin/row-edit-link";
import { DeleteButton } from "@/components/admin/delete-button";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteJob } from "./actions";

export default async function AdminCareersPage() {
  const { supabase } = await requireAdmin();
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, title, location, type, is_open, display_order, date_posted")
    .order("display_order", { ascending: true });
  if (error) console.error("Admin jobs list failed:", error.message);

  return (
    <>
      <AdminPageHeader
        title="Careers"
        description="Roles listed on /careers. Closed roles stay here but are hidden from the site."
        newHref="/admin/careers/new"
        newLabel="Add role"
      />
      {error && (
        <p role="alert" className="text-error mb-6 text-sm">
          Couldn&apos;t load roles. If you haven&apos;t yet, run the jobs
          migration in Supabase.
        </p>
      )}
      <DataTable
        headers={["Role", "Status", "Order", "Posted"]}
        isEmpty={!error && !jobs?.length}
        empty={<>No roles yet. Add one when you&apos;re hiring.</>}
      >
        {jobs?.map((j) => (
          <tr key={j.id}>
            <td className="px-4 py-3">
              <Link
                href={`/admin/careers/${j.id}/edit`}
                className="text-text-primary hover:text-accent-hover font-medium"
              >
                {j.title}
              </Link>
              <div className="text-text-muted text-xs">
                {j.location} · {j.type}
              </div>
            </td>
            <td className="px-4 py-3">
              {j.is_open ? (
                <Badge>Open</Badge>
              ) : (
                <Badge variant="outline">Closed</Badge>
              )}
            </td>
            <td className="text-text-secondary px-4 py-3">
              {j.display_order ?? 0}
            </td>
            <td className="text-text-secondary px-4 py-3">
              {formatDate(j.date_posted)}
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-end gap-1">
                <RowEditLink
                  href={`/admin/careers/${j.id}/edit`}
                  label={j.title}
                />
                <DeleteButton
                  itemLabel={j.title}
                  action={deleteJob.bind(null, j.id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
