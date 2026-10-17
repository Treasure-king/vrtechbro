"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { iconMap } from "@/lib/icon-map";
import { revalidateContent, UUID_PATTERN } from "@/lib/admin/revalidate";
import {
  type ActionResult,
  checkbox,
  csvList,
  dbErrorResult,
  field,
  imageUrlField,
  intField,
  optionalText,
  slugField,
  slugify,
  toFieldErrors,
} from "@/lib/admin/validation";

const serviceSchema = z.object({
  title: z.string().trim().min(2, "Add a title").max(120),
  slug: slugField,
  short_description: z
    .string()
    .trim()
    .min(10, "Write at least a sentence")
    .max(300, "Use 300 characters or fewer"),
  long_description: optionalText(5000),
  content: optionalText(50000),
  keywords: csvList,
  icon: z
    .string()
    .refine((v) => v === "" || v in iconMap, "Pick an icon from the list")
    .transform((v) => (v === "" ? null : v)),
  image_url: imageUrlField,
  category: optionalText(60),
  featured: checkbox,
  display_order: intField,
  cta_label: optionalText(40),
  cta_enabled: checkbox,
  meta_title: optionalText(70),
  meta_description: optionalText(170),
});

function readForm(formData: FormData) {
  const title = field(formData, "title");
  return {
    title,
    slug: field(formData, "slug").trim() || slugify(title),
    short_description: field(formData, "short_description"),
    long_description: field(formData, "long_description"),
    content: field(formData, "content"),
    keywords: field(formData, "keywords"),
    icon: field(formData, "icon"),
    image_url: field(formData, "image_url"),
    category: field(formData, "category"),
    featured: field(formData, "featured"),
    display_order: field(formData, "display_order"),
    cta_label: field(formData, "cta_label"),
    cta_enabled: field(formData, "cta_enabled"),
    meta_title: field(formData, "meta_title"),
    meta_description: field(formData, "meta_description"),
  };
}

export async function saveService(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const id = field(formData, "id");
  if (id && !UUID_PATTERN.test(id))
    return { ok: false, error: "Invalid item." };

  const parsed = serviceSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const row = { ...parsed.data, updated_at: new Date().toISOString() };
  const { data, error } = id
    ? await supabase.from("services").update(row).eq("id", id).select("id")
    : await supabase.from("services").insert(row).select("id");

  if (error) return dbErrorResult(error, "service save");
  if (!data?.length)
    return { ok: false, error: "That service no longer exists." };

  revalidateContent(
    "services",
    [parsed.data.slug, field(formData, "previous_slug")].filter(Boolean),
  );
  return { ok: true };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "Invalid item." };

  const { data, error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)
    .select("slug");
  if (error) return dbErrorResult(error, "service delete");
  if (!data?.length)
    return { ok: false, error: "That service no longer exists." };

  revalidateContent(
    "services",
    data.map((d) => String(d.slug)),
  );
  return { ok: true };
}
