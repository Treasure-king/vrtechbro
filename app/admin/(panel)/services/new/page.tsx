import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/service-form";
import { requireAdmin } from "@/lib/admin/auth";
import { iconMap } from "@/lib/icon-map";

export default async function NewServicePage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Add service" />
      <ServiceForm icons={Object.keys(iconMap)} />
    </>
  );
}
