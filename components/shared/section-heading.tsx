import { cn } from "@/lib/utils";
import { HeadingReveal } from "@/components/motion/heading-reveal";

type SectionHeadingProps = {
  id: string;
  title: string;
  intro?: React.ReactNode;
  /** Optional element aligned to the right on wide screens (e.g. a "see all" link) */
  action?: React.ReactNode;
  className?: string;
};

/**
 * Left-aligned section title used across pages. Headings stay plain: no accent
 * words, no eyebrows. The title slides up into view once (see HeadingReveal).
 */
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
      <HeadingReveal id={id} title={title} intro={intro} />
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
