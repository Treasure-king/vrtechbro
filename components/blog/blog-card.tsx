import { formatDate, isoDate } from "@/lib/format-date";
import Link from "next/link";
import { BlogCardProps } from "@/types/blog-card";

export function formatPostDate(date: Date | string) {
  return formatDate(date);
}

/** One post as a row in an editorial list: date and tags on the left, title and summary on the right. */
export function BlogCard({
  title,
  description,
  tags = [],
  published_at,
  slug,
}: BlogCardProps) {
  return (
    <article className="border-border-subtle border-b">
      <Link
        href={`/blog/${slug}`}
        className="group focus-visible:bg-bg-secondary grid gap-3 py-8 outline-none md:grid-cols-12 md:gap-8 md:px-4"
      >
        <div className="text-text-muted flex flex-wrap gap-x-4 gap-y-1 text-sm md:col-span-3 md:flex-col">
          {published_at && (
            <time dateTime={isoDate(published_at)}>
              {formatPostDate(published_at)}
            </time>
          )}
          {tags.length > 0 && <span>{tags.slice(0, 2).join(", ")}</span>}
        </div>
        <div className="md:col-span-9">
          <h3 className="font-display text-text-primary group-hover:text-accent-hover text-xl font-semibold tracking-tight transition-colors sm:text-2xl">
            {title}
          </h3>
          {description && (
            <p className="text-text-secondary mt-2 line-clamp-2 max-w-[68ch] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
