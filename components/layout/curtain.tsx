"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * "Curtain" footer: the page scrolls up like a sheet to reveal a footer fixed
 * underneath it. Only used on wide screens where the footer fits in the
 * viewport; elsewhere the footer sits in normal flow.
 */
export function Curtain({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 768px)");

    const update = () => {
      const height = el.offsetHeight;
      setFooterHeight(height);
      setEnabled(wide.matches && height < window.innerHeight * 0.9);
    };

    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    wide.addEventListener("change", update);
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      wide.removeEventListener("change", update);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "bg-bg-primary relative z-10",
          enabled &&
            "border-border-subtle rounded-b-[2.5rem] border-b shadow-[0_40px_80px_-30px_black]",
        )}
        style={enabled ? { marginBottom: footerHeight } : undefined}
      >
        {children}
      </div>
      <div
        ref={footerRef}
        className={cn(enabled ? "fixed inset-x-0 bottom-0 z-0" : "relative")}
      >
        {footer}
      </div>
    </>
  );
}
