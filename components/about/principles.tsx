// Drawn from research/philosophy.md — keep the two in sync
const PRINCIPLES = [
  {
    title: 'Substance over spectacle',
    body: 'Every feature, animation and section has to earn its place. If it does not help the person using it, it does not ship.',
  },
  {
    title: 'Show, don’t tell',
    body: 'We would rather show working software, real screenshots and live links than describe ourselves with adjectives.',
  },
  {
    title: 'Performance is a feature',
    body: 'Optimised images, server rendering and lean JavaScript by default, because a slow product loses people before it says anything.',
  },
  {
    title: 'Security is non-negotiable',
    body: 'Server-side validation, rate limiting, hardened headers and locked-down database access, even for a simple contact form.',
  },
  {
    title: 'SEO is part of the architecture',
    body: 'Structured data, clean URLs, metadata and sitemaps are planned from the start, not bolted on before launch.',
  },
  {
    title: 'Accessibility is respect',
    body: 'Keyboard support, readable contrast, reduced-motion options and screen reader labels, so the product works for everyone.',
  },
]

/** Studio principles as a two-column ruled list rather than cards. */
export function Principles() {
  return (
    <dl className="grid border-t border-border-subtle md:grid-cols-2 md:gap-x-16">
      {PRINCIPLES.map((p) => (
        <div key={p.title} className="border-b border-border-subtle py-8">
          <dt className="font-display text-xl font-semibold tracking-tight text-text-primary">{p.title}</dt>
          <dd className="mt-3 max-w-prose leading-relaxed text-text-secondary">{p.body}</dd>
        </div>
      ))}
    </dl>
  )
}
