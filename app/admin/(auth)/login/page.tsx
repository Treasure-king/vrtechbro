import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/admin/auth";

const NOTICES: Record<string, string> = {
  "not-authorised":
    "That account doesn't have admin access, so it was signed out.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="border-border-subtle bg-bg-secondary w-full max-w-sm rounded-2xl border p-8">
        <Logo size={56} className="mb-6" />
        <h1 className="font-display text-text-primary text-2xl font-semibold">
          Sign in to the admin
        </h1>
        <p className="text-text-secondary mt-2 mb-8 text-sm">
          Manage services, blog posts and open roles.
        </p>
        <LoginForm notice={error ? NOTICES[error] : undefined} />
      </div>
    </main>
  );
}
