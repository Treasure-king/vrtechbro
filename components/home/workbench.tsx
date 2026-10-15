"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
 * Snippets: hand-tokenised so we get syntax colours without a
 * highlighter dependency. k = keyword, s = string, t = tag/type,
 * f = function, c = comment, p = plain
 * ---------------------------------------------------------------- */
type Kind = "k" | "s" | "t" | "f" | "c" | "p";
type Token = [string, Kind];

const tokenClass: Record<Kind, string> = {
  k: "text-accent-secondary",
  s: "text-success",
  t: "text-accent-primary",
  f: "text-warning",
  c: "text-text-muted",
  p: "text-text-secondary",
};

type Build = {
  id: string;
  label: string;
  file: string;
  stack: string;
  summary: string;
  code: Token[][];
};

const BUILDS: Build[] = [
  {
    id: "website",
    label: "Website",
    file: "app/page.tsx",
    stack: "Next.js, Tailwind CSS",
    summary:
      "A marketing website: navigation, a headline, a call to action and a feature grid.",
    code: [
      [
        ["export default ", "k"],
        ["function ", "k"],
        ["Home", "f"],
        ["() {", "p"],
      ],
      [
        ["  return ", "k"],
        ["(", "p"],
      ],
      [
        ["    <", "p"],
        ["Hero", "t"],
        [" title=", "p"],
        ['"Grow online"', "s"],
        [" />", "p"],
      ],
      [
        ["    <", "p"],
        ["Features", "t"],
        [" columns={", "p"],
        ["3", "f"],
        ["} />", "p"],
      ],
      [
        ["    <", "p"],
        ["Cta", "t"],
        [" href=", "p"],
        ['"/contact"', "s"],
        [" />", "p"],
      ],
      [["  )", "p"]],
      [["}", "p"]],
    ],
  },
  {
    id: "app",
    label: "Mobile app",
    file: "screens/Orders.tsx",
    stack: "React Native, Supabase",
    summary:
      "A mobile app screen: a list of orders with statuses and a bottom tab bar.",
    code: [
      [
        ["const ", "k"],
        ["orders ", "p"],
        ["= ", "p"],
        ["await ", "k"],
        ["supabase", "p"],
      ],
      [
        ["  .", "p"],
        ["from", "f"],
        ["(", "p"],
        ["'orders'", "s"],
        [")", "p"],
      ],
      [
        ["  .", "p"],
        ["select", "f"],
        ["(", "p"],
        ["'id, item, status'", "s"],
        [")", "p"],
      ],
      [["", "p"]],
      [
        ["return ", "k"],
        ["<", "p"],
        ["OrderList", "t"],
        [" data={orders} />", "p"],
      ],
    ],
  },
  {
    id: "extension",
    label: "Chrome extension",
    file: "popup.ts",
    stack: "TypeScript, Manifest V3",
    summary:
      "A browser extension popup with an on/off switch and a counter of blocked items.",
    code: [
      [["// Toggle focus mode for this tab", "c"]],
      [
        ["toggle", "p"],
        [".", "p"],
        ["onchange ", "f"],
        ["= ", "p"],
        ["async ", "k"],
        ["() => {", "p"],
      ],
      [
        ["  await ", "k"],
        ["chrome.storage.", "p"],
        ["set", "f"],
        ["({", "p"],
      ],
      [["    focus: toggle.checked", "p"]],
      [["  })", "p"]],
      [["}", "p"]],
    ],
  },
  {
    id: "api",
    label: "API",
    file: "routes/invoices.ts",
    stack: "Node.js, PostgreSQL",
    summary:
      "A backend API endpoint returning a JSON list of invoices with a 200 OK status.",
    code: [
      [
        ["app.", "p"],
        ["get", "f"],
        ["(", "p"],
        ["'/invoices'", "s"],
        [", ", "p"],
        ["async ", "k"],
        ["(_, res) => {", "p"],
      ],
      [
        ["  const ", "k"],
        ["rows ", "p"],
        ["= ", "p"],
        ["await ", "k"],
        ["db.", "p"],
        ["query", "f"],
        ["(", "p"],
      ],
      [
        ["    ", "p"],
        ["'select * from invoices'", "s"],
      ],
      [["  )", "p"]],
      [
        ["  res.", "p"],
        ["json", "f"],
        ["(rows)", "p"],
      ],
      [["})", "p"]],
    ],
  },
];

const charCount = (code: Token[][]) =>
  code.reduce((n, line) => n + line.reduce((m, [t]) => m + t.length, 0) + 1, 0);

/* ----------------------------- Code pane ----------------------------- */

function CodePane({ build, typed }: { build: Build; typed: number }) {
  const typing = typed < charCount(build.code);
  let remaining = typed;
  let caretPlaced = false;

  return (
    <pre
      className="font-mono text-[12.5px] leading-6 sm:text-[13px]"
      aria-hidden="true"
    >
      {build.code.map((line, li) => {
        const lineLength = line.reduce((n, [t]) => n + t.length, 0);
        const complete = remaining > lineLength; // line plus its newline fit
        const budget = Math.max(0, Math.min(remaining, lineLength));
        remaining = complete ? remaining - lineLength - 1 : 0;

        let left = budget;
        const visible = line.map(([text, kind], ti) => {
          const slice = text.slice(0, Math.max(0, left));
          left -= slice.length;
          return slice ? (
            <span key={ti} className={tokenClass[kind]}>
              {slice}
            </span>
          ) : null;
        });

        const showCaret = typing && !complete && !caretPlaced;
        if (showCaret) caretPlaced = true;

        return (
          <div key={li} className="flex">
            <span className="text-text-muted/60 w-8 shrink-0 pr-4 text-right select-none">
              {li + 1}
            </span>
            <code>
              {visible}
              {showCaret && (
                <span className="caret bg-accent-primary ml-px inline-block h-4 w-[7px] translate-y-0.5" />
              )}
            </code>
          </div>
        );
      })}
    </pre>
  );
}

/* ---------------------------- Previews ---------------------------- */

const piece = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

function Assemble({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      animate="show"
      transition={{ staggerChildren: 0.09 }}
    >
      {children}
    </motion.div>
  );
}

const P = motion.div;

function WebsitePreview() {
  return (
    <Assemble className="border-border-subtle bg-bg-primary flex h-full flex-col overflow-hidden rounded-lg border">
      <P
        variants={piece}
        className="border-border-subtle flex items-center gap-2 border-b px-3 py-2"
      >
        <span className="bg-text-muted/40 h-2 w-12 rounded-full" />
        <span className="bg-text-muted/25 ml-auto h-2 w-6 rounded-full" />
        <span className="bg-text-muted/25 h-2 w-6 rounded-full" />
        <span className="bg-accent-primary/80 h-4 w-10 rounded" />
      </P>
      <div className="flex-1 space-y-3 p-4">
        <P variants={piece} className="bg-text-primary/85 h-4 w-4/5 rounded" />
        <P variants={piece} className="bg-text-primary/85 h-4 w-3/5 rounded" />
        <P
          variants={piece}
          className="bg-text-muted/40 h-2 w-2/3 rounded-full"
        />
        <P variants={piece} className="gradient-primary h-6 w-24 rounded-md" />
        <P variants={piece} className="grid grid-cols-3 gap-2 pt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border-border-subtle bg-bg-secondary space-y-1.5 rounded-md border p-2"
            >
              <div className="bg-accent-secondary/70 h-3 w-3 rounded-sm" />
              <div className="bg-text-muted/35 h-1.5 w-full rounded-full" />
              <div className="bg-text-muted/25 h-1.5 w-2/3 rounded-full" />
            </div>
          ))}
        </P>
      </div>
    </Assemble>
  );
}

function AppPreview() {
  const rows = [
    ["bg-success", "w-20"],
    ["bg-warning", "w-16"],
    ["bg-accent-primary", "w-24"],
    ["bg-success", "w-14"],
  ];
  return (
    <div className="flex h-full items-center justify-center">
      <Assemble className="border-bg-tertiary bg-bg-primary flex h-full max-h-[280px] w-[150px] flex-col overflow-hidden rounded-[22px] border-4">
        <P
          variants={piece}
          className="bg-bg-tertiary mx-auto mt-1.5 h-1.5 w-10 rounded-full"
        />
        <P variants={piece} className="px-3 pt-3 pb-2">
          <div className="bg-text-primary/85 h-3 w-16 rounded" />
        </P>
        <div className="flex-1 space-y-1.5 px-2">
          {rows.map(([dot, w], i) => (
            <P
              key={i}
              variants={piece}
              className="bg-bg-secondary flex items-center gap-2 rounded-md px-2 py-2"
            >
              <span className={cn("h-2 w-2 rounded-full", dot)} />
              <span className={cn("bg-text-muted/45 h-1.5 rounded-full", w)} />
            </P>
          ))}
        </div>
        <P
          variants={piece}
          className="border-border-subtle mt-2 flex justify-around border-t py-2"
        >
          <span className="bg-accent-primary h-2.5 w-2.5 rounded-sm" />
          <span className="bg-text-muted/40 h-2.5 w-2.5 rounded-sm" />
          <span className="bg-text-muted/40 h-2.5 w-2.5 rounded-sm" />
        </P>
      </Assemble>
    </div>
  );
}

function ExtensionPreview() {
  const [on, setOn] = useState(true);
  return (
    <Assemble className="border-border-subtle bg-bg-primary flex h-full flex-col overflow-hidden rounded-lg border">
      <P
        variants={piece}
        className="border-border-subtle flex items-center gap-2 border-b px-3 py-2"
      >
        <span className="bg-bg-secondary h-4 flex-1 rounded" />
        <span className="gradient-primary h-4 w-4 rounded" />
      </P>
      <div className="flex flex-1 justify-end p-3">
        <P
          variants={piece}
          className="border-border-strong bg-bg-secondary w-44 space-y-3 self-start rounded-lg border p-3 shadow-xl shadow-black/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-text-primary text-xs font-medium">
              Focus mode
            </span>
            {/* Real control: the preview is decorative, but this switch can be toggled */}
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label="Toggle focus mode in the extension preview"
              onClick={() => setOn((v) => !v)}
              className={cn(
                "focus-visible:outline-accent-primary relative h-4 w-7 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                on ? "bg-accent-primary" : "bg-bg-tertiary",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform",
                  on ? "translate-x-3.5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>
          <div className="text-text-muted text-[11px] leading-snug">
            {on ? "14 distracting sites blocked today" : "Paused on this tab"}
          </div>
        </P>
      </div>
    </Assemble>
  );
}

function ApiPreview() {
  const lines: [string, string][] = [
    ["$ curl /invoices", "text-text-secondary"],
    ["HTTP/1.1 200 OK", "text-success"],
    ["[", "text-text-muted"],
    ['  { "id": 1042, "total": 1890 },', "text-text-secondary"],
    ['  { "id": 1043, "total": 760 }', "text-text-secondary"],
    ["]", "text-text-muted"],
  ];
  return (
    <Assemble className="border-border-subtle bg-bg-primary h-full overflow-hidden rounded-lg border p-4 font-mono text-[12px] leading-6">
      {lines.map(([text, color], i) => (
        <P key={i} variants={piece} className={cn("whitespace-pre", color)}>
          {text}
        </P>
      ))}
    </Assemble>
  );
}

const PREVIEWS: Record<string, () => React.ReactNode> = {
  website: WebsitePreview,
  app: AppPreview,
  extension: ExtensionPreview,
  api: ApiPreview,
};

/* ---------------------------- Workbench ---------------------------- */

export function Workbench() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(BUILDS[0].id);
  const build = useMemo(
    () => BUILDS.find((b) => b.id === active) ?? BUILDS[0],
    [active],
  );
  const total = charCount(build.code);

  // Type the first snippet on page load; later tab switches show code instantly
  const [hasTyped, setHasTyped] = useState(false);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (reduce || hasTyped) {
      setTyped(total);
      return;
    }
    let n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      n += 2;
      setTyped(n);
      if (n < total) timer = setTimeout(tick, 22);
      else setHasTyped(true);
    };
    timer = setTimeout(tick, 650);
    return () => clearTimeout(timer);
  }, [reduce, hasTyped, total]);

  const done = typed >= total;
  const Preview = PREVIEWS[build.id];

  return (
    <Tabs
      value={active}
      onValueChange={(v) => {
        setHasTyped(true);
        setActive(v);
      }}
      className="border-border-strong bg-bg-secondary/90 overflow-hidden rounded-2xl border shadow-2xl shadow-black/50 backdrop-blur"
    >
      {/* Tab bar doubles as the editor's file tabs */}
      <div className="border-border-subtle bg-bg-tertiary/40 flex items-center border-b">
        <TabsList
          aria-label="Choose a kind of project"
          className="h-auto w-full justify-start gap-0 overflow-x-auto rounded-none bg-transparent p-0 [scrollbar-width:none]"
        >
          {BUILDS.map((b) => (
            <TabsTrigger
              key={b.id}
              value={b.id}
              className="border-border-subtle text-text-muted hover:text-text-primary focus-visible:outline-accent-primary data-[state=active]:bg-bg-secondary data-[state=active]:text-text-primary dark:data-[state=active]:border-border-subtle dark:data-[state=active]:bg-bg-secondary h-auto flex-none cursor-pointer rounded-none border-0 border-r px-4 py-3 text-sm shadow-none transition-colors focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:-outline-offset-2 data-[state=active]:shadow-[inset_0_-2px_0_var(--color-accent-primary)]"
            >
              {b.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {BUILDS.map((b) => (
        <TabsContent key={b.id} value={b.id} className="m-0">
          <p className="sr-only">{b.summary}</p>
          <div className="grid md:grid-cols-[1.15fr_1fr]">
            <div className="border-border-subtle min-h-[220px] overflow-x-auto [scrollbar-width:none] border-b p-4 md:border-r md:border-b-0">
              <CodePane
                build={b}
                typed={b.id === build.id ? typed : charCount(b.code)}
              />
            </div>
            <div className="bg-bg-primary/40 h-[260px] p-4 md:h-auto md:min-h-[260px]">
              <AnimatePresence mode="wait">
                {done && b.id === build.id && (
                  <motion.div
                    key={b.id}
                    className="h-full"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Preview />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>
      ))}

      {/* Status bar */}
      <div className="border-border-subtle text-text-muted flex items-center justify-between gap-4 border-t px-4 py-2 font-mono text-[11px]">
        <span className="truncate">{build.file}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              done ? "bg-success" : "bg-warning",
            )}
          />
          {done ? build.stack : "Building…"}
        </span>
      </div>
    </Tabs>
  );
}
