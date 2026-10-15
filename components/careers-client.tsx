'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/section-heading';
import { CONTACT_EMAIL } from '@/lib/constants';

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

  return (
    <>
      <section id="roles" aria-labelledby="roles-title" className="scroll-mt-24 py-24 md:py-32">
        <div className="container-page grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionHeading
              id="roles-title"
              title="Open roles"
              intro={`${jobs.length} ${jobs.length === 1 ? 'position' : 'positions'} open right now.`}
            />

            <ul className="border-t border-border-subtle">
              {jobs.map((job) => (
                <li key={job.id} className="border-b border-border-subtle py-8">
                  <article
                    aria-labelledby={`job-title-${job.id}`}
                    className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start md:gap-10"
                  >
                    <div>
                      <h3
                        id={`job-title-${job.id}`}
                        className="font-display text-2xl font-semibold tracking-tight text-text-primary"
                      >
                        {job.title}
                      </h3>
                      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <div className="flex gap-1.5">
                          <dt className="text-text-muted">Location</dt>
                          <dd className="text-text-secondary">{job.location}</dd>
                        </div>
                        <div className="flex gap-1.5">
                          <dt className="text-text-muted">Type</dt>
                          <dd className="text-text-secondary">{job.type}</dd>
                        </div>
                      </dl>
                      <p className="mt-4 max-w-2xl leading-relaxed text-text-secondary">{job.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedJob(job)}
                      aria-label={`Apply for the ${job.title} role`}
                      className="w-full md:w-auto"
                    >
                      Apply
                    </Button>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          {/* How to apply: describes exactly what the form asks for */}
          <aside aria-labelledby="applying-title" className="lg:col-span-4 lg:pt-2">
            <div className="rounded-2xl border border-border-subtle bg-bg-secondary/50 p-6 md:p-8 lg:sticky lg:top-28">
              <h2 id="applying-title" className="font-display text-xl font-semibold tracking-tight text-text-primary">
                What to send
              </h2>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary">
                <li>
                  <span className="text-text-primary">Your resume</span> as a PDF or Word document, up to 5 MB.
                </li>
                <li>
                  <span className="text-text-primary">A short cover letter</span> about the work you&apos;re proudest
                  of and why this role fits.
                </li>
                <li>
                  <span className="text-text-primary">Links</span> to a portfolio, GitHub or live projects help a lot.
                  Add them to your cover letter.
                </li>
              </ul>
              <div className="mt-8 border-t border-border-subtle pt-6">
                <h3 className="font-medium text-text-primary">Don&apos;t see your role?</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Email{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Open%20application`}
                    className="text-accent-primary underline-offset-4 hover:text-accent-hover hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>{' '}
                  with your resume and what you&apos;d like to work on.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Application form: slide-out sheet */}
      {selectedJob && <CareerForm job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </>
  );
}
