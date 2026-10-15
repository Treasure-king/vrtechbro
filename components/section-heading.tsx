import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  title: string;
  intro?: React.ReactNode;
  /** Optional element aligned to the right on wide screens (e.g. a "see all" link) */
  action?: React.ReactNode;
  className?: string;
};

/** Left-aligned section title used across pages. Headings stay plain: no accent words, no eyebrows. */
export function SectionHeading({
  id,
  title,
  intro,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <h2 id={id} className="type-heading text-text-primary">
          {title}
        </h2>
        {intro && (
          <p className="text-text-secondary mt-4 text-lg leading-relaxed">
            {intro}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
