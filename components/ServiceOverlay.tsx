"use client";

import { motion} from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface ServiceOverlayProps {
  serviceId: string;
  serviceTitle: string;
}

// Define Zod schema for form validation
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

    // Validate with Zod
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

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 btn rounded-full cursor-pointer"
      >
        Get {serviceTitle}
      </button>

      {/* Overlay */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-black"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-5/6 overflow-y-scroll p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 font-bold hover:text-gray-800 cursor-pointer"
              aria-label="Close enquiry form"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Enquire about <span className="text-primary">{serviceTitle}</span>
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <input type="hidden" name="serviceTitle" value={serviceTitle} />
              <input type="hidden" name="serviceId" value={serviceId} />

              {/* Client Name */}
              <input
                type="text"
                name="clientName"
                placeholder="Your Full Name"
                className={`border p-3 rounded-lg ${errors.clientName ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.clientName && (
                <p className="text-red-600 text-sm">{errors.clientName}</p>
              )}

              {/* Client Email */}
              <input
                type="email"
                name="clientEmail"
                placeholder="Your Email"
                className={`border p-3 rounded-lg ${errors.clientEmail ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.clientEmail && (
                <p className="text-red-600 text-sm">{errors.clientEmail}</p>
              )}

              {/* Client Phone */}
              <input
                type="tel"
                name="clientPhone"
                placeholder="Phone Number (optional)"
                className={`border p-3 rounded-lg ${errors.clientPhone ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.clientPhone && (
                <p className="text-red-600 text-sm">{errors.clientPhone}</p>
              )}

              {/* Project Name */}
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                className={`border p-3 rounded-lg ${errors.projectName ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.projectName && (
                <p className="text-red-600 text-sm">{errors.projectName}</p>
              )}

              {/* Project Details */}
              <textarea
                name="projectDetails"
                placeholder="Project Details / Requirements"
                rows={4}
                className={`border p-3 rounded-lg ${errors.projectDetails ? "border-red-500" : ""}`}
                disabled={loading}
              />
              {errors.projectDetails && (
                <p className="text-red-600 text-sm">{errors.projectDetails}</p>
              )}

              {/* Budget Range */}
              <div className="flex gap-4">
                <input
                  type="number"
                  name="budgetMin"
                  placeholder="Min Budget ($)"
                  min={0}
                  className={`border p-3 rounded-lg w-1/2 ${errors.budgetMin ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                <input
                  type="number"
                  name="budgetMax"
                  placeholder="Max Budget ($)"
                  min={0}
                  className={`border p-3 rounded-lg w-1/2 ${errors.budgetMax ? "border-red-500" : ""}`}
                  disabled={loading}
                />
              </div>
              {(errors.budgetMin || errors.budgetMax) && (
                <p className="text-red-600 text-sm">
                  {errors.budgetMin || errors.budgetMax}
                </p>
              )}

              {/* Time Duration */}
              <select
                name="timeDuration"
                className={`border p-3 rounded-lg ${errors.timeDuration ? "border-red-500" : ""}`}
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
                <p className="text-red-600 text-sm">{errors.timeDuration}</p>
              )}

              {/* Preferred Contact Method */}
              <select
                name="preferredContact"
                className="border p-3 rounded-lg"
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
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  className={`w-4 h-4 ${errors.agreeTerms ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                I agree to the{" "}
                <a
                  href="/privacy-policy"
                  className="text-primary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  privacy policy
                </a>{" "}
                and terms.
              </label>
              {errors.agreeTerms && (
                <p className="text-red-600 text-sm">{errors.agreeTerms}</p>
              )}

              <button type="submit" disabled={loading} className="btn rounded-full px-2 py-4 text-white">
                {loading ? "loading..." : "Submit"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
