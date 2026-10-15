"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Spotlight } from "@/components/motion/spotlight";
import {
  ChatDemo,
  DashboardDemo,
  ExtensionDemo,
  PhoneDemo,
  ScoreDemo,
  TerminalDemo,
} from "@/components/home/capabilities/demos";

const PANELS = [
  {
    title: "Websites",
    body: "Marketing and content sites built to load fast, rank well and be easy for your team to update.",
    tools: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    Demo: ScoreDemo,
  },
  {
    title: "Web apps and SaaS",
    body: "Dashboards, portals and subscription products with accounts, roles, data and payments wired in properly.",
    tools: ["Next.js", "Supabase", "PostgreSQL", "Node.js"],
    Demo: DashboardDemo,
  },
  {
    title: "Mobile apps",
    body: "Cross-platform apps for iOS and Android from one codebase, with offline support and push notifications where you need them.",
    tools: ["React Native", "Firebase", "Supabase"],
    Demo: PhoneDemo,
  },
  {
    title: "Chrome extensions",
    body: "Browser tools that sit where your users already work, built on Manifest V3 and ready for the Chrome Web Store.",
    tools: ["TypeScript", "Manifest V3", "Chrome APIs"],
    Demo: ExtensionDemo,
  },
  {
    title: "npm packages",
    body: "Reusable libraries with typed APIs, tests and versioned releases, so other developers can install them in one line.",
    tools: ["TypeScript", "Node.js", "npm"],
    Demo: TerminalDemo,
  },
  {
    title: "AI features",
    body: "Practical AI inside your product: summaries, search over your own documents, and assistants that know your data.",
    tools: ["Python", "LLM APIs", "Vector search", "Next.js"],
    Demo: ChatDemo,
  },
];

/** Pinning only happens on md+ screens without reduced motion; CSS mirrors this with md:motion-safe:. */
function usePinned() {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return wide && !reduce;
}

/** Six kinds of work, scrolled sideways while the section stays pinned. */
export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinned = usePinned();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // How far the track must travel so its last panel ends at the right edge
  const distance = useMotionValue(0);
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !frameRef.current) return;
      distance.set(
        Math.max(
          0,
          trackRef.current.scrollWidth - frameRef.current.clientWidth,
        ),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (frameRef.current) observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [distance, pinned]);

  const x = useTransform(() => -scrollYProgress.get() * distance.get());

  return (
    <section
      ref={sectionRef}
      aria-labelledby="capabilities-title"
      className="border-border-subtle relative border-b py-24 md:motion-safe:h-[500vh] md:motion-safe:py-0"
    >
      <div
        ref={frameRef}
        className="md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:pt-16 md:motion-safe:flex md:motion-safe:h-screen md:motion-safe:flex-col md:motion-safe:justify-center md:motion-safe:overflow-hidden"
      >
        <div className="container-page mb-10 md:motion-safe:mb-8">
          <h2
            id="capabilities-title"
            className="type-heading text-text-primary max-w-2xl"
          >
            Six kinds of product, one team
          </h2>
          <p className="text-text-secondary mt-4 max-w-2xl text-lg leading-relaxed">
            The same people design, build and maintain each of these, so nothing
            gets lost between specialists.
          </p>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x: pinned ? x : 0 }}
          className="flex flex-col gap-6 px-4 sm:px-6 md:motion-safe:w-max md:motion-safe:flex-row lg:px-10 lg:motion-safe:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]"
        >
          {PANELS.map(({ title, body, tools, Demo }) => (
            <Spotlight
              key={title}
              className="border-border-subtle bg-bg-secondary rounded-2xl border md:motion-safe:w-[min(85vw,960px)] md:motion-safe:shrink-0"
            >
              <article className="grid h-full gap-8 p-6 md:grid-cols-2 md:p-10 md:motion-safe:min-h-[min(60vh,520px)]">
                <div className="flex flex-col">
                  <h3 className="type-heading text-text-primary">{title}</h3>
                  <p className="text-text-secondary mt-4 text-lg leading-relaxed">
                    {body}
                  </p>
                  <ul
                    className="mt-auto flex flex-wrap gap-2 pt-8"
                    aria-label={`Tools for ${title.toLowerCase()}`}
                  >
                    {tools.map((tool) => (
                      <li
                        key={tool}
                        className="border-border-strong text-text-secondary rounded-full border px-3 py-1 text-sm"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="min-h-64">
                  <Demo />
                </div>
              </article>
            </Spotlight>
          ))}
        </motion.div>

        {/* Horizontal progress, only while pinned */}
        <div
          className="container-page mt-8 hidden md:motion-safe:block"
          aria-hidden="true"
        >
          <div className="bg-border-subtle h-px w-full overflow-hidden">
            <motion.div
              className="bg-signal h-px origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
