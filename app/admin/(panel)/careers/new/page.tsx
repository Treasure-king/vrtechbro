import { AdminPageHeader } from "@/components/admin/page-header";
import { JobForm } from "@/components/admin/job-form";
import { requireAdmin } from "@/lib/admin/auth";

export default async function NewJobPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Add role" />
      <JobForm />
    </>
  );
}
