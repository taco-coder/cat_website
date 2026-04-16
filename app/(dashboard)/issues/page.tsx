import { Suspense } from "react";
import Link from "next/link";
import { getBaseUrl } from "@/lib/url";
import { IssueFilters } from "@/components/issues/IssueFilters";
import { IssueList } from "@/components/issues/IssueList";
import { IssueStatsClient } from "@/components/issues/IssueStatsClient";
import type { Issue } from "@/lib/issues-store";

type IssuesPayload = { issues: Issue[] };

type SearchParams = Record<string, string | string[] | undefined>;

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;
  if (status) params.set("status", status);
  if (sort) params.set("sort", sort);
  const qs = params.toString();

  const res = await fetch(`${getBaseUrl()}/api/issues${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load issues from the Route Handler");
  }

  const data = (await res.json()) as IssuesPayload;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Issues</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            This list is rendered by a Server Component that{" "}
            <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
              fetch
            </code>
            es your own API route (see{" "}
            <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
              app/(dashboard)/issues/page.tsx
            </code>
            ).
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          href="/issues/new"
        >
          New issue
        </Link>
      </div>

      <IssueStatsClient />

      <Suspense
        fallback={
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading filters…
          </p>
        }
      >
        <IssueFilters />
      </Suspense>

      <IssueList issues={data.issues} />
    </div>
  );
}
