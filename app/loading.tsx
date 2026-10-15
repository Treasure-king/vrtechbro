/** Page-level skeleton shaped like the shared PageHero, so content doesn't jump when it arrives. */
export default function GlobalLoading() {
  return (
    <div role="status" aria-live="polite" className="border-b border-border-subtle">
      <span className="sr-only">Loading page…</span>
      <div className="container-page animate-pulse pt-20 pb-16 md:pt-28 md:pb-20" aria-hidden="true">
        <div className="h-14 w-3/4 max-w-2xl rounded-lg bg-bg-tertiary md:h-20" />
        <div className="mt-8 h-4 w-full max-w-xl rounded bg-bg-tertiary" />
        <div className="mt-3 h-4 w-2/3 max-w-md rounded bg-bg-tertiary" />
      </div>
    </div>
  )
}
