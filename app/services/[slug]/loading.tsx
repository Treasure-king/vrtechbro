export default function ServiceDetailLoading() {
  return (
    <div className="max-w-7xl m-auto grid lg:grid-cols-2 gap-12 items-start p-10">
      <div className="space-y-6">
        <div className="h-10 w-3/4 bg-bg-secondary animate-pulse rounded-xl" />
        <div className="flex gap-2">
          <div className="h-7 w-20 bg-bg-secondary animate-pulse rounded-full" />
          <div className="h-7 w-24 bg-bg-secondary animate-pulse rounded-full" />
          <div className="h-7 w-16 bg-bg-secondary animate-pulse rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="h-5 w-full bg-bg-secondary animate-pulse rounded-lg" />
          <div className="h-5 w-5/6 bg-bg-secondary animate-pulse rounded-lg" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-bg-tertiary animate-pulse rounded" />
          <div className="h-4 w-full bg-bg-tertiary animate-pulse rounded" />
          <div className="h-4 w-4/5 bg-bg-tertiary animate-pulse rounded" />
        </div>
        <div className="h-12 w-48 bg-bg-secondary animate-pulse rounded-xl pt-2" />
      </div>

      <div className="flex justify-center lg:justify-end">
        <div className="w-full max-w-[400px] h-[300px] bg-bg-secondary animate-pulse rounded-2xl border border-border-subtle" />
      </div>
    </div>
  );
}
