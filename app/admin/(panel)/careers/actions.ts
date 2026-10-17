"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { revalidateContent, UUID_PATTERN } from "@/lib/admin/revalidate";
import {
  type ActionResult,
  checkbox,
  dbErrorResult,
  field,
  intField,
  optionalDate,
  slugField,
  slugify,
  toFieldErrors,
} from "@/lib/admin/validation";

const jobSchema = z.object({
  title: z.string().trim().min(2, "Add a role title").max(120),
  slug: slugField,
  location: z.string().trim().min(2, "Add a location").max(80),
  type: z.string().trim().min(2, "Add the type, e.g. Full-time").max(40),
  description: z
    .string()
    .trim()
    .min(20, "Describe the role in a few sentences")
    .max(5000),
  is_open: checkbox,
  display_order: intField,
  date_posted: optionalDate,
  valid_through: optionalDate,
});

function readForm(formData: FormData) {
  const title = field(formData, "title");
  return {
    title,
    slug: field(formData, "slug").trim() || slugify(title),
    location: field(formData, "location"),
    type: field(formData, "type"),
    description: field(formData, "description"),
    is_open: field(formData, "is_open"),
    display_order: field(formData, "display_order"),
    date_posted: field(formData, "date_posted"),
    valid_through: field(formData, "valid_through"),
  };
}

export async function saveJob(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const id = field(formData, "id");
  if (id && !UUID_PATTERN.test(id))
    return { ok: false, error: "Invalid item." };

  const parsed = jobSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const d = parsed.data;
  if (d.valid_through && d.date_posted && d.valid_through < d.date_posted) {
    return {
      ok: false,
      error: "Check the highlighted fields.",
      fieldErrors: { valid_through: "Must be after the posted date" },
    };
  }

  const row = {
    ...d,
    date_posted: d.date_posted ?? new Date().toISOString().slice(0, 10),
  };
  const { data, error } = id
    ? await supabase.from("jobs").update(row).eq("id", id).select("id")
    : await supabase.from("jobs").insert(row).select("id");

  if (error) return dbErrorResult(error, "job save");
  if (!data?.length) return { ok: false, error: "That role no longer exists." };

  revalidateContent("careers");
  return { ok: true };
}

export async function deleteJob(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "Invalid item." };

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) return dbErrorResult(error, "job delete");
  if (!data?.length) return { ok: false, error: "That role no longer exists." };

  revalidateContent("careers");
  return { ok: true };
}
