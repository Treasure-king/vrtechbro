import { revalidatePath } from "next/cache";

/** Refresh every public page that shows the changed content. */
export function revalidateContent(
  kind: "services" | "blog" | "careers",
  slugs: string[] = [],
) {
  revalidatePath("/sitemap.xml");
  if (kind === "services") {
    revalidatePath("/");
    revalidatePath("/services");
    for (const slug of new Set(slugs)) revalidatePath(`/services/${slug}`);
  }
  if (kind === "blog") {
    revalidatePath("/");
    revalidatePath("/blog");
    for (const slug of new Set(slugs)) revalidatePath(`/blog/${slug}`);
  }
  if (kind === "careers") revalidatePath("/careers");
}

export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
