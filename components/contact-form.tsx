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
    <div className="w-full mx-auto p-8 text-white">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-6"
        >
          <h2 className="text-3xl font-bold mb-4 text-shadow-lg">Contact Us</h2>

          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <Input
              {...register('name')}
              placeholder="Your name"
              className="bg-white/10 text-white placeholder:text-gray-400"
            />
            {errors.name && (
              <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <Input
              {...register('email')}
              placeholder="you@example.com"
              className="bg-white/10 text-white placeholder:text-gray-400"
            />
            {errors.email && (
              <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Message</label>
            <Textarea
              {...register('message')}
              placeholder="What do you want to discuss?"
              rows={5}
              className="bg-white/10 text-white placeholder:text-gray-400"
            />
            {errors.message && (
              <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full btn">
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-white/20 mx-2"></div>

        {/* Contact Info */}
        <div className="flex-1 space-y-4 border-t border-white/20 pt-6 lg:border-t-0 lg:pt-0">
          <h2 className="text-3xl font-bold mb-4 text-shadow-lg">Get in Touch</h2>

          <div className="space-y-2 text-sm md:text-lg leading-relaxed font-light ">
            <p><strong className="text-white/80">Company:</strong> VRTECHBRO Pvt. Ltd.</p>
            <p><strong className="text-white/80">Email:</strong> contact@vrtechbro.com</p>
            {/* <p><strong className="text-white/80">Phone:</strong> +91 98765 43210</p> */}
            <p><strong className="text-white/80">Address:</strong> 123 Innovation Avenue, Bangalore, India</p>
            <p><strong className="text-white/80">Working Hours:</strong> Mon–Fri, 9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
