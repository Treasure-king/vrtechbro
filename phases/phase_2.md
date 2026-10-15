# Phase 2: 🔒 Security Hardening

> **Goal:** Take the site from zero security posture to A+ grade — covering HTTP headers, input validation, rate limiting, sanitization, and Supabase RLS verification.
>
> **Estimated Tasks:** 10
> **Depends On:** Phase 1 (Architecture Repair)

---

## Why This Phase

The current site has **no security headers**, **no server-side validation**, **no rate limiting**, **no input sanitization**, and sends emails from a test address. Anyone can spam the API, inject XSS payloads via contact forms, or clickjack the site. For a company selling enterprise software, this is unacceptable.

---

## Task 2.1 — Add Security Headers in `next.config.ts`

### Problem
`next.config.ts` is completely empty. No security headers are configured.

### How to Fix
Configure comprehensive headers in `next.config.ts`:

```ts
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

> **Note:** CSP will be added separately as it requires careful tuning for inline scripts, Supabase, Resend, Google Analytics, etc.

### Verification
- [ ] Run `curl -I https://www.vrtechbro.com` — all headers present
- [ ] Test at https://securityheaders.com — target A grade minimum
- [ ] Site still functions normally (no blocked resources)

---

## Task 2.2 — Add Server-Side Validation to Contact Email API

### Problem
`app/api/send-email/route.ts` accepts `name`, `email`, `message` from the request body with **zero validation**. The client validates with Zod, but anyone can call the API directly with curl and send whatever they want.

### How to Fix

```ts
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  message: z.string().min(10).max(5000),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, message } = result.data

    // Sanitize inputs before HTML interpolation (see Task 2.4)
    const data = await resend.emails.send({
      from: 'Contact Form <contact@vrtechbro.com>', // Use custom domain
      to: process.env.EMAIL_TO!,
      subject: `New contact from ${escapeHtml(name)}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
             <p><strong>Email:</strong> ${escapeHtml(email)}</p>
             <p><strong>Message:</strong><br/>${escapeHtml(message)}</p>`,
    })

    return NextResponse.json({ status: 'success', data })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Verification
- [ ] Sending a valid request works
- [ ] Sending an empty body returns 400
- [ ] Sending an invalid email returns 400
- [ ] Sending a message < 10 chars returns 400

---

## Task 2.3 — Add Server-Side Validation to Enquiry Email API

### Problem
Same as 2.2 — `app/api/enquiry-email/route.ts` trusts client input blindly.

### How to Fix
Add the same Zod schema that `ServiceOverlay.tsx` uses on the client, but on the server:

```ts
const enquirySchema = z.object({
  clientName: z.string().min(2).max(100),
  clientEmail: z.string().email().max(254),
  clientPhone: z.string().optional(),
  serviceTitle: z.string().min(1).max(200),
  serviceId: z.string().min(1),
  projectName: z.string().min(2).max(200),
  projectDetails: z.string().min(10).max(10000),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  timeDuration: z.enum([
    'less_than_1_month', '1_to_3_months', '3_to_6_months',
    '6_to_12_months', 'more_than_1_year'
  ]),
  preferredContact: z.enum(['email', 'phone', 'either']).optional(),
})
```

Validate before processing. Sanitize all string values before HTML interpolation.

### Verification
- [ ] Valid enquiry submits successfully
- [ ] Invalid data returns 400 with details

---

## Task 2.4 — Add HTML Sanitization Utility

### Problem
All API routes interpolate user input directly into HTML email bodies. This is an XSS vector — if the email client renders HTML, malicious scripts could execute.

### How to Fix

Create a shared utility `lib/sanitize.ts`:

```ts
/**
 * Escapes HTML special characters to prevent XSS in email templates.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
```

Use `escapeHtml()` in all three API routes wherever user input is interpolated into HTML.

### Verification
- [ ] Submit a contact form with `<script>alert('xss')</script>` in the message
- [ ] Check the sent email — the script tags should be escaped, not executable
- [ ] All three API routes use `escapeHtml()`

---

## Task 2.5 — Add Rate Limiting to API Routes

### Problem
All three API routes have zero rate limiting. Anyone can send thousands of requests per second, burning the Resend API quota and enabling email spam/abuse.

### How to Fix

Create a simple in-memory rate limiter `lib/rate-limit.ts`:

```ts
const rateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  ip: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) }
  }

  entry.count++
  return { allowed: true }
}
```

Apply to each API route:

```ts
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const { allowed, retryAfter } = checkRateLimit(ip, 5, 60_000)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  // ... rest of handler
}
```

### Rate Limits
| Route | Max Requests | Window |
|---|---|---|
| `/api/send-email` | 5 per IP | 60 seconds |
| `/api/enquiry-email` | 3 per IP | 60 seconds |
| `/api/career-apply` | 3 per IP | 60 seconds |

### Verification
- [ ] Send 6 requests rapidly to `/api/send-email` — 6th returns 429
- [ ] Wait 60 seconds — requests work again
- [ ] `Retry-After` header is present on 429 responses

---

## Task 2.6 — Add Server-Side Validation to Career Apply API

### Problem
`app/api/career-apply/route.tsx` validates `name`, `email`, `position` but doesn't validate file type or size on the server.

### How to Fix
1. Add Zod validation for text fields
2. Add file validation:
   - Max file size: 5MB
   - Allowed types: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
3. Rename file from `.tsx` to `.ts` (API routes don't use JSX)
4. Add `escapeHtml()` to all string interpolations
5. Add rate limiting

```ts
// File validation
if (resumeFile) {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (resumeFile.size > maxSize) {
    return NextResponse.json({ error: 'Resume file too large (max 5MB)' }, { status: 400 })
  }

  if (!allowedTypes.includes(resumeFile.type)) {
    return NextResponse.json({ error: 'Invalid file type (PDF or DOC only)' }, { status: 400 })
  }
}
```

### Verification
- [ ] Upload a valid PDF — succeeds
- [ ] Upload a 10MB file — returns 400
- [ ] Upload a `.exe` file — returns 400
- [ ] Missing required fields — returns 400

---

## Task 2.7 — Fix Resend Sender Address

### Problem
All three API routes send emails from `onboarding@resend.dev` — the default Resend sandbox address. In production:
- Emails may land in spam
- The sender doesn't represent the brand
- Some email providers may reject them entirely

### How to Fix
1. In Resend dashboard: Verify the domain `vrtechbro.com` (add DNS records)
2. Update sender addresses:
   - Contact form: `Contact Form <contact@vrtechbro.com>`
   - Enquiry form: `Enquiry <enquiry@vrtechbro.com>`
   - Career form: `Careers <careers@vrtechbro.com>`
3. Remove `'your@email.com'` fallback — use `process.env.EMAIL_TO!` (non-null assertion, must be configured)

> **Note:** If domain verification isn't possible yet, use `noreply@vrtechbro.com` as the sender with Resend's domain verification.

### Verification
- [ ] Emails arrive from `@vrtechbro.com` domain
- [ ] Emails don't land in spam
- [ ] No `'your@email.com'` or `'onboarding@resend.dev'` in code

---

## Task 2.8 — Remove Fallback Email Addresses

### Problem
All API routes have `process.env.EMAIL_TO || 'your@email.com'` — the fallback is a placeholder that would send real user data to a nonexistent email.

### How to Fix
1. Remove the fallback: `to: process.env.EMAIL_TO!`
2. Add a guard at the top of each route:

```ts
if (!process.env.EMAIL_TO) {
  console.error('EMAIL_TO environment variable is not configured')
  return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
}
```

### Verification
- [ ] `grep -r "your@email.com" app/` returns zero results
- [ ] API routes fail gracefully if `EMAIL_TO` is not set

---

## Task 2.9 — Verify Supabase Row Level Security

### Problem
`lib/supabase.ts` creates a client-side Supabase client with anon key. This client is used in `'use client'` components. Without proper RLS, anyone could:
- Read all data from any table
- Write/update/delete data
- Access tables not intended for public use

### How to Fix
This is a Supabase dashboard task — verify in the Supabase dashboard:

1. **`services` table:**
   - Enable RLS ✅
   - Policy: `SELECT` allowed for `anon` role (public read)
   - Policy: No `INSERT`, `UPDATE`, `DELETE` for `anon`

2. **`blogs` table:**
   - Same as services — public read only

3. **Any other tables** (contacts, enquiries, etc.):
   - Should NOT be accessible from the anon client
   - `INSERT` only if the contact form needs to store submissions

### Verification
- [ ] From browser console, try: `supabase.from('services').delete().neq('id', '')` — should fail
- [ ] From browser console, try: `supabase.from('services').insert({...})` — should fail
- [ ] Public `SELECT` still works for services and blogs

---

## Task 2.10 — Add Content Security Policy (CSP)

### Problem
No CSP header is configured, allowing any script, style, or iframe to load on the site.

### How to Fix
Add CSP to the security headers in `next.config.ts`. This must be carefully tuned to allow:
- Inline styles (Tailwind generates them)
- Supabase connections
- Resend (API only, server-side)
- Google Analytics (if added in Phase 4)
- Google Fonts (via next/font — usually self-hosted, but verify)

```ts
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // TODO: tighten with nonces in Phase 6
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
}
```

> **Important:** Start with `Content-Security-Policy-Report-Only` first to identify violations without breaking the site. Switch to enforcing after testing.

### Verification
- [ ] No console errors about CSP violations
- [ ] All resources load correctly
- [ ] SecurityHeaders.com shows CSP is present
- [ ] Target: A+ grade on securityheaders.com

---

## Phase 2 — Final Verification Checklist

- [ ] SecurityHeaders.com grade: **A+**
- [ ] All three API routes validate input with Zod
- [ ] All three API routes sanitize HTML output
- [ ] All three API routes have rate limiting
- [ ] File uploads validated for type and size
- [ ] No `'your@email.com'` or `'onboarding@resend.dev'` in code
- [ ] Supabase RLS verified for all tables
- [ ] `npm run build` succeeds
- [ ] All forms still work end-to-end
- [ ] CSP header present (report-only or enforcing)
