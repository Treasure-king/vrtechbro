import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import { signOut } from "@/app/admin/actions";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="md:flex">
      <aside className="border-border-subtle bg-bg-secondary flex flex-col gap-6 border-b p-4 md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-r md:border-b-0 md:p-5">
        <div className="flex items-center justify-between md:block">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo size={36} />
            <span className="font-display text-text-primary text-sm font-semibold">
              Admin
            </span>
          </Link>
        </div>
        <AdminNav />
        <div className="mt-auto hidden space-y-3 md:block">
          <p
            className="text-text-muted truncate text-xs"
            title={user.email ?? undefined}
          >
            {user.email}
          </p>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary flex items-center gap-2 text-sm"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            View site
          </Link>
          <form action={signOut}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-8 md:px-10 md:py-10">
        {children}
        <form action={signOut} className="mt-12 md:hidden">
          <Button type="submit" variant="outline" size="sm">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out ({user.email})
          </Button>
        </form>
      </main>
    </div>
  );
}
