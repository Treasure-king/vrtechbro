"use client";

import dynamic from "next/dynamic";

/**
 * Toasts only matter after someone submits a form, so the toaster loads after
 * the page is interactive instead of being part of every page's first load.
 */
export const LazyToaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => m.Toaster),
  { ssr: false },
);
