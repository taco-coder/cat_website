import type { Issue } from "@/lib/issues-store";
import { IssueCard } from "@/components/issues/IssueCard";

export function IssueList({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
          No issues match these filters.
        </p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Clear filters or create a new issue to see it here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {issues.map((issue) => (
        <li key={issue.id}>
          <IssueCard issue={issue} />
        </li>
      ))}
    </ul>
  );
}
