import Link from 'next/link'

/*
 * Minimal, safe Markdown renderer for blog posts stored in Supabase.
 * Everything renders as React text nodes (never raw HTML), and link targets
 * are restricted to http(s), mailto, site-relative paths and in-page anchors.
 */

export type Heading = { id: string; text: string; level: 2 | 3 }

const stripInline = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*]/g, '')
    .trim()

const slugify = (text: string) =>
  stripInline(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'section'

/** Assigns stable, unique ids to headings in document order. */
function createIdFactory() {
  const seen = new Map<string, number>()
  return (text: string) => {
    const base = slugify(text)
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  }
}

/** Lists the ## and ### headings of a post, with the same ids the renderer gives them. */
export function extractHeadings(content: string | null | undefined): Heading[] {
  if (!content) return []
  const nextId = createIdFactory()
  const headings: Heading[] = []
  let inCode = false

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      inCode = !inCode
      continue
    }
    if (inCode) continue
    const match = trimmed.match(/^(#{2,4})\s+(.+)$/)
    if (!match) continue
    const id = nextId(match[2])
    const level = match[1].length
    if (level === 2 || level === 3) headings.push({ id, text: stripInline(match[2]), level })
  }
  return headings
}

/** Estimated reading time at ~225 words per minute (minimum one minute). */
export function readingTime(content: string | null | undefined): number {
  if (!content) return 1
  const words = content.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 225))
}

function safeHref(href: string): string | null {
  const value = href.trim()
  if (/^(https?:|mailto:)/i.test(value)) return value
  if (value.startsWith('/') && !value.startsWith('//')) return value
  if (value.startsWith('#')) return value
  return null
}

// Inline formatting parser (links, code, bold, italic)
function parseInline(text: string): React.ReactNode[] {
  const pattern = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g

  return text.split(pattern).map((part, index) => {
    if (!part) return null

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      const href = safeHref(linkMatch[2])
      if (!href) return linkMatch[1]
      const className =
        'text-accent-primary underline decoration-accent-primary/40 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent-hover'
      return href.startsWith('/') || href.startsWith('#') ? (
        <Link key={index} href={href} className={className}>
          {linkMatch[1]}
        </Link>
      ) : (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {linkMatch[1]}
        </a>
      )
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="rounded border border-border-subtle bg-bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] text-text-primary"
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      )
    }

    return part
  })
}

/** Block-level renderer: headings, paragraphs, lists, code blocks, quotes and rules. */
export function Markdown({ content }: { content: string | null | undefined }) {
  if (!content) return null

  const nextId = createIdFactory()
  const nodes: React.ReactNode[] = []
  let inCodeBlock = false
  let codeLang = ''
  let codeLines: string[] = []
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null

  const flushList = () => {
    if (!list) return
    const ListTag = list.type
    nodes.push(
      <ListTag
        key={`list-${nodes.length}`}
        className={`my-6 space-y-2 pl-6 marker:text-text-muted ${list.type === 'ul' ? 'list-disc' : 'list-decimal'}`}
      >
        {list.items.map((item, idx) => (
          <li key={idx} className="pl-1">
            {parseInline(item)}
          </li>
        ))}
      </ListTag>
    )
    list = null
  }

  for (const line of content.split('\n')) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      flushList()
      if (inCodeBlock) {
        nodes.push(
          <figure key={`code-${nodes.length}`} className="my-8 overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary">
            {codeLang && (
              <figcaption className="border-b border-border-subtle px-4 py-2 font-mono text-xs text-text-muted">
                {codeLang}
              </figcaption>
            )}
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-text-primary">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </figure>
        )
        codeLines = []
        codeLang = ''
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeLang = trimmed.slice(3).trim()
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const item = trimmed.replace(/^[-*]\s+/, '')
      if (list?.type === 'ul') list.items.push(item)
      else {
        flushList()
        list = { type: 'ul', items: [item] }
      }
      continue
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/)
    if (olMatch) {
      if (list?.type === 'ol') list.items.push(olMatch[1])
      else {
        flushList()
        list = { type: 'ol', items: [olMatch[1]] }
      }
      continue
    }

    flushList()

    const heading = trimmed.match(/^(#{2,4})\s+(.+)$/)
    if (heading) {
      const id = nextId(heading[2])
      const text = parseInline(heading[2])
      const level = heading[1].length
      if (level === 2) {
        nodes.push(
          <h2
            key={id}
            id={id}
            className="mt-14 mb-4 scroll-mt-28 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            {text}
          </h2>
        )
      } else if (level === 3) {
        nodes.push(
          <h3 key={id} id={id} className="mt-10 mb-3 scroll-mt-28 font-display text-xl font-semibold tracking-tight text-text-primary">
            {text}
          </h3>
        )
      } else {
        nodes.push(
          <h4 key={id} id={id} className="mt-8 mb-2 scroll-mt-28 font-display text-lg font-semibold text-text-primary">
            {text}
          </h4>
        )
      }
    } else if (trimmed.startsWith('>')) {
      nodes.push(
        <blockquote
          key={`quote-${nodes.length}`}
          className="my-8 border-l-2 border-accent-primary pl-5 text-xl leading-relaxed text-text-primary"
        >
          {parseInline(trimmed.replace(/^>\s*/, ''))}
        </blockquote>
      )
    } else if (trimmed === '---') {
      nodes.push(<hr key={`hr-${nodes.length}`} className="my-12 border-border-subtle" />)
    } else if (trimmed !== '' && !trimmed.startsWith('# ')) {
      nodes.push(
        <p key={`p-${nodes.length}`} className="my-5">
          {parseInline(trimmed)}
        </p>
      )
    }
  }

  flushList()
  return <>{nodes}</>
}
