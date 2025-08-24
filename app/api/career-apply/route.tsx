// app/api/careers/apply/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string | null;
        const position = formData.get("position") as string;
        const coverLetter = formData.get("coverLetter") as string | null;
        const resumeFile = formData.get("resume") as File | null;

        if (!name || !email || !position) {
            return NextResponse.json(
                { error: "Name, email, and position are required." },
                { status: 400 }
            );
        }

        // Convert File to Buffer for Resend attachments
        let attachments = [];
        if (resumeFile) {
            const buffer = Buffer.from(await resumeFile.arrayBuffer());

            attachments.push({
                filename: resumeFile.name, // ✅ keeps the correct name
                content: buffer.toString("base64"), // ✅ Resend needs base64
                encoding: "base64", // ✅ tell Resend it’s base64
                contentType: resumeFile.type, // ✅ e.g. application/pdf or application/vnd.openxmlformats-officedocument.wordprocessingml.document
            });
        }


        const response = await resend.emails.send({
            from: "Careers <onboarding@resend.dev>",
            to: process.env.EMAIL_TO || "your@email.com",
            subject: `New Career Application - ${position}`,
            html: `
        <h2>New Career Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Cover Letter:</strong></p>
        <p>${coverLetter || "N/A"}</p>
      `,
            attachments, // attach resume here
        });

        return NextResponse.json(
            { success: true, message: "Application sent successfully!", response },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending application:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send application." },
            { status: 500 }
        );
    }
}
