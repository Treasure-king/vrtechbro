import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs/config'
import { securityHeaders } from './lib/security-headers'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimised variants are cached for 31 days; source files change rarely
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

// Sentry's build step. Everything account-specific comes from environment
// variables set in Vercel (see README → "Error tracking"); without
// SENTRY_AUTH_TOKEN the build still works, it just skips uploading source maps.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Only print upload logs in CI
  silent: !process.env.CI,
  // Upload more source maps so stack traces point at readable code
  widenClientFileUpload: true,
  // Browser error reports go to /sentry-tunnel on this domain, then on to
  // Sentry: no CSP change needed, and ad blockers don't drop them.
  // (proxy.ts only matches /admin, so it never intercepts this route.)
  tunnelRoute: '/sentry-tunnel',
})
