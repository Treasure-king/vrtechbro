import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

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
  } = body;

  try {
    const data = await resend.emails.send({
      from: 'Enquiry Form <onboarding@resend.dev>',
      to: process.env.EMAIL_TO || 'your@email.com',
      subject: `New Enquiry from ${clientName} - ${serviceTitle}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Service Enquiry</h2>
          <p><strong>Client Name:</strong> ${clientName}</p>
          <p><strong>Client Email:</strong> ${clientEmail}</p>
          <p><strong>Service Requested:</strong> ${serviceTitle}</p>
          <p><strong>Project Name:</strong> ${projectName}</p>
          <p><strong>Project Details:</strong><br/>${projectDetails}</p>
          <p><strong>Budget Range:</strong> $${budgetMin} - $${budgetMax}</p>
          <p><strong>Time Duration:</strong> ${timeDuration.replaceAll('_', ' ')}</p>
          ${
            preferredContact
              ? `<p><strong>Preferred Contact Method:</strong> ${preferredContact}</p>`
              : ''
          }
        </div>
      `,
    });

    return NextResponse.json({ status: 'success', data });
  } catch (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ status: 'error', error }, { status: 500 });
  }
}
