export default function GlobalLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin mb-6" />
      <div className="h-4 w-48 bg-bg-tertiary rounded animate-pulse" />
    </div>
  );
}
