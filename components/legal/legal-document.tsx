import { formatDate } from "@/lib/format-date";
import { PageHero } from "@/components/shared/page-hero";

export type LegalSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type LegalDocumentProps = {
  title: string;
  intro: React.ReactNode;
  sections: LegalSection[];
  /** ISO date the document last changed. Omit until the owner confirms one. */
  updated?: string;
};

/**
 * Long-form legal page: numbered sections (the order matters for references)
 * with a sticky table of contents on wide screens.
 */
export function LegalDocument({
  title,
  intro,
  sections,
  updated,
}: LegalDocumentProps) {
  return (
    <>
      <PageHero title={title} intro={intro}>
        {updated && (
          <p className="text-text-muted text-sm">
            Last updated{" "}
            <time dateTime={updated}>{formatDate(updated, "long")}</time>
          </p>
        )}
      </PageHero>

      <div className="container-page grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
        <nav aria-label="On this page" className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-28">
            <h2 className="text-text-muted text-sm font-medium">
              On this page
            </h2>
            <ol className="border-border-subtle mt-4 space-y-1 border-l">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-text-secondary hover:border-accent-primary hover:text-text-primary focus-visible:border-accent-primary focus-visible:text-text-primary -ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-sm transition-colors focus-visible:outline-none"
                  >
                    <span className="text-text-muted font-mono tabular-nums">
                      {i + 1}.
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="max-w-prose lg:col-span-8 xl:col-span-7">
          {sections.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="border-border-subtle scroll-mt-28 border-t py-10 first:border-t-0 first:pt-0"
            >
              <h2
                id={`${section.id}-title`}
                className="font-display text-text-primary flex gap-4 text-2xl font-semibold tracking-tight"
              >
                <span className="text-accent-primary font-mono text-lg tabular-nums">
                  {i + 1}.
                </span>
                {section.title}
              </h2>
              <div className="legal-body text-text-secondary [&_a]:text-text-primary [&_a]:decoration-border-strong hover:[&_a]:decoration-accent-primary [&_ul]:marker:text-text-muted mt-4 space-y-4 text-[1.0625rem] leading-[1.75] [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
                {section.content}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
