"use client";

import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/components/motion/use-in-view-once";

/**
 * A list item that fades up the first time it scrolls into view. Pass its
 * position so neighbouring rows arrive one after another.
 */
export function RevealItem({
  index = 0,
  className,
  style,
  children,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement> & { index?: number }) {
  const [ref, inView] = useInViewOnce<HTMLLIElement>("0px 0px -40px 0px");

  return (
    <li
      ref={ref}
      data-shown={inView || undefined}
      className={cn("reveal", className)}
      style={
        {
          ...style,
          "--reveal-delay": `${Math.min(index, 6) * 0.07}s`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </li>
  );
}
