"use client";

import { useQuery } from "@tanstack/react-query";

type IssuesResponse = { issues: { id: string }[] };

async function fetchIssueCount(): Promise<number> {
  const res = await fetch("/api/issues", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch issues");
  }
  const data = (await res.json()) as IssuesResponse;
  return data.issues.length;
}

export function IssueStatsClient() {
  const { data, error, isFetching, isPending } = useQuery({
    queryKey: ["issues", "count"],
    queryFn: fetchIssueCount,
    refetchInterval: 15_000,
  });

  if (isPending) {
    return (
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Client fetch: loading issue count…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-xs text-red-600 dark:text-red-400">
        Client fetch failed (open devtools Network tab).
      </p>
    );
  }

  return (
    <p className="text-xs text-zinc-600 dark:text-zinc-300">
      Client island (TanStack Query):{" "}
      <span className="font-semibold text-zinc-900 dark:text-zinc-50">
        {data}
      </span>{" "}
      issues total
      {isFetching ? <span className="text-zinc-500"> (refreshing…)</span> : null}
      . Refetches every 15s to contrast with the Server Component list fetch.
    </p>
  );
}
