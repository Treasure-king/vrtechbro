"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

const STATEMENT =
  "Most software is assembled from templates and handed over. We build ours from the ground up, keep it fast, keep it secure, and stay around after launch.";

/** The one phrase lit in the logo's signal colour instead of white. */
const SIGNAL_PHRASE = "from the ground up,";

const WORDS = (() => {
  const signalWords = SIGNAL_PHRASE.split(" ");
  const words = STATEMENT.split(" ");
  const start = words.findIndex((_, i) =>
    signalWords.every((w, j) => words[i + j] === w),
  );
  return words.map((text, i) => ({
    text,
    signal: start !== -1 && i >= start && i < start + signalWords.length,
  }));
})();

function Word({
  text,
  signal,
  progress,
  range,
  reduce,
}: {
  text: string;
  signal: boolean;
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);

  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity: reduce ? 1 : opacity }}
      className={cn(
        "inline-block",
        signal ? "text-signal" : "text-text-primary",
      )}
    >
      {text}
    </motion.span>
  );
}

/** A single statement whose words light up one by one as the reader scrolls through it. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Spread the reveal over the middle of the pinned scroll so it starts and ends at rest
  const from = 0.1;
  const to = 0.85;
  const step = (to - from) / WORDS.length;

  return (
    <section
      ref={ref}
      aria-label="What we stand for"
      className="border-border-subtle relative border-b motion-safe:h-[180vh]"
    >
      <div className="flex items-center py-24 motion-safe:sticky motion-safe:top-0 motion-safe:h-screen motion-safe:py-0">
        <div className="container-page">
          <p className="sr-only">{STATEMENT}</p>
          <p className="type-mega max-w-6xl">
            {WORDS.map((word, i) => (
              <span key={i}>
                <Word
                  text={word.text}
                  signal={word.signal}
                  progress={scrollYProgress}
                  range={[from + i * step, from + (i + 1) * step]}
                  reduce={reduce}
                />
                {i < WORDS.length - 1 && " "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
