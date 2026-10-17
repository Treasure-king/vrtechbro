"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section title that slides up out of a mask the first time it scrolls into
 * view, with its intro fading in just after. Used by SectionHeading.
 */
export function HeadingReveal({
  id,
  title,
  intro,
}: {
  id: string;
  title: string;
  intro?: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="max-w-2xl"
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      <h2 id={id} className="type-heading text-text-primary">
        <span className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className="block"
            variants={{
              hidden: { y: "105%" },
              show: { y: 0, transition: { duration: 0.75, ease } },
            }}
          >
            {title}
          </motion.span>
        </span>
      </h2>
      {intro && (
        <motion.p
          className="text-text-secondary mt-4 text-lg leading-relaxed"
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 0.15, ease },
            },
          }}
        >
          {intro}
        </motion.p>
      )}
    </motion.div>
  );
}
