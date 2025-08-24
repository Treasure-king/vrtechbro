"use client";

import { motion } from "motion/react";
import { Briefcase, Send } from "lucide-react";
import CareerForm from "@/components/CareerForm";
import { useState } from "react";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    location: "Remote / India",
    type: "Full-time",
    description:
      "We are looking for a skilled Frontend Developer with strong experience in React, Next.js, and TailwindCSS. You will work on scalable client projects and deliver beautiful UIs.",
  },
  {
    id: 2,
    title: "Backend Developer",
    location: "Remote / India",
    type: "Full-time",
    description:
      "Seeking a Backend Developer experienced with Node.js, Express, and MongoDB. Knowledge of microservices and APIs is a big plus.",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    location: "Remote / Hybrid",
    type: "Contract",
    description:
      "We are looking for creative UI/UX Designers who can turn requirements into intuitive interfaces. Familiarity with Figma and Tailwind design systems is preferred.",
  },
];

export default function CareersPage() {

  const [selectedJob, setSelectedJob] = useState<null | typeof jobs[0]>(null);

  return (
    <div className="min-h-screen px-6 py-16 lg:px-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Join <span className="text-indigo-600">VrTechBro</span>
        </h1>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Be part of an innovative team shaping the future of IT consultancy. Explore opportunities below and apply today.
        </p>
      </motion.div>

      {/* Job Listings */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col justify-between h-full rounded-2xl overflow-hidden px-4 py-8 border-[1px] border-white*:"
          >
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="text-indigo-600 w-6 h-6" />
              <h2 className="text-xl font-semibold text-white">{job.title}</h2>
            </div>
            <p className="text-sm text-gray-400">
              {job.location} • {job.type}
            </p>
            <p className="mt-3 text-gray-500 text-sm flex-1">{job.description}</p>
            <button
              onClick={() => setSelectedJob(job)}
              className="w-36 mt-5 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
              >
              Apply Now <Send className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
        {selectedJob && (
          <CareerForm job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
    </div>
  );
}
