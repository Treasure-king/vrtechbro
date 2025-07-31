'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ServiceCard } from '@/components/service-card'
import { ServiceCardProps } from '@/types/service-card'
import { iconMap } from '@/lib/helper'


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

  if (error) {
    return <p className="text-error text-center mt-10">{error}</p>
  }

  return (
<div className="max-w-6xl mx-auto px-6 py-12 text-text">
  <h1 className="text-4xl font-bold text-center mb-10">Our Services</h1>

  {services.length === 0 ? (
    <p className="text-center text-info text-lg">No services found.</p>
  ) : (
    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 place-items-center gap-5">
      {services.map((service, index) => {
        // service.icon is a string from DB, we map it to actual component
        const IconComponent = iconMap[service.icon as keyof typeof iconMap];

        return (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            icon={IconComponent} // ✅ Now actual component
            tags={service.tags || []}
            delay={index * 0.15}
          />
        );
      })}
    </div>
  )}
</div>

  )
}
