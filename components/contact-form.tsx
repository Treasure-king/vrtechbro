'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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
    <div className="w-full mx-auto p-4 text-white flex flex-col lg:flex-row lg:gap-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-describedby="form-error" className="lg:w-1/2 space-y-6 ">
        <h2 className="text-3xl font-bold mb-6 text-shadow-lg">Contact Us</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
            className="bg-white/10 text-white placeholder:text-gray-400"
            autoComplete="name"
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-400 mt-1" role="alert" aria-live="assertive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
            className="bg-white/10 text-white placeholder:text-gray-400"
            autoComplete="email"
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-400 mt-1" role="alert" aria-live="assertive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold mb-1">
            Message
          </label>
          <Textarea
            id="message"
            placeholder="What do you want to discuss?"
            rows={5}
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
            {...register('message')}
            className="bg-white/10 text-white placeholder:text-gray-400"
          />
          {errors.message && (
            <p id="message-error" className="text-sm text-red-400 mt-1" role="alert" aria-live="assertive">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full btn" aria-live="polite" aria-busy={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </Button>

        <div id="form-error" role="alert" aria-live="assertive" className="sr-only"></div>
        {/* General form error container (optional) */}
      </form>

      <div className="hidden lg:block w-px bg-white/20 mx-2"></div>

      {/* Contact Info Section */}
      <section className="lg:w-1/2 mt-12 space-y-4 border-white/20 border-t lg:border-t-0 pt-6">
        <h2 className="text-3xl font-bold text-shadow-lg">Get in Touch</h2>
        <address className="not-italic space-y-2 text-sm md:text-lg leading-relaxed font-light">
          <p>
            <strong className="text-white/80">Company:</strong> VRTECHBRO Pvt. Ltd.
          </p>
          <p>
            <strong className="text-white/80">Email:</strong>{' '}
            <a href="mailto:vrtechbro@gmail.com" className="underline hover:text-primaryHover">
              vrtechbro@gmail.com
            </a>
          </p>
          <p>
            <strong className="text-white/80">Working Hours:</strong> Mon–Fri, 9:00 AM – 6:00 PM
          </p>
        </address>
      </section>
    </div>
  )
}
