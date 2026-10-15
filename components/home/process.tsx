import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    title: "Discover",
    body: "A call to understand your business, your users and what success looks like. You get a written scope and estimate.",
  },
  {
    title: "Design",
    body: "Wireframes, then polished screens you can click through. Nothing gets built until you have seen it.",
  },
  {
    title: "Build",
    body: "Development in short cycles with a live preview link, so you can follow progress and give feedback as it happens.",
  },
  {
    title: "Launch",
    body: "Deployment, analytics and a handover of everything you own. Support continues after go-live.",
  },
];

/** The four-step process. Numbered because it is a real sequence. */
export function Process() {
  return (
    <ol className="border-border-subtle bg-border-subtle grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, i) => (
        <li key={step.title} className="bg-bg-primary">
          <Reveal delay={i * 0.08} className="flex h-full flex-col p-6 md:p-8">
            <span
              className="text-accent-primary font-mono text-sm"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-text-primary mt-10 text-2xl font-semibold tracking-tight">
              <span className="sr-only">Step {i + 1}: </span>
              {step.title}
            </h3>
            <p className="text-text-secondary mt-3 leading-relaxed">
              {step.body}
            </p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
