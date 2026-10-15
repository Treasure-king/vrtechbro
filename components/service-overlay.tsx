"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ServiceOverlayProps {
  serviceId: string;
  serviceTitle: string;
}

const enquirySchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.string().email("Invalid email address"),
  clientPhone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[0-9\s\-()]{7,}$/.test(val), {
      message: "Invalid phone number",
    }),
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  projectDetails: z.string().min(10, "Project details must be at least 10 characters"),
  budgetMin: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Min budget must be a positive number",
    }),
  budgetMax: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Max budget must be a positive number",
    }),
  timeDuration: z.enum([
    "less_than_1_month",
    "1_to_3_months",
    "3_to_6_months",
    "6_to_12_months",
    "more_than_1_year",
  ]),
  preferredContact: z.enum(["email", "phone", "either"]).optional(),
  agreeTerms: z.preprocess(
    (val) => val === "on",
    z.boolean().refine(val => val === true, {
      message: "You must agree to the privacy policy and terms",
    })
  )
  ,
  serviceTitle: z.string(),
  serviceId: z.string(),
});

export default function ServiceOverlay({ serviceId, serviceTitle }: ServiceOverlayProps) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const result = enquirySchema.safeParse(data);

    if (!result.success) {
      const formErrors: Record<string, string> = {};
      result.error.issues.forEach(({ path, message }) => {
        const key = path[0];
        if (typeof key === "string" || typeof key === "number") {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const resData = await response.json();


      if (response.ok) {
        toast.success('Message sent successfully!')

      } else {
        toast.error('Something went wrong. Please try again.',resData.error)
      }
      setOpen(false);
    } catch{
      alert("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = `w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 disabled:opacity-50`;
  const errorInputStyles = `border-error focus:border-error focus:ring-error/20`;

  return (
    <>
      {/* Trigger Button */}
      <Button onClick={() => setOpen(true)}>
        Get {serviceTitle}
      </Button>

      {/* Overlay */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-bg-secondary border border-border-subtle rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors rounded-lg p-1.5 hover:bg-bg-tertiary cursor-pointer"
              aria-label="Close enquiry form"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-display font-bold mb-6 text-text-primary">
              Enquire about <span className="text-gradient">{serviceTitle}</span>
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <input type="hidden" name="serviceTitle" value={serviceTitle} />
              <input type="hidden" name="serviceId" value={serviceId} />

              {/* Client Name */}
              <input
                type="text"
                name="clientName"
                placeholder="Your Full Name"
                className={`${inputStyles} ${errors.clientName ? errorInputStyles : ""}`}
                disabled={loading}
              />
              {errors.clientName && (
                <p className="text-error text-xs -mt-2">{errors.clientName}</p>
              )}

              {/* Client Email */}
              <input
                type="email"
                name="clientEmail"
                placeholder="Your Email"
                className={`${inputStyles} ${errors.clientEmail ? errorInputStyles : ""}`}
                disabled={loading}
              />
              {errors.clientEmail && (
                <p className="text-error text-xs -mt-2">{errors.clientEmail}</p>
              )}

              {/* Client Phone */}
              <input
                type="tel"
                name="clientPhone"
                placeholder="Phone Number (optional)"
                className={`${inputStyles} ${errors.clientPhone ? errorInputStyles : ""}`}
                disabled={loading}
              />
              {errors.clientPhone && (
                <p className="text-error text-xs -mt-2">{errors.clientPhone}</p>
              )}

              {/* Project Name */}
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                className={`${inputStyles} ${errors.projectName ? errorInputStyles : ""}`}
                disabled={loading}
              />
              {errors.projectName && (
                <p className="text-error text-xs -mt-2">{errors.projectName}</p>
              )}

              {/* Project Details */}
              <textarea
                name="projectDetails"
                placeholder="Project Details / Requirements"
                rows={4}
                className={`${inputStyles} resize-none ${errors.projectDetails ? errorInputStyles : ""}`}
                disabled={loading}
              />
              {errors.projectDetails && (
                <p className="text-error text-xs -mt-2">{errors.projectDetails}</p>
              )}

              {/* Budget Range */}
              <div className="flex gap-3">
                <input
                  type="number"
                  name="budgetMin"
                  placeholder="Min Budget ($)"
                  min={0}
                  className={`${inputStyles} w-1/2 ${errors.budgetMin ? errorInputStyles : ""}`}
                  disabled={loading}
                />
                <input
                  type="number"
                  name="budgetMax"
                  placeholder="Max Budget ($)"
                  min={0}
                  className={`${inputStyles} w-1/2 ${errors.budgetMax ? errorInputStyles : ""}`}
                  disabled={loading}
                />
              </div>
              {(errors.budgetMin || errors.budgetMax) && (
                <p className="text-error text-xs -mt-2">
                  {errors.budgetMin || errors.budgetMax}
                </p>
              )}

              {/* Time Duration */}
              <select
                name="timeDuration"
                className={`${inputStyles} ${errors.timeDuration ? errorInputStyles : ""}`}
                defaultValue=""
                disabled={loading}
              >
                <option value="" disabled>
                  Estimated Project Duration
                </option>
                <option value="less_than_1_month">Less than 1 month</option>
                <option value="1_to_3_months">1 to 3 months</option>
                <option value="3_to_6_months">3 to 6 months</option>
                <option value="6_to_12_months">6 to 12 months</option>
                <option value="more_than_1_year">More than 1 year</option>
              </select>
              {errors.timeDuration && (
                <p className="text-error text-xs -mt-2">{errors.timeDuration}</p>
              )}

              {/* Preferred Contact Method */}
              <select
                name="preferredContact"
                className={inputStyles}
                defaultValue=""
                disabled={loading}
              >
                <option value="" disabled>
                  Preferred Contact Method (optional)
                </option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="either">Either</option>
              </select>

              {/* Terms & Privacy */}
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

              <Button type="submit" isLoading={loading} className="w-full mt-2">
                {loading ? "Submitting..." : "Submit Enquiry"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
