'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'motion/react';
import { Briefcase, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CareerForm = dynamic(() => import('@/components/career-form'), {
  loading: () => null,
});

interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  description: string;
}

export default function CareersClient({ jobs }: { jobs: Job[] }) {
  const [selectedJob, setSelectedJob] = useState<null | Job>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={shouldReduceMotion ? false : { opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        className="text-center mb-16"
        aria-label="Career opportunities introduction"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary">
          Join <span className="text-gradient">VRTechBro</span>
        </h1>
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
          Be part of an innovative team shaping the future of IT consultancy. Explore opportunities below and apply today.
        </p>
      </motion.section>

      {/* Job Listings */}
      <section aria-label="Job listings" role="list" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {jobs.map((job, index) => (
          <motion.article
            key={job.id}
            role="listitem"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: shouldReduceMotion ? 0 : index * 0.15, duration: shouldReduceMotion ? 0 : 0.35 }}
            className="flex flex-col justify-between h-full rounded-2xl overflow-hidden p-6 bg-bg-secondary border border-border-subtle transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-xl hover:shadow-accent-primary/5"
            tabIndex={0}
            aria-labelledby={`job-title-${job.id}`}
            aria-describedby={`job-desc-${job.id}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-accent-primary/10 text-accent-primary">
                  <Briefcase className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2 id={`job-title-${job.id}`} className="text-xl font-display font-semibold text-text-primary">
                  {job.title}
                </h2>
              </div>
              <p className="text-sm font-medium text-accent-primary mb-3">
                {job.location} • {job.type}
              </p>
              <p id={`job-desc-${job.id}`} className="text-text-secondary text-sm leading-relaxed">
                {job.description}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-subtle">
              <Button
                aria-label={`Apply for ${job.title} position`}
                onClick={() => setSelectedJob(job)}
                className="w-full"
              >
                Apply Now <Send className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </motion.article>
        ))}
      </section>

      {/* Career Application Form Modal */}
      {selectedJob && <CareerForm job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </>
  );
}

