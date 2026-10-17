import { z } from "zod";

/** Result returned by every admin server action. */
export type ActionResult = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "Hello, World!" -> "hello-world" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const slugField = z
  .string()
  .max(80, "Use 80 characters or fewer")
  .regex(SLUG_PATTERN, "Use lowercase letters, numbers and hyphens only");

/** Optional image: an https URL (e.g. Supabase Storage) or a site path under /images/. */
export const imageUrlField = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) =>
      v === "" ||
      /^https:\/\/[^\s]+$/i.test(v) ||
      /^\/images\/[a-z0-9/_.-]+$/i.test(v),
    "Use an https:// address or a path that starts with /images/",
  )
  .transform((v) => (v === "" ? null : v));

export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use ${max} characters or fewer`)
    .transform((v) => (v === "" ? null : v));

/** "a, b ,c" -> ["a","b","c"] (empty -> []) */
export const csvList = z
  .string()
  .max(1000)
  .transform((v) =>
    v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 30),
  );

export const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal("")])
  .optional()
  .transform((v) => v === "on" || v === "true");

export const intField = z
  .string()
  .trim()
  .transform((v) => (v === "" ? 0 : Number(v)))
  .pipe(z.number().int().min(0).max(100000));

export const optionalDate = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use a valid date")
  .transform((v) => (v === "" ? null : v));

/** Reads a FormData field as a string ("" when missing). */
export function field(formData: FormData, name: string): string {
  const v = formData.get(name);
  return typeof v === "string" ? v : "";
}

/** Turns a zod error into { field: firstMessage }. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Postgres unique violation -> friendly slug message; everything else generic. */
export function dbErrorResult(
  error: { code?: string; message: string },
  context: string,
): ActionResult {
  console.error(`Admin ${context} failed:`, error.message);
  if (error.code === "23505") {
    return {
      ok: false,
      error: "That slug is already used by another item.",
      fieldErrors: { slug: "Already in use" },
    };
  }
  return {
    ok: false,
    error: "Couldn't save. Try again, or check the server logs.",
  };
}
