"use client";

import { useEffect } from "react";
import "lenis/dist/lenis.css";

/**
 * Lenis smooth scrolling, loaded after the page is idle so it never delays the
 * first paint. Disabled for reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let frame = 0;
    let destroy = () => {};

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.14, anchors: true });
      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
      destroy = () => lenis.destroy();
    };

    const hasIdle = "requestIdleCallback" in window;
    const idle = hasIdle
      ? window.requestIdleCallback(() => void start(), { timeout: 2000 })
      : 0;
    const timer = hasIdle ? undefined : setTimeout(() => void start(), 1200);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      destroy();
    };
  }, []);

  return null;
}
