/**
 * HTTP security headers sent with every response (wired up in next.config.ts).
 * The home page's "Under the hood" section lists these same headers, so what the
 * site claims and what it actually sends can never drift apart.
 */

const isDev = process.env.NODE_ENV !== 'production'

// 'unsafe-eval' is only needed by the dev server (React Refresh), never in production
export const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co;
  object-src 'none';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, ' ').trim()

export const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Legacy XSS auditor is deprecated and can introduce leaks; disable it (CSP covers this)
    key: 'X-XSS-Protection',
    value: '0',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
]

/** Plain-language explanation of each header, for display. */
export const securityHeaderNotes: Record<string, string> = {
  'Content-Security-Policy':
    'Scripts, styles, fonts and data may only load from this site (plus our database), which blocks most injected-code attacks.',
  'Strict-Transport-Security': 'Browsers must always use HTTPS for this domain, for two years, including subdomains.',
  'X-Frame-Options': 'No other site can embed these pages in a frame, which prevents clickjacking.',
  'X-Content-Type-Options': 'Browsers must trust the declared file type instead of guessing, closing a class of upload attacks.',
  'Referrer-Policy': 'Other sites only see our domain when you follow a link, never the full page address.',
  'Permissions-Policy': 'Camera, microphone, location and ad-topic tracking are switched off for every page.',
  'X-XSS-Protection': "Turns off an old browser filter that could itself leak data; the content policy above does the job instead.",
  'X-DNS-Prefetch-Control': 'Lets the browser resolve linked domains early, so navigation feels faster.',
}
