import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { escapeHtml, stripNewlines } from '@/lib/sanitize'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { HONEYPOT_FIELD, isHoneypotFilled } from '@/lib/honeypot'

const resend = new Resend(process.env.RESEND_API_KEY)

const enquirySchema = z.object({
  clientName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  clientEmail: z.string().email('Invalid email address').max(254, 'Email is too long'),
  clientPhone: z.string().max(30).optional(),
  serviceTitle: z.string().min(1).max(200),
  serviceId: z.string().min(1),
  projectName: z.string().min(2).max(200),
  projectDetails: z.string().min(10, 'Project details must be at least 10 characters').max(10000),
  budgetMin: z.string().max(20).optional(),
  budgetMax: z.string().max(20).optional(),
  timeDuration: z.string().min(1).max(50),
  preferredContact: z.enum(['email', 'phone', 'either']).optional(),
})

export async function POST(req: Request) {
  const ip = getClientIp(req)
  const { allowed, retryAfter } = checkRateLimit(ip, 3, 60_000)

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
    const result = enquirySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const {
      clientName,
      clientEmail,
      serviceTitle,
      projectName,
      projectDetails,
      budgetMin,
      budgetMax,
      timeDuration,
      preferredContact,
    } = result.data

    const sanitizedName = escapeHtml(clientName)
    const sanitizedEmail = escapeHtml(clientEmail)
    const sanitizedService = escapeHtml(serviceTitle)
    const sanitizedProject = escapeHtml(projectName)
    const sanitizedDetails = escapeHtml(projectDetails)
    const sanitizedBudgetMin = escapeHtml(budgetMin || '')
    const sanitizedBudgetMax = escapeHtml(budgetMax || '')
    const sanitizedDuration = escapeHtml(timeDuration.replace(/_/g, ' '))
    const sanitizedContact = escapeHtml(preferredContact || '')

    const fromAddress = process.env.EMAIL_FROM || 'VRTechBro Enquiry <onboarding@resend.dev>'

    const { error: sendError } = await resend.emails.send({
      from: fromAddress,
      to: process.env.EMAIL_TO,
      replyTo: clientEmail,
      subject: `New Enquiry from ${stripNewlines(clientName)} - ${stripNewlines(serviceTitle)}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Service Enquiry</h2>
          <p><strong>Client Name:</strong> ${sanitizedName}</p>
          <p><strong>Client Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Service Requested:</strong> ${sanitizedService}</p>
          <p><strong>Project Name:</strong> ${sanitizedProject}</p>
          <p><strong>Project Details:</strong><br/>${sanitizedDetails}</p>
          <p><strong>Budget Range:</strong> $${sanitizedBudgetMin} - $${sanitizedBudgetMax}</p>
          <p><strong>Time Duration:</strong> ${sanitizedDuration}</p>
          ${sanitizedContact ? `<p><strong>Preferred Contact Method:</strong> ${sanitizedContact}</p>` : ''}
        </div>
      `,
    })

    if (sendError) {
      console.error('Enquiry email error:', sendError)
      return NextResponse.json({ error: 'Failed to send enquiry' }, { status: 502 })
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Enquiry email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
