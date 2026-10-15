import type { Heading } from '@/components/blog/markdown'

/** In-page navigation built from the article's headings. */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null

  return (
    <nav aria-labelledby="toc-title">
      <h2 id="toc-title" className="text-sm font-medium text-text-primary">
        On this page
      </h2>
      <ol className="mt-4 space-y-2.5 border-l border-border-subtle text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-7' : 'pl-4'}>
            <a
              href={`#${h.id}`}
              className="-ml-px block border-l border-transparent leading-snug text-text-muted transition-colors hover:border-accent-primary hover:text-text-primary focus-visible:text-text-primary focus-visible:outline-none"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
