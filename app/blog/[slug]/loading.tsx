export default function BlogDetailLoading() {
  return (
    <div aria-busy="true" aria-label="Loading article">
      <div className="border-b border-border-subtle">
        <div className="container-page space-y-6 pt-12 pb-14 md:pt-16 md:pb-20">
          <div className="h-4 w-20 animate-pulse rounded bg-bg-tertiary" />
          <div className="h-12 w-full max-w-3xl animate-pulse rounded-xl bg-bg-secondary" />
          <div className="h-12 w-2/3 max-w-2xl animate-pulse rounded-xl bg-bg-secondary" />
          <div className="h-5 w-full max-w-xl animate-pulse rounded-lg bg-bg-tertiary" />
          <div className="flex gap-10 pt-4">
            <div className="h-9 w-24 animate-pulse rounded bg-bg-tertiary" />
            <div className="h-9 w-20 animate-pulse rounded bg-bg-tertiary" />
          </div>
        </div>
      </div>

      <div className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-12">
        <div className="max-w-[68ch] space-y-4 lg:col-span-8">
          <div className="h-5 w-full animate-pulse rounded-lg bg-bg-secondary" />
          <div className="h-5 w-full animate-pulse rounded-lg bg-bg-secondary" />
          <div className="h-5 w-4/5 animate-pulse rounded-lg bg-bg-secondary" />
          <div className="my-8 h-48 w-full animate-pulse rounded-xl border border-border-subtle bg-bg-secondary" />
          <div className="h-5 w-full animate-pulse rounded-lg bg-bg-secondary" />
          <div className="h-5 w-3/4 animate-pulse rounded-lg bg-bg-secondary" />
        </div>
        <div className="hidden space-y-3 lg:col-span-3 lg:col-start-10 lg:block">
          <div className="h-4 w-24 animate-pulse rounded bg-bg-tertiary" />
          <div className="h-4 w-40 animate-pulse rounded bg-bg-tertiary/70" />
          <div className="h-4 w-32 animate-pulse rounded bg-bg-tertiary/70" />
        </div>
      </div>
    </div>
  );
}
