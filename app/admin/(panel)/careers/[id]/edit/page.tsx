import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { JobForm } from "@/components/admin/job-form";
import { requireAdmin } from "@/lib/admin/auth";
import { UUID_PATTERN } from "@/lib/admin/revalidate";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!job) notFound();

  return (
    <>
      <AdminPageHeader title={`Edit: ${job.title}`} />
      <JobForm job={job} />
    </>
  );
}
