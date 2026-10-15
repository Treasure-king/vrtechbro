"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Re-mounts on every navigation, so each page fades and lifts in.
 * Enter-only (no exit), and it animates transform/opacity only, so Next's
 * scroll-to-top and anchor links behave exactly as before.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
