// import { Resend } from 'resend'
// import { NextResponse } from 'next/server'

// const resend = new Resend(process.env.RESEND_API_KEY)

// export async function POST(req: Request) {
//   const body = await req.json()
//   const { name, email, message } = body

//   try {
//     const data = await resend.emails.send({
//       from: 'Contact Form <onboarding@resend.dev>',
//       to: process.env.EMAIL_TO || 'your@email.com',
//       subject: `New contact from ${name}`,
//       html: `<p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`,
//     })

//     return NextResponse.json({ status: 'success', data })
//   } catch (error) {
//     return NextResponse.json({ error }, { status: 500 })
//   }
// }
