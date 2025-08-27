"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

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

// Zod Schema for Career Form Validation
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

      // If you want to update the hidden input:
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
    data.resume = formData.get("resume"); // Ensure resume is included as File

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
      // Submit API request
      const response = await fetch("/api/career-apply", {
        method: "POST",
        body: formData, // Sending as FormData for file upload
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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold cursor-pointer"
          aria-label="Close form"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-black">
          Apply for <span className="text-indigo-500">{job.title}</span>
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="position" value={job.title} />
          <input type="hidden" name="jobId" value={job.id} />

          {/* Full Name */}
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            className={`border p-3 rounded-lg ${errors.name ? "border-red-500" : ""}`}
            disabled={loading}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className={`border p-3 rounded-lg ${errors.email ? "border-red-500" : ""}`}
            disabled={loading}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (optional)"
            className={`border p-3 rounded-lg ${errors.phone ? "border-red-500" : ""}`}
            disabled={loading}
          />
          {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}

          {/* Cover Letter */}
          <textarea
            name="coverLetter"
            placeholder="Why should we hire you? (Cover Letter)"
            rows={4}
            maxLength={1000} // 👈 set your desired max length here
            className={`border p-3 rounded-lg resize-none overflow-auto ${errors.coverLetter ? "border-red-500" : ""}`}
            disabled={loading}
          />

          {errors.coverLetter && (
            <p className="text-red-600 text-sm">{errors.coverLetter}</p>
          )}

          {/* Resume Upload */}
          <label
            htmlFor="resume"
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${dragActive
                ? "bg-blue-50 border-blue-500"
                : errors?.resume
                  ? "border-red-500"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {fileName ? (
              <p className="text-gray-700 font-medium">
                ✅ {fileName} <br />
                <span className="text-sm text-gray-400">Click to replace</span>
              </p>
            ) : (
              <p className="text-gray-600">
                📂 Upload Resume (PDF/DOC) <br />
                <span className="text-sm text-gray-400">
                  (Drag & drop or click to select)
                </span>
              </p>
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
          {errors.resume && <p className="text-red-600 text-sm">{errors.resume}</p>}

          {/* Terms */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn rounded-full px-2 py-4 text-white mt-2"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
