import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin();

  const [services, posts, openRoles] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("blogs").select("id", { count: "exact", head: true }),
    supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("is_open", true),
  ]);

  const cards = [
    {
      label: "Services",
      count: services.count,
      href: "/admin/services",
      add: "/admin/services/new",
    },
    {
      label: "Blog posts",
      count: posts.count,
      href: "/admin/blog",
      add: "/admin/blog/new",
    },
    {
      label: "Open roles",
      count: openRoles.count,
      href: "/admin/careers",
      add: "/admin/careers/new",
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Changes you save here appear on the website within a few seconds."
      />
      <ul className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <li
            key={c.label}
            className="border-border-subtle bg-bg-secondary rounded-2xl border p-6"
          >
            <p className="text-text-secondary text-sm">{c.label}</p>
            <p className="font-display text-text-primary mt-2 text-4xl font-semibold">
              {c.count ?? "–"}
            </p>
            <div className="mt-6 flex gap-4 text-sm">
              <Link
                href={c.href}
                className="text-accent-primary hover:text-accent-hover inline-flex items-center gap-1"
              >
                Manage{" "}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href={c.add}
                className="text-text-secondary hover:text-text-primary"
              >
                Add new
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
