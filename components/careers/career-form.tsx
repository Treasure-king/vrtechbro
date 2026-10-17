"use client";

import { Honeypot } from "@/components/shared/honeypot";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CareerFormProps {
  job: {
    id: number;
    title: string;
    location: string;
    type: string;
    description: string;
  };
  onClose: () => void;
}

const careerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[0-9\s\-()]{7,}$/.test(val), {
      message: "Invalid phone number",
    }),
  coverLetter: z
    .string()
    .min(20, "Cover letter must be at least 20 characters"),
  resume: z.any().refine((file) => file instanceof File, "Resume is required"),
  position: z.string(),
  jobId: z.string(),
  agreeTerms: z.preprocess(
    (val) => val === "on",
    z.boolean().refine((val) => val === true, {
      message: "You must agree to the privacy policy and terms",
    }),
  ),
});

export default function CareerForm({ job, onClose }: CareerFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const inputStyles = `w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 disabled:opacity-50`;
  const errorInputStyles = `border-error focus:border-error focus:ring-error/20`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);

      const input = document.getElementById("resume") as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(e.dataTransfer.files[0]);
      input.files = dataTransfer.files;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );
    data.resume = formData.get("resume");

    const result = careerSchema.safeParse(data);

    if (!result.success) {
      const formErrors: Record<string, string> = {};
      result.error.issues.forEach(({ path, message }) => {
        const key = path[0];
        if (typeof key === "string") formErrors[key] = message;
      });
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/career-apply", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Application submitted successfully!");
        onClose();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Failed to submit the application.");
    } finally {
      setLoading(false);
    }
  };

  const labelStyles = "block text-sm font-medium text-text-secondary mb-1.5";
  const errorText = (key: string) =>
    errors[key] ? (
      <p id={`${key}-error`} className="text-error mt-1.5 text-xs">
        {errors[key]}
      </p>
    ) : null;

  return (
    <Sheet open onOpenChange={(open) => !open && !loading && onClose()}>
      <SheetContent
        side="right"
        className="border-border-subtle bg-bg-secondary w-full gap-0 overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader className="border-border-subtle border-b px-6 pt-8 pb-6">
          <SheetTitle className="font-display text-text-primary text-2xl font-semibold tracking-tight">
            Apply for {job.title}
          </SheetTitle>
          <SheetDescription className="text-text-secondary">
            {job.location}, {job.type.toLowerCase()}. All fields are required
            unless marked optional.
          </SheetDescription>
        </SheetHeader>

        <form
          className="relative flex flex-col gap-5 px-6 py-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <Honeypot />
          <input type="hidden" name="position" value={job.title} />
          <input type="hidden" name="jobId" value={job.id} />

          <div>
            <label htmlFor="career-name" className={labelStyles}>
              Full name
            </label>
            <input
              id="career-name"
              type="text"
              name="name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`${inputStyles} ${errors.name ? errorInputStyles : ""}`}
              disabled={loading}
            />
            {errorText("name")}
          </div>

          <div>
            <label htmlFor="career-email" className={labelStyles}>
              Email
            </label>
            <input
              id="career-email"
              type="email"
              name="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`${inputStyles} ${errors.email ? errorInputStyles : ""}`}
              disabled={loading}
            />
            {errorText("email")}
          </div>

          <div>
            <label htmlFor="career-phone" className={labelStyles}>
              Phone{" "}
              <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <input
              id="career-phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`${inputStyles} ${errors.phone ? errorInputStyles : ""}`}
              disabled={loading}
            />
            {errorText("phone")}
          </div>

          <div>
            <label htmlFor="career-cover" className={labelStyles}>
              Cover letter
            </label>
            <textarea
              id="career-cover"
              name="coverLetter"
              rows={5}
              maxLength={1000}
              placeholder="The work you're proudest of, why this role, and links to your portfolio or GitHub."
              aria-invalid={!!errors.coverLetter}
              aria-describedby={
                errors.coverLetter ? "coverLetter-error" : undefined
              }
              className={`${inputStyles} resize-none ${errors.coverLetter ? errorInputStyles : ""}`}
              disabled={loading}
            />
            {errorText("coverLetter")}
          </div>

          <div>
            <span className={labelStyles} id="resume-label">
              Resume
            </span>
            <label
              htmlFor="resume"
              className={`focus-within:border-accent-primary block cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors duration-200 ${
                dragActive
                  ? "bg-accent-primary/10 border-accent-primary"
                  : errors?.resume
                    ? "border-error"
                    : "border-border-subtle hover:border-border-strong hover:bg-bg-tertiary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {fileName ? (
                <span className="flex flex-col items-center gap-2">
                  <FileCheck
                    className="text-success h-7 w-7"
                    aria-hidden="true"
                  />
                  <span className="text-text-primary text-sm font-medium break-all">
                    {fileName}
                  </span>
                  <span className="text-text-muted text-xs">
                    Choose a different file
                  </span>
                </span>
              ) : (
                <span className="flex flex-col items-center gap-2">
                  <Upload
                    className="text-text-muted h-7 w-7"
                    aria-hidden="true"
                  />
                  <span className="text-text-secondary text-sm">
                    Drop your resume here or choose a file
                  </span>
                  <span className="text-text-muted text-xs">
                    PDF, DOC or DOCX, up to 5 MB
                  </span>
                </span>
              )}

              <input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                aria-labelledby="resume-label"
                aria-describedby={errors.resume ? "resume-error" : undefined}
                disabled={loading}
                onChange={handleFileChange}
              />
            </label>
            {errorText("resume")}
          </div>

          <div>
            <label className="text-text-secondary flex items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                name="agreeTerms"
                aria-invalid={!!errors.agreeTerms}
                aria-describedby={
                  errors.agreeTerms ? "agreeTerms-error" : undefined
                }
                className="border-border-subtle accent-accent-primary mt-0.5 h-4 w-4 rounded"
                disabled={loading}
              />
              <span>
                I agree to the{" "}
                <a
                  href="/privacy-policy"
                  className="text-accent-primary hover:text-accent-hover underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  privacy policy
                </a>{" "}
                and{" "}
                <a
                  href="/terms"
                  className="text-accent-primary hover:text-accent-hover underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms
                </a>
                .
              </span>
            </label>
            {errorText("agreeTerms")}
          </div>

          <Button
            type="submit"
            isLoading={loading}
            size="lg"
            className="mt-2 w-full"
          >
            {loading ? "Sending application…" : "Send application"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
