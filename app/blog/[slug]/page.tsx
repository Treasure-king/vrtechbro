// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

export default function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Replace with actual post data later
  if (slug !== 'first-post') return notFound()

  return (
    <section className="max-w-3xl mx-auto py-16">
      <h1 className="text-4xl font-bold mb-2">First Blog Post</h1>
      <p className="text-gray-700">This is where your blog post content will go.</p>
    </section>
  )
}
