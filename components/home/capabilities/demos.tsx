"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Small, self-contained illustrations for each capability panel.
 * Each one plays once when it scrolls into view and is static for reduced motion.
 */

const ease = [0.22, 1, 0.36, 1] as const;

function useDemo<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion() ?? false;
  return { ref, play: inView || reduce, reduce };
}

const frame =
  "h-full w-full rounded-xl border border-border-subtle bg-bg-primary p-5";

/* --------------------------- Websites --------------------------- */

const TARGETS = [
  { label: "Performance", value: 90 },
  { label: "Accessibility", value: 95 },
  { label: "Best practices", value: 95 },
  { label: "SEO", value: 100 },
];

export function ScoreDemo() {
  const { ref, play, reduce } = useDemo<HTMLDivElement>();
  const r = 26;
  const c = 2 * Math.PI * r;

  return (
    <div ref={ref} className={cn(frame, "flex flex-col justify-between gap-6")}>
      <p className="text-text-muted text-sm">
        Lighthouse targets we ship against
      </p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {TARGETS.map((t, i) => (
          <div
            key={t.label}
            className="flex flex-col items-center gap-2 text-center"
          >
            <div className="relative h-16 w-16">
              <svg
                viewBox="0 0 64 64"
                className="h-full w-full -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="32"
                  cy="32"
                  r={r}
                  fill="none"
                  stroke="var(--brand-line)"
                  strokeWidth="5"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r={r}
                  fill="none"
                  stroke="var(--brand-success)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  initial={{ strokeDashoffset: c }}
                  animate={
                    play
                      ? { strokeDashoffset: c * (1 - t.value / 100) }
                      : undefined
                  }
                  transition={{
                    duration: reduce ? 0 : 1.2,
                    delay: reduce ? 0 : i * 0.12,
                    ease,
                  }}
                />
              </svg>
              <span className="text-text-primary absolute inset-0 flex items-center justify-center font-mono text-sm">
                {t.value === 100 ? "100" : `${t.value}+`}
              </span>
            </div>
            <span className="text-text-secondary text-xs">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Web apps & SaaS --------------------------- */

const BARS = [38, 52, 46, 64, 58, 76, 70, 88];

export function DashboardDemo() {
  const { ref, play, reduce } = useDemo<HTMLDivElement>();

  return (
    <div ref={ref} className={cn(frame, "flex flex-col gap-4")}>
      <div className="flex items-center gap-3">
        <span className="bg-text-primary/80 h-2.5 w-20 rounded-full" />
        <span className="bg-text-muted/40 ml-auto h-2 w-10 rounded-full" />
        <span className="bg-text-muted/40 h-2 w-10 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["bg-accent-primary", "bg-success", "bg-signal"].map((dot, i) => (
          <div
            key={i}
            className="border-border-subtle bg-bg-secondary space-y-2 rounded-lg border p-3"
          >
            <span className={cn("block h-2 w-2 rounded-full", dot)} />
            <span className="bg-text-primary/70 block h-2.5 w-12 rounded-full" />
            <span className="bg-text-muted/35 block h-1.5 w-16 rounded-full" />
          </div>
        ))}
      </div>
      <div className="border-border-subtle bg-bg-secondary flex flex-1 items-end gap-2 rounded-lg border p-3">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="bg-accent-primary/80 block flex-1 origin-bottom rounded-sm"
            style={{ height: `${h}%` }}
            initial={{ scaleY: reduce ? 1 : 0 }}
            animate={play ? { scaleY: 1 } : undefined}
            transition={{
              duration: reduce ? 0 : 0.6,
              delay: reduce ? 0 : 0.2 + i * 0.06,
              ease,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Mobile apps --------------------------- */

const ROWS = [
  { dot: "bg-success", w: "w-24" },
  { dot: "bg-signal", w: "w-16" },
  { dot: "bg-accent-primary", w: "w-20" },
  { dot: "bg-success", w: "w-14" },
  { dot: "bg-text-muted", w: "w-[4.5rem]" },
];

export function PhoneDemo() {
  const { ref, play, reduce } = useDemo<HTMLDivElement>();

  return (
    <div ref={ref} className={cn(frame, "flex items-center justify-center")}>
      <div className="border-bg-tertiary bg-bg-primary flex h-full max-h-72 w-40 flex-col overflow-hidden rounded-[1.6rem] border-[5px]">
        <span className="bg-bg-tertiary mx-auto mt-1.5 h-1.5 w-12 rounded-full" />
        <div className="px-3 pt-3 pb-2">
          <span className="bg-text-primary/85 block h-3 w-16 rounded" />
        </div>
        <div className="flex-1 space-y-1.5 px-2">
          {ROWS.map((row, i) => (
            <motion.div
              key={i}
              className="bg-bg-secondary flex items-center gap-2 rounded-md px-2 py-2"
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={play ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease }}
            >
              <span className={cn("h-2 w-2 rounded-full", row.dot)} />
              <span
                className={cn("bg-text-muted/45 h-1.5 rounded-full", row.w)}
              />
            </motion.div>
          ))}
        </div>
        <div className="border-border-subtle mt-2 flex justify-around border-t py-2">
          <span className="bg-accent-primary h-2.5 w-2.5 rounded-sm" />
          <span className="bg-text-muted/40 h-2.5 w-2.5 rounded-sm" />
          <span className="bg-text-muted/40 h-2.5 w-2.5 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Chrome extensions --------------------------- */

export function ExtensionDemo() {
  const [on, setOn] = useState(true);

  return (
    <div className={cn(frame, "flex flex-col gap-4 p-0")}>
      <div className="border-border-subtle flex items-center gap-2 border-b px-4 py-3">
        <span className="bg-bg-secondary h-5 flex-1 rounded-md" />
        <span className="gradient-primary h-5 w-5 rounded-md" />
      </div>
      <div className="relative flex flex-1 gap-4 px-4 pb-4">
        {/* The page underneath: clutter fades out when reader mode is on */}
        <div className="flex-1 space-y-2.5 pt-1" aria-hidden="true">
          <span className="bg-text-primary/80 block h-3 w-3/4 rounded" />
          {[100, 92, 96, 70].map((w, i) => (
            <span
              key={i}
              className="bg-text-muted/35 block h-1.5 rounded-full"
              style={{ width: `${w}%` }}
            />
          ))}
          <motion.div
            animate={{ opacity: on ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="flex gap-2 pt-1"
          >
            <span className="bg-error/40 h-10 flex-1 rounded-md" />
            <span className="bg-warning/40 h-10 flex-1 rounded-md" />
          </motion.div>
          {[88, 94].map((w, i) => (
            <span
              key={i}
              className="bg-text-muted/35 block h-1.5 rounded-full"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="border-border-strong bg-bg-secondary w-44 space-y-3 self-start rounded-lg border p-3 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between gap-3">
            <span className="text-text-primary text-xs font-medium">
              Reader mode
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label="Toggle reader mode in the extension example"
              onClick={() => setOn((v) => !v)}
              className={cn(
                "focus-visible:outline-accent-primary relative h-4 w-7 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                on ? "bg-accent-primary" : "bg-bg-tertiary",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0 h-3 w-3 rounded-full bg-white transition-transform",
                  on ? "translate-x-3.5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>
          <p className="text-text-muted text-[11px] leading-snug">
            {on
              ? "Ads and pop-ups hidden on this page"
              : "Showing the page as it is"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- npm packages --------------------------- */

const TERMINAL: { text: string; className: string }[] = [
  { text: "$ npm i your-package", className: "text-text-primary" },
  { text: "added 1 package in 0.8s", className: "text-text-muted" },
  { text: "", className: "" },
  {
    text: "import { format } from 'your-package'",
    className: "text-text-secondary",
  },
  { text: "format(new Date(), 'short')", className: "text-text-secondary" },
  { text: "// => 'Oct 15, 2026'", className: "text-success" },
];

export function TerminalDemo() {
  const { ref, play, reduce } = useDemo<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        frame,
        "flex flex-col gap-4 font-mono text-[12.5px] leading-6",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-text-muted text-xs">terminal</span>
        <span className="border-border-strong text-text-secondary rounded-full border px-2 py-0.5 text-[11px]">
          <span className="text-signal" aria-hidden="true">
            ●
          </span>{" "}
          v1.0.0 with types
        </span>
      </div>
      <div className="overflow-x-auto [scrollbar-width:none]">
        {TERMINAL.map((line, i) => (
          <motion.div
            key={i}
            className={cn("min-h-6 whitespace-pre", line.className)}
            initial={reduce ? false : { opacity: 0 }}
            animate={play ? { opacity: 1 } : undefined}
            transition={{ duration: 0.25, delay: i * 0.35 }}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- AI features --------------------------- */

const QUESTION = "Summarise this support ticket.";
const ANSWER =
  "The customer can't reset their password because reset emails land in spam. Suggested fix: verify the sending domain, then resend the link.";

export function ChatDemo() {
  const { ref, play, reduce } = useDemo<HTMLDivElement>();
  const words = ANSWER.split(" ");

  return (
    <div ref={ref} className={cn(frame, "flex flex-col justify-end gap-3")}>
      <motion.div
        className="bg-accent-primary/15 text-text-primary self-end rounded-2xl rounded-br-sm px-4 py-2.5 text-sm"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.4, ease }}
      >
        {QUESTION}
      </motion.div>
      <div className="border-border-subtle bg-bg-secondary text-text-secondary max-w-[90%] self-start rounded-2xl rounded-bl-sm border px-4 py-3 text-sm leading-relaxed">
        <span className="sr-only">{ANSWER}</span>
        <span aria-hidden="true">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={reduce ? false : { opacity: 0 }}
              animate={play ? { opacity: 1 } : undefined}
              transition={{ duration: 0.2, delay: 0.7 + i * 0.06 }}
            >
              {w}{" "}
            </motion.span>
          ))}
        </span>
      </div>
    </div>
  );
}
