"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";

type ParallaxProps = HTMLMotionProps<"div"> & {
  /**
   * How far the layer drifts while its section crosses the viewport, in px.
   * Positive moves slower than the page (background feel), negative moves faster (foreground).
   */
  offset?: number;
};

/** Scroll-linked vertical drift for a layer. Static when reduced motion is on. */
export function Parallax({
  offset = 80,
  style,
  children,
  ...props
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <motion.div ref={ref} style={{ ...style, y: reduce ? 0 : y }} {...props}>
      {children}
    </motion.div>
  );
}
