"use client";

import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/components/motion/use-in-view-once";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

/** Fades content up once when it scrolls into view (CSS transition, no animation library). */
export function Reveal({ delay = 0, className, style, children, ...props }: RevealProps) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-shown={inView || undefined}
      className={cn("reveal", className)}
      style={{ ...style, "--reveal-delay": `${delay}s` } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}
