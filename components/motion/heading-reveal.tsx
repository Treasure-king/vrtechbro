"use client";

import { useInViewOnce } from "@/components/motion/use-in-view-once";

/**
 * Section title that slides up out of a mask the first time it scrolls into
 * view, with its intro fading in just after. Used by SectionHeading.
 * CSS transitions only (see `.reveal-mask` in globals.css).
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
  const [ref, inView] = useInViewOnce<HTMLDivElement>();

  return (
    <div ref={ref} data-shown={inView || undefined} className="max-w-2xl">
      <h2 id={id} className="type-heading text-text-primary">
        <span className="reveal-mask block overflow-hidden pb-[0.12em]">
          <span className="block">{title}</span>
        </span>
      </h2>
      {intro && (
        <p
          className="reveal text-text-secondary mt-4 text-lg leading-relaxed"
          style={{ "--reveal-delay": "0.15s" } as React.CSSProperties}
          data-shown={inView || undefined}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
