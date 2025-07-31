// app/portfolio/page.tsx
export default function PortfolioPage() {
  return (
    <section className="max-w-5xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6">Our Work</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded">Project A - Website for Tech Startup</div>
        <div className="p-4 border rounded">Project B - Mobile App for Healthcare</div>
      </div>
    </section>
  )
}
