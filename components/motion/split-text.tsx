"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type SplitTextProps = {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  id?: string;
};

/** Reveals a line of text word by word on mount. Screen readers get the full sentence. */
export function SplitText({
  text,
  as = "h1",
  className,
  delay = 0,
  stagger = 0.06,
  id,
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(" ");

  return (
    <Tag id={id} className={cn(className)} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
