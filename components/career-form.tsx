"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { X, Upload, FileCheck } from "lucide-react";

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
  coverLetter: z.string().min(20, "Cover letter must be at least 20 characters"),
  resume: z
    .any()
    .refine((file) => file instanceof File, "Resume is required"),
  position: z.string(),
  jobId: z.string(),
  agreeTerms: z.preprocess(
    (val) => val === "on",
    z.boolean().refine((val) => val === true, {
      message: "You must agree to the privacy policy and terms",
    })
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
    const data: Record<string, unknown> = Object.fromEntries(formData.entries());
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

  return (
    <motion.div
      className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-bg-secondary border border-border-subtle rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors rounded-lg p-1.5 hover:bg-bg-tertiary cursor-pointer"
          aria-label="Close form"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-display font-bold mb-6 text-text-primary">
          Apply for <span className="text-gradient">{job.title}</span>
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="position" value={job.title} />
          <input type="hidden" name="jobId" value={job.id} />

          {/* Full Name */}
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            className={`${inputStyles} ${errors.name ? errorInputStyles : ""}`}
            disabled={loading}
          />
          {errors.name && <p className="text-error text-xs -mt-2">{errors.name}</p>}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className={`${inputStyles} ${errors.email ? errorInputStyles : ""}`}
            disabled={loading}
          />
          {errors.email && <p className="text-error text-xs -mt-2">{errors.email}</p>}

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (optional)"
            className={`${inputStyles} ${errors.phone ? errorInputStyles : ""}`}
            disabled={loading}
          />
          {errors.phone && <p className="text-error text-xs -mt-2">{errors.phone}</p>}

          {/* Cover Letter */}
          <textarea
            name="coverLetter"
            placeholder="Why should we hire you? (Cover Letter)"
            rows={4}
            maxLength={1000}
            className={`${inputStyles} resize-none ${errors.coverLetter ? errorInputStyles : ""}`}
            disabled={loading}
          />
          {errors.coverLetter && (
            <p className="text-error text-xs -mt-2">{errors.coverLetter}</p>
          )}

          {/* Resume Upload */}
          <label
            htmlFor="resume"
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
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
              <div className="flex flex-col items-center gap-2">
                <FileCheck className="h-8 w-8 text-success" />
                <p className="text-text-primary text-sm font-medium">{fileName}</p>
                <span className="text-xs text-text-muted">Click to replace</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-text-muted" />
                <p className="text-text-secondary text-sm">
                  Upload Resume (PDF/DOC)
                </p>
                <span className="text-xs text-text-muted">
                  Drag & drop or click to select
                </span>
              </div>
            )}

            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              disabled={loading}
              onChange={handleFileChange}
            />
          </label>
          {errors.resume && <p className="text-error text-xs -mt-2">{errors.resume}</p>}

          {/* Terms */}
          <label className="flex items-start gap-2.5 text-sm text-text-secondary">
            <input
              type="checkbox"
              name="agreeTerms"
              className={`mt-0.5 w-4 h-4 rounded border-border-subtle accent-accent-primary ${errors.agreeTerms ? "border-error" : ""}`}
              disabled={loading}
            />
            <span>
              I agree to the{" "}
              <a
                href="/privacy-policy"
                className="text-accent-primary hover:text-accent-hover underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>{" "}
              and terms.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-error text-xs -mt-2">{errors.agreeTerms}</p>
          )}

          {/* Submit */}
          <Button type="submit" isLoading={loading} className="w-full mt-2">
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
