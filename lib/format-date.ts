/**
 * Date helpers that give the same text on the server and in the browser.
 *
 * Why: Vercel's servers run in UTC while visitors' browsers use their own time
 * zone. Formatting with each machine's local zone made server HTML and the
 * browser's render disagree (React hydration error #418). Some columns (e.g.
 * blogs.published_at) are stored "without time zone", which browsers would
 * otherwise read as local time, so those strings are treated as UTC too.
 */

/** Parses a date, reading a timestamp that has no zone as UTC. */
export function toDate(value: string | number | Date): Date {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T[\d:.]+$/.test(value)) {
    return new Date(`${value}Z`);
  }
  return new Date(value);
}

const formats = {
  short: { year: "numeric", month: "short", day: "numeric" }, // Aug 17, 2025
  long: { year: "numeric", month: "long", day: "numeric" }, // August 17, 2025
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

/** Formats a date in UTC so server and browser always agree. */
export function formatDate(
  value: string | number | Date,
  style: keyof typeof formats = "short",
  locale = "en-US",
): string {
  return toDate(value).toLocaleDateString(locale, {
    ...formats[style],
    timeZone: "UTC",
  });
}

/** ISO string for <time dateTime>, parsed the same way as formatDate. */
export function isoDate(value: string | number | Date): string {
  return toDate(value).toISOString();
}
