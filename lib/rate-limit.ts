/**
 * Simple in-memory IP rate limiter for API routes.
 * Note: state is per server instance; on serverless hosts this is best-effort only.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const MAX_TRACKED_IPS = 10_000

/** Extracts the client IP, using the first (client) entry of x-forwarded-for. */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

function pruneExpired(now: number) {
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) rateLimitMap.delete(key)
  }
}

export function checkRateLimit(
  ip: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  if (rateLimitMap.size > MAX_TRACKED_IPS) pruneExpired(now)

  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    }
  }

  entry.count++
  return { allowed: true }
}
