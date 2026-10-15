import Link from 'next/link'
import { BlogCardProps } from '@/types/blog-card'

export function formatPostDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** One post as a row in an editorial list: date and tags on the left, title and summary on the right. */
export function BlogCard({ title, description, tags = [], published_at, slug }: BlogCardProps) {
  return (
    <article className="border-b border-border-subtle">
      <Link
        href={`/blog/${slug}`}
        className="group grid gap-3 py-8 outline-none focus-visible:bg-bg-secondary md:grid-cols-12 md:gap-8 md:px-4"
      >
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted md:col-span-3 md:flex-col">
          {published_at && <time dateTime={new Date(published_at).toISOString()}>{formatPostDate(published_at)}</time>}
          {tags.length > 0 && <span>{tags.slice(0, 2).join(', ')}</span>}
        </div>
        <div className="md:col-span-9">
          <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent-hover sm:text-2xl">
            {title}
          </h3>
          {description && <p className="mt-2 max-w-[68ch] leading-relaxed text-text-secondary line-clamp-2">{description}</p>}
        </div>
      </Link>
    </article>
  )
}
