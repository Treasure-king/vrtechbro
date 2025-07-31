// app/services/[slug]/page.tsx
import { notFound } from 'next/navigation'

type ServicesMap = Record<string, string>

const services: ServicesMap = {
  'web-development': 'We build modern web apps using Next.js, React, and Node.js.',
  'mobile-apps': 'We deliver mobile solutions using React Native and Flutter.',
}

export default function ServiceDetails({ params }: { params: { slug: string } }) {
  const { slug } = params

  const serviceDescription = services[slug]

  if (!serviceDescription) return notFound()

  return (
    <section className="max-w-3xl mx-auto py-16">
      <h1 className="text-4xl font-bold capitalize">{slug.replace(/-/g, ' ')}</h1>
      <p className="mt-4 text-gray-700">{serviceDescription}</p>
    </section>
  )
}
