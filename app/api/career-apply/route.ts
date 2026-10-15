import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { escapeHtml, sanitizeFilename, stripNewlines } from '@/lib/sanitize'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const resend = new Resend(process.env.RESEND_API_KEY)

const careerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(254, 'Email is too long'),
  position: z.string().min(1, 'Position is required').max(200, 'Position is too long'),
  phone: z.string().max(30).nullable().optional(),
  coverLetter: z.string().max(10000).nullable().optional(),
})

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

// Magic bytes: PDF (%PDF), legacy DOC (OLE2 container), DOCX (ZIP container)
const FILE_SIGNATURES = [
  [0x25, 0x50, 0x44, 0x46],
  [0xd0, 0xcf, 0x11, 0xe0],
  [0x50, 0x4b, 0x03, 0x04],
]

function hasAllowedSignature(buffer: Buffer): boolean {
  return FILE_SIGNATURES.some((sig) => sig.every((byte, i) => buffer[i] === byte))
}

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
    const formData = await req.formData()

    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      position: formData.get('position') as string,
      phone: formData.get('phone') as string | null,
      coverLetter: formData.get('coverLetter') as string | null,
    }

    const result = careerSchema.safeParse(rawData)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, position, phone, coverLetter } = result.data
    const resumeFile = formData.get('resume') as File | null

    // Validate file upload if provided
    if (resumeFile && resumeFile.size > 0) {
      if (resumeFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'Resume file is too large (maximum 5MB allowed)' },
          { status: 400 }
        )
      }

      if (!ALLOWED_FILE_TYPES.includes(resumeFile.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only PDF and Word documents (PDF, DOC, DOCX) are allowed.' },
          { status: 400 }
        )
      }
    }

    const sanitizedName = escapeHtml(name)
    const sanitizedEmail = escapeHtml(email)
    const sanitizedPosition = escapeHtml(position)
    const sanitizedPhone = escapeHtml(phone || 'N/A')
    const sanitizedCoverLetter = escapeHtml(coverLetter || 'N/A')

    const attachments = []
    if (resumeFile && resumeFile.size > 0) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer())

      // The browser-supplied MIME type is untrusted; check the file's real signature
      if (!hasAllowedSignature(buffer)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only PDF and Word documents (PDF, DOC, DOCX) are allowed.' },
          { status: 400 }
        )
      }

      attachments.push({
        filename: sanitizeFilename(resumeFile.name, 'resume'),
        content: buffer.toString('base64'),
        contentType: resumeFile.type,
      })
    }

    const fromAddress = process.env.EMAIL_FROM || 'VRTechBro Careers <onboarding@resend.dev>'

    const { error: sendError } = await resend.emails.send({
      from: fromAddress,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `New Career Application - ${stripNewlines(position)}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Career Application</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Phone:</strong> ${sanitizedPhone}</p>
          <p><strong>Position:</strong> ${sanitizedPosition}</p>
          <p><strong>Cover Letter:</strong></p>
          <p>${sanitizedCoverLetter}</p>
        </div>
      `,
      attachments,
    })

    if (sendError) {
      console.error('Error sending application:', sendError)
      return NextResponse.json(
        { success: false, error: 'Failed to send application.' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Application sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send application.' },
      { status: 500 }
    )
  }
}
