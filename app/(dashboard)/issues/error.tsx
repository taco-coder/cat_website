"use client";

export default function IssuesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/60 dark:bg-red-950/40">
      <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
        Something went wrong loading issues
      </h2>
      <p className="text-sm text-red-800 dark:text-red-200">{error.message}</p>
      <button
        className="rounded-lg bg-red-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800 dark:bg-red-200 dark:text-red-950 dark:hover:bg-red-100"
        onClick={() => reset()}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
