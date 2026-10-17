"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { revalidateContent, UUID_PATTERN } from "@/lib/admin/revalidate";
import { readingTime } from "@/components/blog/markdown";
import {
  type ActionResult,
  csvList,
  dbErrorResult,
  field,
  imageUrlField,
  intField,
  optionalDate,
  optionalText,
  slugField,
  slugify,
  toFieldErrors,
} from "@/lib/admin/validation";

const blogSchema = z.object({
  title: z.string().trim().min(2, "Add a title").max(200),
  slug: slugField,
  description: z
    .string()
    .trim()
    .min(10, "Write a one or two sentence summary")
    .max(300, "Use 300 characters or fewer"),
  content: z.string().trim().min(20, "Write the article").max(100000),
  tags: csvList,
  keywords: csvList,
  author: optionalText(80),
  thumbnail: imageUrlField,
  published_at: optionalDate,
  reading_time: intField,
  meta_title: optionalText(70),
  meta_description: optionalText(170),
});

function readForm(formData: FormData) {
  const title = field(formData, "title");
  return {
    title,
    slug: field(formData, "slug").trim() || slugify(title),
    description: field(formData, "description"),
    content: field(formData, "content"),
    tags: field(formData, "tags"),
    keywords: field(formData, "keywords"),
    author: field(formData, "author"),
    thumbnail: field(formData, "thumbnail"),
    published_at: field(formData, "published_at"),
    reading_time: field(formData, "reading_time"),
    meta_title: field(formData, "meta_title"),
    meta_description: field(formData, "meta_description"),
  };
}

export async function saveBlog(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const id = field(formData, "id");
  if (id && !UUID_PATTERN.test(id))
    return { ok: false, error: "Invalid item." };

  const parsed = blogSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const d = parsed.data;
  const row = {
    ...d,
    // Posts need a date for ordering; default to today
    published_at: d.published_at ?? new Date().toISOString().slice(0, 10),
    // 0 = work it out from the text
    reading_time: d.reading_time > 0 ? d.reading_time : readingTime(d.content),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = id
    ? await supabase.from("blogs").update(row).eq("id", id).select("id")
    : await supabase.from("blogs").insert(row).select("id");

  if (error) return dbErrorResult(error, "blog save");
  if (!data?.length) return { ok: false, error: "That post no longer exists." };

  revalidateContent(
    "blog",
    [d.slug, field(formData, "previous_slug")].filter(Boolean),
  );
  return { ok: true };
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "Invalid item." };

  const { data, error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id)
    .select("slug");
  if (error) return dbErrorResult(error, "blog delete");
  if (!data?.length) return { ok: false, error: "That post no longer exists." };

  revalidateContent(
    "blog",
    data.map((d) => String(d.slug)),
  );
  return { ok: true };
}
