"use client";

import { cn } from "@/lib/utils";

/**
 * Adds a soft glow that follows the pointer inside the element (see `.spotlight` in globals.css).
 * Only updates two CSS variables, so it costs almost nothing.
 */
export function Spotlight({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      className={cn("spotlight", className)}
      onPointerMove={onPointerMove}
      {...props}
    >
      {children}
    </div>
  );
}
