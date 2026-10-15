import { SITE_URL } from '@/lib/constants'

export type LighthouseScore = {
  id: 'performance' | 'accessibility' | 'best-practices' | 'seo'
  label: string
  /** 0–100 */
  score: number
}

export type SiteMetrics = {
  scores: LighthouseScore[]
  /** ISO timestamp of the Lighthouse run */
  measuredAt: string
}

const CATEGORIES: { id: LighthouseScore['id']; label: string }[] = [
  { id: 'performance', label: 'Performance' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'best-practices', label: 'Best practices' },
  { id: 'seo', label: 'SEO' },
]

type PsiResponse = {
  lighthouseResult?: {
    fetchTime?: string
    categories?: Record<string, { score: number | null } | undefined>
  }
}

/**
 * Live Lighthouse scores for the production site from Google PageSpeed Insights (mobile).
 * Cached for a day. Returns null on any failure so callers can hide the block
 * instead of showing made-up numbers.
 */
export async function getSiteMetrics(): Promise<SiteMetrics | null> {
  const params = new URLSearchParams({ url: SITE_URL, strategy: 'mobile' })
  for (const c of CATEGORIES) params.append('category', c.id)
  if (process.env.PAGESPEED_API_KEY) params.set('key', process.env.PAGESPEED_API_KEY)

  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, {
      next: { revalidate: 86400 },
      // A Lighthouse run takes 15–30 s. This only runs at build time and in background
      // revalidation (never while a visitor waits), so a generous timeout is safe.
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) return null

    const data = (await res.json()) as PsiResponse
    const categories = data.lighthouseResult?.categories
    if (!categories) return null

    const scores: LighthouseScore[] = []
    for (const c of CATEGORIES) {
      const raw = categories[c.id]?.score
      if (typeof raw !== 'number') return null // incomplete run: show nothing rather than a partial set
      scores.push({ ...c, score: Math.round(raw * 100) })
    }

    return { scores, measuredAt: data.lighthouseResult?.fetchTime ?? new Date().toISOString() }
  } catch {
    return null
  }
}
