import Link from "next/link";

export default function IssueNotFound() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Issue not found</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        That id is not in the in-memory store (it may have been lost after a
        restart).
      </p>
      <Link
        className="text-sm text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
        href="/issues"
      >
        Back to issues
      </Link>
    </div>
  );
}
