export default function BlogLoading() {
  return (
    <div aria-busy="true" aria-label="Loading articles">
      <div className="border-b border-border-subtle">
        <div className="container-page space-y-6 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="h-16 w-72 animate-pulse rounded-xl bg-bg-secondary" />
          <div className="h-5 w-full max-w-xl animate-pulse rounded-lg bg-bg-tertiary" />
        </div>
      </div>

      <div className="border-b border-border-subtle">
        <div className="container-page grid gap-6 py-16 md:py-24 lg:grid-cols-12 lg:gap-12">
          <div className="h-4 w-28 animate-pulse rounded bg-bg-tertiary lg:col-span-3" />
          <div className="space-y-4 lg:col-span-9">
            <div className="h-10 w-full max-w-2xl animate-pulse rounded-xl bg-bg-secondary" />
            <div className="h-10 w-2/3 animate-pulse rounded-xl bg-bg-secondary" />
            <div className="h-5 w-full max-w-xl animate-pulse rounded-lg bg-bg-tertiary" />
          </div>
        </div>
      </div>

      <div className="container-page py-16 md:py-24">
        <div className="border-t border-border-subtle">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid gap-3 border-b border-border-subtle py-8 md:grid-cols-12 md:gap-8 md:px-4">
              <div className="h-4 w-24 animate-pulse rounded bg-bg-tertiary md:col-span-3" />
              <div className="space-y-3 md:col-span-9">
                <div className="h-6 w-4/5 animate-pulse rounded-lg bg-bg-secondary" />
                <div className="h-4 w-full max-w-lg animate-pulse rounded bg-bg-tertiary/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
