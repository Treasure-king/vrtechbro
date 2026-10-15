"use client";

import { useEffect } from "react";

// Templates remount on every navigation, but module state survives, so this
// tells us whether the visitor has already seen a page in this session.
let hasNavigated = false;

/**
 * Short CSS fade between pages. The first page load is never faded: it must
 * paint immediately from the server HTML, without waiting for JavaScript.
 * (`.page-fade` respects prefers-reduced-motion via the global rule.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const fade = hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <div className={fade ? "page-fade relative" : "relative"}>{children}</div>
  );
}
