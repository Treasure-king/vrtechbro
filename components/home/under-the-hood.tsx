import { SectionHeading } from '@/components/section-heading'
import { ArchitectureDiagram } from '@/components/home/under-the-hood/architecture-diagram'
import { ScoreRing } from '@/components/home/under-the-hood/score-ring'
import { securityHeaderNotes, securityHeaders } from '@/lib/security-headers'
import { getSiteMetrics } from '@/lib/site-metrics'

/**
 * "Under the hood": how this website itself is built, using only real data —
 * live Lighthouse scores, the actual response headers and the actual stack.
 */
export async function UnderTheHood() {
  const metrics = await getSiteMetrics()

  // The CSP is the most important header, so it leads the list
  const headers = [...securityHeaders].sort((a, b) =>
    a.key === 'Content-Security-Policy' ? -1 : b.key === 'Content-Security-Policy' ? 1 : 0
  )

  const measured = metrics
    ? new Date(metrics.measuredAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : null

  return (
    <section aria-labelledby="under-the-hood-title" className="border-border-subtle border-t py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="under-the-hood-title"
          title="How this site is built"
          intro={
            metrics
              ? "The site you're reading is a working sample of our standards: rendered on the server, locked down by default and tested by Google's own tools."
              : "The site you're reading is a working sample of our standards: rendered on the server and locked down by default."
          }
        />

        {metrics && (
          <div className="border-border-subtle mb-16 rounded-2xl border p-8 md:p-10">
            <h3 className="sr-only">Lighthouse scores</h3>
            <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
              {metrics.scores.map((s) => (
                <ScoreRing key={s.id} score={s.score} label={s.label} />
              ))}
            </div>
            <p className="text-text-muted mt-8 text-center text-sm">
              Measured by Google PageSpeed Insights, mobile, {measured}. Refreshed daily.
            </p>
          </div>
        )}

        <div className="grid gap-16">
          <div className="w-full">
            <h3 className="font-display text-text-primary text-xl font-semibold tracking-tight">
              Where a request goes
            </h3>
            <p className="text-text-secondary mt-2 max-w-xl">
              Pages are built ahead of time and refreshed in the background, so most visits never wait on the
              database.
            </p>
            <div className="border-border-subtle bg-bg-secondary/40 mt-8 rounded-2xl border p-4 md:p-6">
              <ArchitectureDiagram />
            </div>
          </div>

          <div>
            <h3 className="font-display text-text-primary text-xl font-semibold tracking-tight">
              Headers on every response
            </h3>
            <p className="text-text-secondary mt-2">
              Each page is sent with these security headers. You can check them in your browser&apos;s developer
              tools, under Network.
            </p>
            <dl className="border-border-subtle mt-8 grid border-t md:grid-cols-2 md:gap-x-12">
              {headers.map((h) => (
                <div key={h.key} className="border-border-subtle border-b py-4">
                  <dt className="text-text-primary font-mono text-sm">{h.key}</dt>
                  <dd className="text-text-secondary mt-1 text-sm leading-relaxed">
                    {securityHeaderNotes[h.key] ?? h.value}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href="https://securityheaders.com/?q=vrtechbro.com&followRedirects=on"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:text-accent-hover mt-6 inline-block text-sm underline underline-offset-4"
            >
              Scan them on securityheaders.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
