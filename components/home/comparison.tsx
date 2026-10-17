"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { BRAND } from "@/lib/brand";

const ROWS = [
  {
    topic: "Who you talk to",
    agency: "An account manager who passes messages along",
    freelancer: "The person doing the work",
    us: "The people who design and build it",
  },
  {
    topic: "Design, front end and back end",
    agency: "Separate teams, with handoffs between them",
    freelancer: "Usually one of the three; the rest is outsourced",
    us: "One team covers all three",
  },
  {
    topic: "Websites, apps, extensions and APIs",
    agency: "Often, spread across departments",
    freelancer: "Rarely all of them",
    us: "All of them, built to work together",
  },
  {
    topic: "Changes mid-project",
    agency: "Change requests and re-estimates",
    freelancer: "Depends on their availability",
    us: "Discussed directly, shipped in the next cycle",
  },
  {
    topic: "After launch",
    agency: "A support contract, often with a new team",
    freelancer: "Depends on their next booking",
    us: "The same people maintain what they built",
  },
];

const COLUMNS = [
  { key: "agency", label: "Large agency" },
  { key: "freelancer", label: "Freelancer" },
  { key: "us", label: BRAND.name },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

/** A check mark whose stroke draws in when its row appears. */
function Check() {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="text-signal mt-0.5 h-5 w-5 shrink-0"
      fill="none"
    >
      <motion.path
        d="M4 10.5 L8.2 14.5 L16 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: reduce ? 1 : 0 },
          show: {
            pathLength: 1,
            transition: { duration: 0.5, delay: 0.25, ease },
          },
        }}
      />
    </svg>
  );
}

/**
 * Three common ways to get software built, compared on what matters to the
 * client. Rows reveal one after another as the table scrolls into view.
 */
export function Comparison() {
  const reduce = useReducedMotion();

  const table: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
  };
  const row: Variants = {
    hidden: reduce ? {} : { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
  };

  return (
    <section aria-labelledby="comparison-title" className="py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="comparison-title"
          title="An agency, a freelancer, or us?"
          intro="Three common ways to get software built, and what each one is like to work with."
        />

        {/* Desktop and tablet: a real table, with our column raised */}
        <motion.table
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={table}
          className="hidden w-full border-separate border-spacing-0 text-left md:table"
        >
          <caption className="sr-only">
            Comparison of a large agency, a freelancer and {BRAND.name}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[22%] pb-4" />
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={
                    col.key === "us"
                      ? "border-signal/40 bg-bg-secondary text-text-primary font-display rounded-t-2xl border-x border-t px-6 pt-6 pb-4 text-lg font-semibold"
                      : "text-text-muted px-6 pb-4 text-sm font-medium"
                  }
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => {
              const last = i === ROWS.length - 1;
              return (
                <motion.tr key={r.topic} variants={row}>
                  <th
                    scope="row"
                    className="border-border-subtle text-text-primary border-t py-5 pr-6 align-top font-medium"
                  >
                    {r.topic}
                  </th>
                  <td className="border-border-subtle text-text-secondary border-t px-6 py-5 align-top">
                    {r.agency}
                  </td>
                  <td className="border-border-subtle text-text-secondary border-t px-6 py-5 align-top">
                    {r.freelancer}
                  </td>
                  <td
                    className={`border-signal/40 bg-bg-secondary text-text-primary border-x border-t px-6 py-5 align-top ${
                      last ? "rounded-b-2xl border-b" : ""
                    }`}
                  >
                    <span className="flex gap-3">
                      <Check />
                      {r.us}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </motion.table>

        {/* Phones: one card per topic */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={table}
          className="space-y-4 md:hidden"
        >
          {ROWS.map((r) => (
            <motion.li
              key={r.topic}
              variants={row}
              className="border-border-subtle rounded-2xl border p-5"
            >
              <h3 className="text-text-primary font-medium">{r.topic}</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-text-muted">Large agency</dt>
                  <dd className="text-text-secondary mt-0.5">{r.agency}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Freelancer</dt>
                  <dd className="text-text-secondary mt-0.5">{r.freelancer}</dd>
                </div>
                <div className="border-signal/40 bg-bg-secondary -mx-2 rounded-xl border p-3">
                  <dt className="text-text-primary font-medium">
                    {BRAND.name}
                  </dt>
                  <dd className="text-text-primary mt-1 flex gap-2">
                    <Check />
                    {r.us}
                  </dd>
                </div>
              </dl>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-12">
          <Button asChild size="lg">
            <Link href="/contact">Start a project</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
