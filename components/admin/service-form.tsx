"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldAria, inputClass } from "@/components/admin/field";
import {
  CheckboxField,
  FormActions,
  Section,
} from "@/components/admin/form-actions";
import { ImageField } from "@/components/admin/image-field";
import { TitleSlugFields } from "@/components/admin/slug-input";
import { useSaveResult } from "@/components/admin/use-save-result";
import type { ActionResult } from "@/lib/admin/validation";
import { saveService } from "@/app/admin/(panel)/services/actions";

export type ServiceFormValues = {
  id?: string;
  title?: string;
  slug?: string;
  short_description?: string | null;
  long_description?: string | null;
  content?: string | null;
  keywords?: string[] | null;
  icon?: string | null;
  image_url?: string | null;
  category?: string | null;
  featured?: boolean | null;
  display_order?: number | null;
  cta_label?: string | null;
  cta_enabled?: boolean | null;
  meta_title?: string | null;
  meta_description?: string | null;
};

const selectClass =
  "bg-bg-secondary border-border-subtle text-text-primary h-9 w-full rounded-md border px-3 text-sm";

export function ServiceForm({
  service,
  icons,
}: {
  service?: ServiceFormValues;
  icons: string[];
}) {
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(saveService, null);
  useSaveResult(state, "/admin/services", "Service");
  const e = state?.fieldErrors;

  return (
    <form action={action} className="max-w-3xl space-y-8" noValidate>
      {service?.id && <input type="hidden" name="id" value={service.id} />}
      {service?.slug && (
        <input type="hidden" name="previous_slug" value={service.slug} />
      )}

      <Section title="Basics">
        <TitleSlugFields
          defaultTitle={service?.title}
          defaultSlug={service?.slug}
          basePath="/services"
          errors={e}
        />
        <Field
          id="short_description"
          label="Short description"
          hint="One or two sentences, shown in lists and search results."
          error={e?.short_description}
        >
          <Textarea
            {...fieldAria(
              "short_description",
              e?.short_description,
              "One or two sentences, shown in lists and search results.",
            )}
            defaultValue={service?.short_description ?? ""}
            rows={3}
            className={inputClass}
          />
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            id="category"
            label="Category"
            hint="Groups services on /services."
            error={e?.category}
          >
            <Input
              {...fieldAria(
                "category",
                e?.category,
                "Groups services on /services.",
              )}
              defaultValue={service?.category ?? ""}
              className={inputClass}
            />
          </Field>
          <Field id="icon" label="Icon" error={e?.icon}>
            <select
              {...fieldAria("icon", e?.icon)}
              defaultValue={service?.icon ?? ""}
              className={selectClass}
            >
              <option value="">No icon</option>
              {icons.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <ImageField
          name="image_url"
          label="Illustration"
          folder="services"
          defaultValue={service?.image_url}
          error={e?.image_url}
        />
      </Section>

      <Section title="Page content">
        <Field
          id="long_description"
          label="Overview"
          hint="Shown on the service page when the detailed content below is empty."
          error={e?.long_description}
        >
          <Textarea
            {...fieldAria("long_description", e?.long_description)}
            defaultValue={service?.long_description ?? ""}
            rows={5}
            className={inputClass}
          />
        </Field>
        <Field
          id="content"
          label="Detailed content"
          hint="Paragraphs separated by a blank line. Start a line with ## for a heading or - for a list item."
          error={e?.content}
        >
          <Textarea
            {...fieldAria("content", e?.content)}
            defaultValue={service?.content ?? ""}
            rows={12}
            className={`${inputClass} font-mono text-sm`}
          />
        </Field>
        <Field
          id="keywords"
          label="What this covers"
          hint="Comma separated, e.g. React Native apps, iOS apps, Android apps"
          error={e?.keywords}
        >
          <Input
            {...fieldAria("keywords", e?.keywords)}
            defaultValue={(service?.keywords ?? []).join(", ")}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Display">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            id="display_order"
            label="Order"
            hint="Lower numbers appear first."
            error={e?.display_order}
          >
            <Input
              {...fieldAria("display_order", e?.display_order)}
              type="number"
              min={0}
              defaultValue={service?.display_order ?? 0}
              className={inputClass}
            />
          </Field>
          <Field
            id="cta_label"
            label="Button text"
            hint="Leave empty for the default."
            error={e?.cta_label}
          >
            <Input
              {...fieldAria("cta_label", e?.cta_label)}
              defaultValue={service?.cta_label ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
        <CheckboxField
          id="featured"
          label="Feature on the home page"
          defaultChecked={service?.featured ?? false}
        />
        <CheckboxField
          id="cta_enabled"
          label="Show the enquiry button"
          defaultChecked={service?.cta_enabled ?? true}
        />
      </Section>

      <Section title="Search engines">
        <Field
          id="meta_title"
          label="SEO title"
          hint="Up to 70 characters."
          error={e?.meta_title}
        >
          <Input
            {...fieldAria("meta_title", e?.meta_title)}
            defaultValue={service?.meta_title ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          id="meta_description"
          label="SEO description"
          hint="Up to 170 characters."
          error={e?.meta_description}
        >
          <Textarea
            {...fieldAria("meta_description", e?.meta_description)}
            defaultValue={service?.meta_description ?? ""}
            rows={2}
            className={inputClass}
          />
        </Field>
      </Section>

      <FormActions pending={pending} cancelHref="/admin/services" />
    </form>
  );
}
