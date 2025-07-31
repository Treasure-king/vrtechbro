// app/contact/page.tsx
import { ContactForm } from '@/components/contact-form'

export default function ContactPage() {
  return (
    <section className="max-w-5xl mx-auto py-16">
      <h1 className="text-3xl font-semibold mb-4 text-white">Get in Touch</h1>
      <ContactForm />
    </section>
  )
}
