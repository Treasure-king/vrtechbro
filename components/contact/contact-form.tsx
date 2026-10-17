"use client";

import { Honeypot } from "@/components/shared/honeypot";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CONTACT_EMAIL, COMPANY_LEGAL_NAME } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const fieldClass =
  "h-12 rounded-lg bg-bg-secondary border-border-subtle text-text-primary placeholder:text-text-muted focus-visible:border-accent-primary";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (
    data: ContactFormData,
    event?: React.BaseSyntheticEvent,
  ) => {
    const form = event?.target as HTMLFormElement | undefined;
    const trap = form?.elements.namedItem(
      HONEYPOT_FIELD,
    ) as HTMLInputElement | null;
    setLoading(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify({ ...data, [HONEYPOT_FIELD]: trap?.value ?? "" }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Message sent. We’ll reply to your email.");
        reset();
      } else {
        toast.error(
          "Your message wasn’t sent. Check the fields and try again.",
        );
      }
    } catch {
      toast.error(
        "Your message wasn’t sent. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-border-subtle grid gap-12 border-t pt-10 lg:grid-cols-12 lg:gap-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Contact form"
        aria-describedby="form-error"
        className="space-y-6 lg:col-span-7"
      >
        <Honeypot />
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="text-text-primary mb-2 block text-sm font-medium"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
              className={fieldClass}
              autoComplete="name"
            />
            {errors.name && (
              <p
                id="name-error"
                className="text-error mt-1.5 text-sm"
                role="alert"
                aria-live="assertive"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-text-primary mb-2 block text-sm font-medium"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              className={fieldClass}
              autoComplete="email"
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-error mt-1.5 text-sm"
                role="alert"
                aria-live="assertive"
              >
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="text-text-primary mb-2 block text-sm font-medium"
          >
            About your project
          </label>
          <Textarea
            id="message"
            placeholder="What are you building, and where are you stuck?"
            rows={6}
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "message-error" : "message-hint"}
            {...register("message")}
            className={`${fieldClass} h-auto min-h-40 py-3`}
          />
          {errors.message ? (
            <p
              id="message-error"
              className="text-error mt-1.5 text-sm"
              role="alert"
              aria-live="assertive"
            >
              {errors.message.message}
            </p>
          ) : (
            <p id="message-hint" className="text-text-muted mt-1.5 text-sm">
              A few lines is enough. Goals, rough timeline and budget help if
              you have them.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-muted text-sm sm:max-w-xs">
            Your message goes straight to our inbox. We reply by email with
            questions or a next step.
          </p>
          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="w-full sm:w-auto"
            aria-live="polite"
            aria-busy={loading}
          >
            {loading ? "Sending…" : "Send message"}
          </Button>
        </div>

        <div
          id="form-error"
          role="alert"
          aria-live="assertive"
          className="sr-only"
        ></div>
      </form>

      <aside
        aria-labelledby="contact-details-title"
        className="lg:col-span-4 lg:col-start-9"
      >
        <h3
          id="contact-details-title"
          className="font-display text-text-primary text-xl font-semibold"
        >
          Other ways to reach us
        </h3>
        <address className="mt-6 not-italic">
          <dl className="divide-border-subtle border-border-subtle divide-y border-y">
            <div className="py-4">
              <dt className="text-text-muted text-sm">Email</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-text-primary decoration-border-strong hover:text-accent-hover hover:decoration-accent-primary underline underline-offset-4 transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-text-muted text-sm">Working hours</dt>
              <dd className="text-text-primary mt-1">
                Mon–Fri, 9:00 AM – 6:00 PM
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-text-muted text-sm">Company</dt>
              <dd className="text-text-primary mt-1">{COMPANY_LEGAL_NAME}</dd>
            </div>
          </dl>
        </address>
      </aside>
    </div>
  );
}
