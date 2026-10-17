"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

/**
 * A list item that fades up the first time it scrolls into view. Pass its
 * position so neighbouring rows arrive one after another.
 */
export function RevealItem({
  index = 0,
  children,
  ...props
}: HTMLMotionProps<"li"> & { index?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: Math.min(index, 6) * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.li>
  );
}
