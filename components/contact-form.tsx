'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Mail, Building2, Clock } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        toast.success('Message sent successfully!')
        reset()
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Server error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full mx-auto flex flex-col lg:flex-row lg:gap-10">
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-describedby="form-error" className="lg:w-1/2 space-y-5">
        <h2 className="text-2xl font-display font-bold mb-6 text-text-primary">Contact Us</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5 text-text-secondary">
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
            className="bg-bg-secondary border-border-subtle text-text-primary placeholder:text-text-muted"
            autoComplete="name"
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-error mt-1" role="alert" aria-live="assertive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-text-secondary">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
            className="bg-bg-secondary border-border-subtle text-text-primary placeholder:text-text-muted"
            autoComplete="email"
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-error mt-1" role="alert" aria-live="assertive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1.5 text-text-secondary">
            Message
          </label>
          <Textarea
            id="message"
            placeholder="What do you want to discuss?"
            rows={5}
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
            {...register('message')}
            className="bg-bg-secondary border-border-subtle text-text-primary placeholder:text-text-muted"
          />
          {errors.message && (
            <p id="message-error" className="text-sm text-error mt-1" role="alert" aria-live="assertive">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button type="submit" isLoading={loading} className="w-full" aria-live="polite" aria-busy={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </Button>

        <div id="form-error" role="alert" aria-live="assertive" className="sr-only"></div>
      </form>

      <div className="hidden lg:block w-px bg-border-subtle mx-2"></div>

      {/* Contact Info Section */}
      <section className="lg:w-1/2 mt-10 lg:mt-0 space-y-6 border-border-subtle border-t lg:border-t-0 pt-6 lg:pt-0 lg:pl-4">
        <h2 className="text-2xl font-display font-bold text-text-primary">Get in Touch</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          Have a project in mind? We&apos;d love to hear about it. Fill out the form or reach out directly.
        </p>
        <address className="not-italic space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent-primary/10">
              <Building2 className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Company</p>
              <p className="text-sm text-text-secondary">VRTECHBRO Pvt. Ltd.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent-primary/10">
              <Mail className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Email</p>
              <a href="mailto:vrtechbro@gmail.com" className="text-sm text-accent-primary hover:text-accent-hover transition-colors">
                vrtechbro@gmail.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent-primary/10">
              <Clock className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Working Hours</p>
              <p className="text-sm text-text-secondary">Mon–Fri, 9:00 AM – 6:00 PM</p>
            </div>
          </div>
        </address>
      </section>
    </div>
  )
}
