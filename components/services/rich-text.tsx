/**
 * Renders plain or lightly formatted service copy from Supabase.
 * Supports blank-line paragraphs, "## " / "### " headings and "- " / "* " lists.
 * Everything is rendered as React text, so stored HTML is never injected.
 */
const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  apos: "'",
  nbsp: " ",
};

/**
 * Some rows store simple HTML (<h2>, <p>, <ul><li>). Convert that structure into the
 * plain format below and drop every other tag, so nothing is ever rendered as HTML.
 */
function htmlToPlain(input: string): string {
  if (!/<\/?[a-z][^>]*>/i.test(input)) return input;
  return input
    .replace(/<h[1-2][^>]*>/gi, "\n\n## ")
    .replace(/<h[3-6][^>]*>/gi, "\n\n### ")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(h[1-6]|p|ul|ol|div|section)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (_, e: string) => ENTITIES[e])
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function RichText({
  text,
  skipHeading,
}: {
  text?: string | null;
  skipHeading?: string;
}) {
  if (!text) return null;

  const blocks = htmlToPlain(text)
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    // Content often repeats the page title as its first heading; the page already shows it
    .filter(
      (b, i) =>
        !(
          i === 0 &&
          skipHeading &&
          b.replace(/^#{1,3} /, "").trim() === skipHeading.trim()
        ),
    );

  return (
    <div className="text-text-secondary space-y-5 text-lg leading-relaxed">
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) {
          return (
            <h4
              key={i}
              className="font-display text-text-primary pt-2 text-xl font-semibold"
            >
              {block.slice(4)}
            </h4>
          );
        }
        if (block.startsWith("## ") || block.startsWith("# ")) {
          return (
            <h3
              key={i}
              className="font-display text-text-primary pt-4 text-2xl font-semibold tracking-tight"
            >
              {block.replace(/^#{1,2} /, "")}
            </h3>
          );
        }

        const lines = block.split("\n");
        if (lines.every((l) => /^[-*] /.test(l.trim()))) {
          return (
            <ul
              key={i}
              className="marker:text-accent-primary list-disc space-y-2 pl-5"
            >
              {lines.map((l, j) => (
                <li key={j}>{l.trim().slice(2)}</li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{lines.join(" ")}</p>;
      })}
    </div>
  );
}
