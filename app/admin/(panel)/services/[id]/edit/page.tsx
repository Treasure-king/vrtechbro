import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/service-form";
import { requireAdmin } from "@/lib/admin/auth";
import { UUID_PATTERN } from "@/lib/admin/revalidate";
import { iconMap } from "@/lib/icon-map";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!service) notFound();

  return (
    <>
      <AdminPageHeader title={`Edit: ${service.title}`} />
      <ServiceForm service={service} icons={Object.keys(iconMap)} />
    </>
  );
}
