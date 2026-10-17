"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element has scrolled into view (then stays true).
 * A tiny IntersectionObserver wrapper so reveal effects don't need an
 * animation library; the transitions themselves are CSS (see `.reveal` in globals.css).
 */
export function useInViewOnce<T extends Element>(rootMargin = "0px 0px -60px 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView] as const;
}
