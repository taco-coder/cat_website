export default function IssuesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
