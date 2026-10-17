"use client";

import { Honeypot } from "@/components/shared/honeypot";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ServiceOverlayProps {
  serviceId: string;
  serviceTitle: string;
  /** Text on the button that opens the form */
  triggerLabel?: string;
  triggerVariant?: "default" | "outline" | "secondary";
  triggerSize?: "default" | "lg";
  triggerClassName?: string;
}

const enquirySchema = z.object({
  clientName: z.string().min(2, "Enter your name (at least 2 characters)."),
  clientEmail: z
    .string()
    .email("Enter a valid email address, like name@company.com."),
  clientPhone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[0-9\s\-()]{7,}$/.test(val), {
      message:
        "Enter a phone number with at least 7 digits, or leave it empty.",
    }),
  projectName: z
    .string()
    .min(2, "Give the project a short name (at least 2 characters)."),
  projectDetails: z
    .string()
    .min(10, "Describe the project in at least 10 characters."),
  budgetMin: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Minimum budget must be a number of 0 or more.",
    }),
  budgetMax: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Maximum budget must be a number of 0 or more.",
    }),
  timeDuration: z.enum(
    [
      "less_than_1_month",
      "1_to_3_months",
      "3_to_6_months",
      "6_to_12_months",
      "more_than_1_year",
    ],
    { message: "Choose an estimated timeline." },
  ),
  preferredContact: z.enum(["email", "phone", "either"]).optional(),
  agreeTerms: z.preprocess(
    (val) => val === "on",
    z.boolean().refine((val) => val === true, {
      message: "Agree to the privacy policy and terms to send your enquiry.",
    }),
  ),
  serviceTitle: z.string(),
  serviceId: z.string(),
});

const TIMELINES = [
  ["less_than_1_month", "Less than 1 month"],
  ["1_to_3_months", "1 to 3 months"],
  ["3_to_6_months", "3 to 6 months"],
  ["6_to_12_months", "6 to 12 months"],
  ["more_than_1_year", "More than 1 year"],
] as const;

const inputStyles =
  "w-full rounded-lg border border-border-subtle bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 disabled:opacity-50";
const errorStyles = "border-error focus:border-error focus:ring-error/20";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-text-primary block text-sm font-medium"
      >
        {label}
        {hint && (
          <span className="text-text-muted ml-1.5 font-normal">{hint}</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-error text-xs">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ServiceOverlay({
  serviceId,
  serviceTitle,
  triggerLabel = "Enquire about this service",
  triggerVariant = "default",
  triggerSize = "lg",
  triggerClassName,
}: ServiceOverlayProps) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const budgetError = errors.budgetMin || errors.budgetMax;

  const fieldProps = (name: string) => ({
    id: `enquiry-${name}`,
    name,
    disabled: loading,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `enquiry-${name}-error` : undefined,
    className: cn(inputStyles, errors[name] && errorStyles),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const result = enquirySchema.safeParse(data);

    if (!result.success) {
      const formErrors: Record<string, string> = {};
      result.error.issues.forEach(({ path, message }) => {
        const key = path[0];
        if (
          (typeof key === "string" || typeof key === "number") &&
          !formErrors[String(key)]
        ) {
          formErrors[String(key)] = message;
        }
      });
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/enquiry-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          [HONEYPOT_FIELD]: data[HONEYPOT_FIELD] ?? "",
        }),
      });

      if (response.ok) {
        toast.success("Enquiry sent. We'll reply to you by email.");
        setOpen(false);
      } else if (response.status === 429) {
        toast.error(
          "Too many enquiries in a short time. Wait a minute, then send again.",
        );
      } else {
        toast.error(
          "Your enquiry wasn't sent. Check your connection and send again, or email us directly.",
        );
      }
    } catch {
      toast.error(
        "Your enquiry wasn't sent. Check your connection and send again, or email us directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
        >
          {triggerLabel}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        data-lenis-prevent
        className="border-border-subtle bg-bg-secondary w-full gap-0 overflow-y-auto p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-border-subtle border-b p-6 pr-12">
          <SheetTitle className="font-display text-text-primary text-2xl font-bold tracking-tight">
            Enquire about {serviceTitle}
          </SheetTitle>
          <SheetDescription className="text-text-secondary">
            Tell us what you have in mind. We read every enquiry and reply by
            email.
          </SheetDescription>
        </SheetHeader>

        <form
          className="relative flex flex-col gap-5 p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <Honeypot />
          <input type="hidden" name="serviceTitle" value={serviceTitle} />
          <input type="hidden" name="serviceId" value={serviceId} />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="enquiry-clientName"
              label="Name"
              error={errors.clientName}
            >
              <input
                type="text"
                autoComplete="name"
                {...fieldProps("clientName")}
              />
            </Field>
            <Field
              id="enquiry-clientEmail"
              label="Email"
              error={errors.clientEmail}
            >
              <input
                type="email"
                autoComplete="email"
                {...fieldProps("clientEmail")}
              />
            </Field>
          </div>

          <Field
            id="enquiry-clientPhone"
            label="Phone"
            hint="optional"
            error={errors.clientPhone}
          >
            <input
              type="tel"
              autoComplete="tel"
              {...fieldProps("clientPhone")}
            />
          </Field>

          <Field
            id="enquiry-projectName"
            label="Project name"
            error={errors.projectName}
          >
            <input
              type="text"
              placeholder="e.g. Booking app for our clinic"
              {...fieldProps("projectName")}
            />
          </Field>

          <Field
            id="enquiry-projectDetails"
            label="What do you need?"
            error={errors.projectDetails}
          >
            <textarea
              rows={5}
              placeholder="Goals, must-have features, links to anything similar you like"
              {...fieldProps("projectDetails")}
              className={cn(
                inputStyles,
                "resize-y",
                errors.projectDetails && errorStyles,
              )}
            />
          </Field>

          <fieldset className="space-y-1.5">
            <legend className="text-text-primary text-sm font-medium">
              Budget in USD{" "}
              <span className="text-text-muted font-normal">optional</span>
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="From"
                aria-label="Minimum budget in USD"
                {...fieldProps("budgetMin")}
                aria-describedby={
                  budgetError ? "enquiry-budget-error" : undefined
                }
              />
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="To"
                aria-label="Maximum budget in USD"
                {...fieldProps("budgetMax")}
                aria-describedby={
                  budgetError ? "enquiry-budget-error" : undefined
                }
              />
            </div>
            {budgetError && (
              <p id="enquiry-budget-error" className="text-error text-xs">
                {budgetError}
              </p>
            )}
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="enquiry-timeDuration"
              label="Timeline"
              error={errors.timeDuration}
            >
              <select defaultValue="" {...fieldProps("timeDuration")}>
                <option value="" disabled>
                  Choose one
                </option>
                {TIMELINES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              id="enquiry-preferredContact"
              label="Reach me by"
              hint="optional"
            >
              <select defaultValue="" {...fieldProps("preferredContact")}>
                <option value="" disabled>
                  Choose one
                </option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="either">Either</option>
              </select>
            </Field>
          </div>

          <div className="space-y-1.5">
            <label className="text-text-secondary flex items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                name="agreeTerms"
                disabled={loading}
                aria-invalid={errors.agreeTerms ? true : undefined}
                aria-describedby={
                  errors.agreeTerms ? "enquiry-agreeTerms-error" : undefined
                }
                className="border-border-subtle accent-accent-primary mt-0.5 h-4 w-4 rounded"
              />
              <span>
                I agree to the{" "}
                <a
                  href="/privacy-policy"
                  className="text-accent-primary hover:text-accent-hover underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  privacy policy
                </a>{" "}
                and{" "}
                <a
                  href="/terms"
                  className="text-accent-primary hover:text-accent-hover underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms
                </a>
                .
              </span>
            </label>
            {errors.agreeTerms && (
              <p id="enquiry-agreeTerms-error" className="text-error text-xs">
                {errors.agreeTerms}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="mt-1 w-full"
          >
            {loading ? "Sending enquiry" : "Send enquiry"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
