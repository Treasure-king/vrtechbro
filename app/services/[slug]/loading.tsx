export default function ServiceDetailLoading() {
  return (
    <div aria-busy="true" aria-label="Loading service">
      <div className="border-b border-border-subtle">
        <div className="container-page grid gap-12 pt-12 pb-16 md:pt-16 md:pb-20 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="space-y-6 lg:col-span-7">
            <div className="mb-10 h-4 w-40 animate-pulse rounded bg-bg-tertiary" />
            <div className="h-8 w-8 animate-pulse rounded-lg bg-bg-secondary" />
            <div className="h-16 w-4/5 animate-pulse rounded-xl bg-bg-secondary" />
            <div className="space-y-3">
              <div className="h-5 w-full max-w-xl animate-pulse rounded-lg bg-bg-tertiary" />
              <div className="h-5 w-2/3 max-w-md animate-pulse rounded-lg bg-bg-tertiary" />
            </div>
            <div className="flex gap-3 pt-4">
              <div className="h-12 w-56 animate-pulse rounded-xl bg-bg-secondary" />
              <div className="h-12 w-44 animate-pulse rounded-xl bg-bg-secondary" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] w-full animate-pulse rounded-2xl border border-border-subtle bg-bg-secondary" />
          </div>
        </div>
      </div>

      <div className="container-page grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-4 lg:col-span-7">
          <div className="mb-8 h-10 w-48 animate-pulse rounded-xl bg-bg-secondary" />
          <div className="h-4 w-full animate-pulse rounded bg-bg-tertiary" />
          <div className="h-4 w-full animate-pulse rounded bg-bg-tertiary" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-bg-tertiary" />
        </div>
        <div className="h-72 animate-pulse rounded-2xl border border-border-subtle bg-bg-secondary/50 lg:col-span-5" />
      </div>
    </div>
  )
}
