export default function ServicesLoading() {
  return (
    <div aria-busy="true" aria-label="Loading services">
      <div className="border-b border-border-subtle">
        <div className="container-page space-y-6 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="h-14 w-full max-w-3xl animate-pulse rounded-xl bg-bg-secondary" />
          <div className="h-14 w-2/3 max-w-xl animate-pulse rounded-xl bg-bg-secondary" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded-lg bg-bg-tertiary" />
          <div className="flex gap-3 pt-4">
            <div className="h-12 w-48 animate-pulse rounded-xl bg-bg-secondary" />
            <div className="h-12 w-40 animate-pulse rounded-xl bg-bg-secondary" />
          </div>
        </div>
      </div>

      <div className="container-page py-20 md:py-28">
        <ul className="border-t border-border-subtle">
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              key={i}
              className="grid gap-5 border-b border-border-subtle py-8 sm:grid-cols-[1fr_9rem] md:px-4 lg:grid-cols-[1fr_11rem]"
            >
              <div className="space-y-3">
                <div className="h-8 w-64 animate-pulse rounded-lg bg-bg-secondary" />
                <div className="h-4 w-full max-w-xl animate-pulse rounded bg-bg-tertiary" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-bg-tertiary/60" />
              </div>
              <div className="hidden aspect-[4/3] animate-pulse rounded-lg bg-bg-secondary sm:block" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
