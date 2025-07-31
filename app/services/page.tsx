'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { ServiceCard } from '@/components/service-card'
import {
  Code,
  Smartphone,
  BrainCircuit,
  Cloud,
  Search,
  UserPen,
  Earth,
  ShoppingCart,
  Bot,
} from 'lucide-react'
import { Icon } from 'next/dist/lib/metadata/types/metadata-types'

const iconMap = {
  Code,
  Smartphone,
  BrainCircuit,
  Cloud,
  Search,
  UserPen,
  Earth,
  ShoppingCart,
  Bot
}

type Service = {
  id: string
  title: string
  description: string
  slug: string
  icon:Icon
  tags:string[]
  created_at: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
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
            const IconComponent = iconMap[service.icon as keyof typeof iconMap];

            return (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={IconComponent}
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
