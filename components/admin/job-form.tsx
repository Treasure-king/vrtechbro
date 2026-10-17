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
import { TitleSlugFields } from "@/components/admin/slug-input";
import { useSaveResult } from "@/components/admin/use-save-result";
import type { ActionResult } from "@/lib/admin/validation";
import { saveJob } from "@/app/admin/(panel)/careers/actions";

export type JobFormValues = {
  id?: string;
  title?: string;
  slug?: string;
  location?: string | null;
  type?: string | null;
  description?: string | null;
  is_open?: boolean | null;
  display_order?: number | null;
  date_posted?: string | null;
  valid_through?: string | null;
};

export function JobForm({ job }: { job?: JobFormValues }) {
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(saveJob, null);
  useSaveResult(state, "/admin/careers", "Role");
  const e = state?.fieldErrors;

  return (
    <form action={action} className="max-w-3xl space-y-8" noValidate>
      {job?.id && <input type="hidden" name="id" value={job.id} />}

      <Section title="Role">
        <TitleSlugFields
          defaultTitle={job?.title}
          defaultSlug={job?.slug}
          basePath="/careers"
          slugHint="A short, unique ID for this role (lowercase, hyphens)."
          errors={e}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            id="location"
            label="Location"
            hint="e.g. Remote / India"
            error={e?.location}
          >
            <Input
              {...fieldAria("location", e?.location, "e.g. Remote / India")}
              defaultValue={job?.location ?? ""}
              className={inputClass}
            />
          </Field>
          <Field
            id="type"
            label="Type"
            hint="e.g. Full-time, Contract"
            error={e?.type}
          >
            <Input
              {...fieldAria("type", e?.type, "e.g. Full-time, Contract")}
              defaultValue={job?.type ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
        <Field id="description" label="Description" error={e?.description}>
          <Textarea
            {...fieldAria("description", e?.description)}
            defaultValue={job?.description ?? ""}
            rows={8}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Publishing">
        <CheckboxField
          id="is_open"
          label="Accepting applications"
          hint="Untick to hide the role from /careers without deleting it."
          defaultChecked={job?.is_open ?? true}
        />
        <div className="grid gap-6 sm:grid-cols-3">
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
              defaultValue={job?.display_order ?? 0}
              className={inputClass}
            />
          </Field>
          <Field
            id="date_posted"
            label="Posted on"
            hint="Leave empty for today."
            error={e?.date_posted}
          >
            <Input
              {...fieldAria("date_posted", e?.date_posted)}
              type="date"
              defaultValue={job?.date_posted?.slice(0, 10) ?? ""}
              className={inputClass}
            />
          </Field>
          <Field
            id="valid_through"
            label="Closes on"
            hint="Optional. Shown to Google for job listings."
            error={e?.valid_through}
          >
            <Input
              {...fieldAria("valid_through", e?.valid_through)}
              type="date"
              defaultValue={job?.valid_through?.slice(0, 10) ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <FormActions pending={pending} cancelHref="/admin/careers" />
    </form>
  );
}
