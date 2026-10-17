"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  ChatDemo,
  DashboardDemo,
  ExtensionDemo,
  PhoneDemo,
  ScoreDemo,
  TerminalDemo,
} from "@/components/home/capabilities/demos";

const PANELS = [
  {
    title: "Websites",
    body: "Marketing and content sites built to load fast, rank well and be easy for your team to update.",
    tools: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    Demo: ScoreDemo,
  },
  {
    title: "Web apps and SaaS",
    body: "Dashboards, portals and subscription products with accounts, roles, data and payments wired in properly.",
    tools: ["Next.js", "Supabase", "PostgreSQL", "Node.js"],
    Demo: DashboardDemo,
  },
  {
    title: "Mobile apps",
    body: "Cross-platform apps for iOS and Android from one codebase, with offline support and push notifications where you need them.",
    tools: ["React Native", "Firebase", "Supabase"],
    Demo: PhoneDemo,
  },
  {
    title: "Chrome extensions",
    body: "Browser tools that sit where your users already work, built on Manifest V3 and ready for the Chrome Web Store.",
    tools: ["TypeScript", "Manifest V3", "Chrome APIs"],
    Demo: ExtensionDemo,
  },
  {
    title: "npm packages",
    body: "Reusable libraries with typed APIs, tests and versioned releases, so other developers can install them in one line.",
    tools: ["TypeScript", "Node.js", "npm"],
    Demo: TerminalDemo,
  },
  {
    title: "AI features",
    body: "Practical AI inside your product: summaries, search over your own documents, and assistants that know your data.",
    tools: ["Python", "LLM APIs", "Vector search", "Next.js"],
    Demo: ChatDemo,
  },
];

/**
 * Six kinds of work as an index: pick one on the left (click, hover or keyboard)
 * and its description, tools and a small live demo appear on the right.
 * Motion only happens in response to the visitor.
 */
export function Capabilities() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(PANELS[0].title);

  return (
    <section aria-labelledby="capabilities-title" className="py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="capabilities-title"
          title="Six kinds of product, one team"
          intro="The same people design, build and maintain each of these, so nothing gets lost between specialists."
        />

        <Tabs
          value={active}
          onValueChange={setActive}
          orientation="vertical"
          className="grid gap-8 lg:grid-cols-12 lg:gap-12"
        >
          <TabsList
            aria-label="Kinds of product"
            className="border-border-subtle flex h-auto w-full flex-row flex-wrap justify-start gap-2 rounded-none border-0 bg-transparent p-0 lg:col-span-5 lg:flex-col lg:gap-0 lg:border-t"
          >
            {PANELS.map((panel, i) => (
              <TabsTrigger
                key={panel.title}
                value={panel.title}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setActive(panel.title);
                }}
                className="group text-text-secondary hover:text-text-primary data-[state=active]:text-text-primary border-border-subtle data-[state=active]:border-signal dark:data-[state=active]:border-signal lg:dark:data-[state=active]:border-border-subtle h-auto flex-none cursor-pointer justify-start gap-4 rounded-full border px-4 py-2 text-left text-sm shadow-none transition-colors data-[state=active]:bg-transparent data-[state=active]:shadow-none lg:w-full lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-5 dark:data-[state=active]:bg-transparent"
              >
                <span
                  aria-hidden="true"
                  className="text-text-muted group-data-[state=active]:text-signal hidden font-mono text-xs lg:inline"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="lg:font-display lg:text-2xl lg:font-semibold lg:tracking-tight">
                  {panel.title}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {PANELS.map((panel) => (
            <TabsContent
              key={panel.title}
              value={panel.title}
              className="m-0 lg:col-span-7"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={panel.title}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="border-border-subtle bg-bg-secondary/60 grid gap-8 rounded-2xl border p-6 md:p-8"
                >
                  <div className="flex flex-col">
                    <h3 className="font-display text-text-primary text-2xl font-semibold tracking-tight">
                      {panel.title}
                    </h3>
                    <p className="text-text-secondary mt-3 leading-relaxed">
                      {panel.body}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {panel.tools.map((tool) => (
                        <li
                          key={tool}
                          className="border-border-subtle text-text-secondary rounded-full border px-3 py-1 text-xs"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-border-subtle bg-bg-primary min-h-[260px] overflow-hidden rounded-xl border">
                    <panel.Demo />
                  </div>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
