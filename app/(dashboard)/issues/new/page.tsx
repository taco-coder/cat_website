import Link from "next/link";
import { IssueForm } from "@/components/issues/IssueForm";
import { createIssueAction } from "@/app/(dashboard)/issues/actions";

export default function NewIssuePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
          href="/issues"
        >
          Back to issues
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New issue</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          This form posts to a{" "}
          <span className="font-medium text-zinc-800 dark:text-zinc-100">
            server action
          </span>{" "}
          that validates with Zod, mutates the in-memory store, calls{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
            revalidatePath
          </code>
          , then redirects.
        </p>
      </div>
      <IssueForm action={createIssueAction} submitLabel="Create issue" />
    </div>
  );
}
