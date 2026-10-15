export default function BlogDetailLoading() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24" aria-busy="true">
      <div className="space-y-6">
        <div className="h-6 w-32 bg-bg-secondary animate-pulse rounded-full" />
        <div className="h-12 w-full max-w-2xl bg-bg-secondary animate-pulse rounded-xl" />
        <div className="flex items-center space-x-6">
          <div className="h-4 w-28 bg-bg-tertiary animate-pulse rounded" />
          <div className="h-4 w-20 bg-bg-tertiary animate-pulse rounded" />
        </div>
      </div>

      <div className="space-y-4 mt-12">
        <div className="h-5 w-full bg-bg-secondary animate-pulse rounded-lg" />
        <div className="h-5 w-full bg-bg-secondary animate-pulse rounded-lg" />
        <div className="h-5 w-4/5 bg-bg-secondary animate-pulse rounded-lg" />
        <div className="h-48 w-full bg-bg-secondary animate-pulse rounded-2xl my-8 border border-border-subtle" />
        <div className="h-5 w-full bg-bg-secondary animate-pulse rounded-lg" />
        <div className="h-5 w-3/4 bg-bg-secondary animate-pulse rounded-lg" />
      </div>
    </main>
  );
}
