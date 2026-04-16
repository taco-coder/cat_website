import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/url";
import type { Issue } from "@/lib/issues-store";
import { statusLabel } from "@/components/issues/status-label";

type IssuePayload = { issue: Issue };

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${getBaseUrl()}/api/issues/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to load issue");
  }

  const data = (await res.json()) as IssuePayload;
  const issue = data.issue;

  return (
    <article className="space-y-6">
      <div className="space-y-2">
        <Link
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
          href="/issues"
        >
          Back to issues
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{issue.title}</h1>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {statusLabel(issue.status)}
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Created {new Date(issue.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Description
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
          {issue.description || "No description provided."}
        </p>
      </div>

      <Link
        className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        href={`/issues/${issue.id}/edit`}
      >
        Edit issue
      </Link>
    </article>
  );
}
