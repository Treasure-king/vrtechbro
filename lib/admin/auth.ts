import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminContext = { supabase: SupabaseClient; user: User };

/**
 * Returns the signed-in admin, or null when the visitor is signed out or is
 * not listed in public.admins. Checks with Supabase on every call
 * (getUser validates the token; is_admin() is evaluated in the database).
 */
export async function getAdmin(): Promise<AdminContext | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) {
    console.error("Admin check failed:", error.message);
    return null;
  }
  return isAdmin === true ? { supabase, user } : null;
}

/**
 * Guard for every admin page and server action. Signed-out visitors go to the
 * login page; signed-in users without admin rights are signed out first.
 */
export async function requireAdmin(): Promise<AdminContext> {
  const admin = await getAdmin();
  if (admin) return admin;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  await supabase.auth.signOut();
  redirect("/admin/login?error=not-authorised");
}
