import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FormActions({
  pending,
  cancelHref,
}: {
  pending: boolean;
  cancelHref: string;
}) {
  return (
    <div className="border-border-subtle flex flex-wrap gap-3 border-t pt-6">
      <Button type="submit" isLoading={pending}>
        Save
      </Button>
      <Button asChild variant="outline">
        <Link href={cancelHref}>Cancel</Link>
      </Button>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-border-subtle space-y-6 rounded-2xl border p-5 md:p-6">
      <legend className="font-display text-text-primary px-2 text-base font-semibold">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function CheckboxField({
  id,
  label,
  defaultChecked,
  hint,
}: {
  id: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        name={id}
        type="checkbox"
        defaultChecked={defaultChecked}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="accent-accent-primary mt-1 h-4 w-4"
      />
      <div>
        <label htmlFor={id} className="text-text-primary text-sm font-medium">
          {label}
        </label>
        {hint && (
          <p id={`${id}-hint`} className="text-text-muted text-sm">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
