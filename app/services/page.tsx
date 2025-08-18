'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ServiceCard } from '@/components/service-card'
import { ServiceCardProps } from '@/types/service-card'
import { iconMap } from '@/lib/helper'
import Link from 'next/link'
import Head from 'next/head'

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceCardProps[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError('Failed to load services.')
      } else {
        setServices(data || [])
      }
    }

    fetchServices()
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 text-text">
      {/* ✅ SEO Meta Tags */}
      <Head>
        <title>IT Services & Software Development Solutions | VRTechBro</title>
        <meta
          name="description"
          content="Explore full-stack IT services including SaaS development, web apps, mobile solutions, and scalable backend systems delivered by VRTechBro."
        />
        <meta
          name="keywords"
          content="IT services, software development, SaaS development, custom web apps, mobile development, scalable backend systems, Next.js developers, hire software team"
        />
        <link rel="canonical" href="https://vrtechbro.com/services" />
      </Head>

      {/* ✅ H1 */}
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
        Full-Stack IT Services & Custom Software Solutions
      </h1>

      {/* ✅ Intro Paragraph for Context */}
      <p className="text-lg text-center max-w-3xl mx-auto mb-12 text-gray-400">
        At VRTechBro, we offer a wide range of digital solutions tailored to your business goals —
        from frontend development with <strong>Next.js</strong> to powerful backend APIs, cloud integrations, mobile app builds, and scalable SaaS platforms. Whether you&apos;re a startup or an enterprise, our team delivers reliable, high-performance software across the stack.
      </p>

      {/* ✅ Services Grid */}
      {error ? (
        <p className="text-error text-center mt-10">{error}</p>
      ) : services.length === 0 ? (
        <p className="text-center text-info text-lg">No services found.</p>
      ) : (
        <section aria-labelledby="services-list" className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap]

            return (
              <ServiceCard
                key={service.id}
                title={service.title}
                slug={service.slug}
                short_description={service.short_description}
                icon={IconComponent}
                keywords={service.keywords || []}
                delay={index * 0.15}
              />
            )
          })}
        </section>
      )}

      {/* ✅ CTA Footer */}
      <div className="text-center mt-16">
        <h2 className="text-2xl font-semibold mb-4">Need help choosing the right solution?</h2>
        <p className="mb-6 text-gray-400">
          Contact our experts and discover how we can build, scale, and maintain your next digital product.
        </p>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 btn text-white font-semibold rounded-lg"
        >
          Get a Free Consultation
        </Link>
      </div>
    </main>
  )
}
