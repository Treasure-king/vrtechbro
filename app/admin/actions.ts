"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SignInState = { error?: string };

const credentials = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});

async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  // 5 attempts per minute per IP, tracked separately from the public forms
  const { allowed } = checkRateLimit(
    `admin-login:${await clientIp()}`,
    5,
    60_000,
  );
  if (!allowed)
    return { error: "Too many attempts. Wait a minute and try again." };

  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  // Same message for every failure, so the form never reveals which accounts exist
  if (!parsed.success) return { error: "Email or password is incorrect." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Email or password is incorrect." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have admin access." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
