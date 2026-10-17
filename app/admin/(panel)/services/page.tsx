import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable, formatDate } from "@/components/admin/data-table";
import { RowEditLink } from "@/components/admin/row-edit-link";
import { DeleteButton } from "@/components/admin/delete-button";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteService } from "./actions";

export default async function AdminServicesPage() {
  const { supabase } = await requireAdmin();
  const { data: services, error } = await supabase
    .from("services")
    .select("id, title, slug, featured, display_order, category, updated_at")
    .order("display_order", { ascending: true });
  if (error) console.error("Admin services list failed:", error.message);

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="What appears on /services and the home page."
        newHref="/admin/services/new"
        newLabel="Add service"
      />
      {error && (
        <p role="alert" className="text-error mb-6 text-sm">
          Couldn&apos;t load services. Refresh to try again.
        </p>
      )}
      <DataTable
        headers={["Title", "Category", "Order", "Updated"]}
        isEmpty={!error && !services?.length}
        empty={<>No services yet. Add your first one.</>}
      >
        {services?.map((s) => (
          <tr key={s.id}>
            <td className="px-4 py-3">
              <Link
                href={`/admin/services/${s.id}/edit`}
                className="text-text-primary hover:text-accent-hover font-medium"
              >
                {s.title}
              </Link>
              <div className="text-text-muted text-xs">/services/{s.slug}</div>
              {s.featured && <Badge className="mt-1">Featured</Badge>}
            </td>
            <td className="text-text-secondary px-4 py-3">
              {s.category ?? "–"}
            </td>
            <td className="text-text-secondary px-4 py-3">
              {s.display_order ?? 0}
            </td>
            <td className="text-text-secondary px-4 py-3">
              {formatDate(s.updated_at)}
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-end gap-1">
                <RowEditLink
                  href={`/admin/services/${s.id}/edit`}
                  label={s.title}
                />
                <DeleteButton
                  itemLabel={s.title}
                  action={deleteService.bind(null, s.id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
