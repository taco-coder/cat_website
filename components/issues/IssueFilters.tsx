"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const statuses = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
] as const;

const sorts = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
] as const;

export function IssueFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const status = searchParams.get("status") ?? "all";
  const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  function updateQuery(next: { status?: string; sort?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextStatus = next.status ?? status;
    const nextSort = next.sort ?? sort;

    if (!nextStatus || nextStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    if (!nextSort || nextSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          htmlFor="issue-status"
        >
          Status filter
        </label>
        <select
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          id="issue-status"
          onChange={(e) => updateQuery({ status: e.target.value })}
          value={status}
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          htmlFor="issue-sort"
        >
          Sort
        </label>
        <select
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          id="issue-sort"
          onChange={(e) => updateQuery({ sort: e.target.value })}
          value={sort}
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      {isPending ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Updating…</p>
      ) : null}
    </div>
  );
}
