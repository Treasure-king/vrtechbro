"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--brand-surface)",
          "--normal-text": "var(--brand-text)",
          "--normal-border": "var(--brand-line-strong)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
