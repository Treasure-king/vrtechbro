export default function BlogLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24" aria-busy="true">
      <div className="text-center mb-14 space-y-4">
        <div className="h-10 w-64 bg-bg-secondary animate-pulse rounded-xl mx-auto" />
        <div className="h-5 w-full max-w-xl bg-bg-tertiary animate-pulse rounded-lg mx-auto" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between h-72 rounded-2xl overflow-hidden p-6 border border-border-subtle bg-bg-secondary animate-pulse space-y-4"
          >
            <div className="space-y-3">
              <div className="h-6 w-5/6 bg-bg-tertiary rounded-lg" />
              <div className="h-4 w-full bg-bg-tertiary/60 rounded" />
              <div className="h-4 w-3/4 bg-bg-tertiary/60 rounded" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-border-subtle">
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-bg-tertiary rounded-full" />
                <div className="h-5 w-16 bg-bg-tertiary rounded-full" />
              </div>
              <div className="h-4 w-20 bg-bg-tertiary rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
