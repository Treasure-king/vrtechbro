import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { escapeHtml, stripNewlines } from '@/lib/sanitize'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { HONEYPOT_FIELD, isHoneypotFilled } from '@/lib/honeypot'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(254, 'Email is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
})

export async function POST(req: Request) {
  const ip = getClientIp(req)
  const { allowed, retryAfter } = checkRateLimit(ip, 5, 60_000)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  if (!process.env.EMAIL_TO) {
    console.error('EMAIL_TO environment variable is not configured')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  try {
    const body = await req.json()
    // Spam trap: pretend success and send nothing (see lib/honeypot.ts)
    if (isHoneypotFilled(body?.[HONEYPOT_FIELD])) {
      return NextResponse.json({ status: 'success' })
    }
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, message } = result.data

    const sanitizedName = escapeHtml(name)
    const sanitizedEmail = escapeHtml(email)
    const sanitizedMessage = escapeHtml(message)

    const fromAddress = process.env.EMAIL_FROM || 'VRTechBro Contact <onboarding@resend.dev>'

    const { error: sendError } = await resend.emails.send({
      from: fromAddress,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `New contact from ${stripNewlines(name)}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Message:</strong><br/>${sanitizedMessage}</p>
        </div>
      `,
    })

    if (sendError) {
      console.error('Send email error:', sendError)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 })
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
