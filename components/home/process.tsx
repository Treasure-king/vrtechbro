"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { cn } from "@/lib/utils";

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

/* --------------------------- Step illustrations --------------------------- */

/** Each illustration is a list of stroke paths drawn in with pathLength when it enters view. */
const ILLUSTRATIONS: string[][] = [
  // Discover: magnifier over a document
  [
    "M30 18 H78 L94 34 V102 H30 Z",
    "M78 18 V34 H94",
    "M42 50 H80 M42 62 H72 M42 74 H64",
    "M88 96 m-16 0 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0",
    "M100 108 L114 122",
  ],
  // Design: wireframe frames
  [
    "M18 22 H102 V98 H18 Z",
    "M18 38 H102",
    "M30 50 H62 V86 H30 Z",
    "M72 50 H92 M72 62 H92 M72 74 H84",
    "M110 40 H126 V112 H54 V106",
  ],
  // Build: code brackets and a gear
  [
    "M36 38 L18 60 L36 82",
    "M84 38 L102 60 L84 82",
    "M68 32 L52 88",
    "M108 96 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0",
    "M108 78 V84 M108 108 V114 M90 96 H96 M120 96 H126 M95 83 L99 87 M117 105 L121 109 M95 109 L99 105 M117 87 L121 83",
  ],
  // Launch: rocket leaving a baseline
  [
    "M14 112 H126",
    "M70 20 C88 34 92 60 84 84 H56 C48 60 52 34 70 20 Z",
    "M70 46 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0",
    "M56 72 L44 88 H56 M84 72 L96 88 H84",
    "M62 92 L58 104 M70 92 V108 M78 92 L82 104",
  ],
];

function StepArt({ index, reduce }: { index: number; reduce: boolean | null }) {
  return (
    <svg
      viewBox="0 0 140 130"
      fill="none"
      aria-hidden="true"
      className="h-28 w-32 md:h-32 md:w-36"
    >
      {ILLUSTRATIONS[index].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={
            i === 0 ? "var(--brand-signal)" : "var(--brand-text-secondary)"
          }
          strokeWidth={i === 0 ? 2 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.9,
            delay: 0.1 + i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </svg>
  );
}

/* -------------------------------- Timeline -------------------------------- */

/**
 * The four-step process as a scroll-driven timeline. A line fills with the signal colour
 * as the section scrolls past, lighting each step's node in turn. Numbered because it is a real sequence.
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 70%"],
  });
  const [reached, setReached] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // A step lights once the fill passes its node (nodes sit near the top of each row)
    const next = STEPS.reduce(
      (acc, _, i) => (p >= (i + 0.15) / STEPS.length ? i : acc),
      -1,
    );
    if (next !== reached) setReached(next);
  });

  const lit = (i: number) => reduce || i <= reached;

  return (
    <div ref={ref} className="relative">
      {/* Track and fill: left on mobile, centred on desktop */}
      <div
        aria-hidden="true"
        className="bg-border-subtle absolute top-2 bottom-2 left-4 w-px md:left-1/2 md:-translate-x-1/2"
      >
        <motion.div
          className="bg-signal absolute inset-0 origin-top"
          style={{ scaleY: reduce ? 1 : scrollYProgress }}
        />
      </div>

      <ol className="space-y-16 md:space-y-24">
        {STEPS.map((step, i) => {
          const contentLeft = i % 2 === 0;

          return (
            <li
              key={step.title}
              className="relative grid pl-12 md:grid-cols-2 md:gap-24 md:pl-0"
            >
              {/* Node */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1 left-4 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-colors duration-500 md:left-1/2",
                  lit(i)
                    ? "border-signal bg-bg-primary"
                    : "border-border-strong bg-bg-primary",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-transform duration-500",
                    lit(i) ? "bg-signal scale-100" : "bg-border-strong scale-0",
                  )}
                />
              </span>

              {/* Text */}
              <div
                className={cn(
                  contentLeft
                    ? "md:col-start-1 md:text-right"
                    : "md:col-start-2",
                  "md:row-start-1",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-sm transition-colors duration-500",
                    lit(i) ? "text-signal" : "text-text-muted",
                  )}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-text-primary mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p
                  className={cn(
                    "text-text-secondary mt-3 max-w-md leading-relaxed",
                    contentLeft && "md:ml-auto",
                  )}
                >
                  {step.body}
                </p>
              </div>

              {/* Illustration, on the opposite side on desktop */}
              <div
                className={cn(
                  "mt-6 md:row-start-1 md:mt-0 md:flex md:items-start",
                  contentLeft
                    ? "md:col-start-2 md:justify-start"
                    : "md:col-start-1 md:justify-end",
                )}
              >
                <StepArt index={i} reduce={reduce} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
