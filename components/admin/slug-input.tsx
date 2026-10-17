"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Field, fieldAria, inputClass } from "@/components/admin/field";
import { slugify } from "@/lib/admin/validation";

/**
 * Title + slug pair. While the slug hasn't been edited by hand it follows the
 * title, so new items get a sensible URL automatically.
 */
export function TitleSlugFields({
  defaultTitle,
  defaultSlug,
  basePath,
  slugHint: customHint,
  errors,
}: {
  defaultTitle?: string;
  defaultSlug?: string;
  basePath: string;
  /** Overrides the default "Address on the site" hint */
  slugHint?: string;
  errors?: Record<string, string>;
}) {
  const [title, setTitle] = useState(defaultTitle ?? "");
  const [slug, setSlug] = useState(defaultSlug ?? "");
  const [touched, setTouched] = useState(Boolean(defaultSlug));

  useEffect(() => {
    if (!touched) setSlug(slugify(title));
  }, [title, touched]);

  const slugHint =
    customHint ?? `Address on the site: ${basePath}/${slug || "…"}`;

  return (
    <>
      <Field id="title" label="Title" error={errors?.title}>
        <Input
          {...fieldAria("title", errors?.title)}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClass}
        />
      </Field>
      <Field id="slug" label="Slug" hint={slugHint} error={errors?.slug}>
        <Input
          {...fieldAria("slug", errors?.slug, slugHint)}
          value={slug}
          onChange={(e) => {
            setTouched(true);
            setSlug(e.target.value);
          }}
          className={inputClass}
        />
      </Field>
    </>
  );
}
