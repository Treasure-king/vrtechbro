export default function ServicesLoading() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-24" role="main" aria-busy="true">
      <div className="text-center mb-14 space-y-4">
        <div className="h-10 w-72 bg-bg-secondary animate-pulse rounded-xl mx-auto" />
        <div className="h-5 w-full max-w-2xl bg-bg-tertiary animate-pulse rounded-lg mx-auto" />
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between h-96 rounded-2xl overflow-hidden p-6 border border-border-subtle bg-bg-secondary animate-pulse space-y-4"
          >
            <div className="h-48 bg-bg-tertiary rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-3/4 bg-bg-tertiary rounded-lg" />
              <div className="h-4 w-full bg-bg-tertiary/60 rounded" />
              <div className="h-4 w-2/3 bg-bg-tertiary/60 rounded" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-bg-tertiary rounded-full" />
              <div className="h-6 w-20 bg-bg-tertiary rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
