import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  intro?: React.ReactNode;
  /** Extra content under the intro: CTAs, meta, filters */
  children?: React.ReactNode;
  className?: string;
};

/** Opening block for inner pages. Left-aligned, large type, a hairline grid behind it. */
export function PageHero({ title, intro, children, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "border-border-subtle relative overflow-hidden border-b",
        className,
      )}
    >
      <div
        className="bg-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div className="container-page relative pt-20 pb-16 md:pt-28 md:pb-20">
        <h1 className="type-display text-text-primary max-w-4xl">{title}</h1>
        {intro && (
          <p className="text-text-secondary mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
            {intro}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
