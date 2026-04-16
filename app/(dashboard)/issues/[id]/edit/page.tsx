import Link from "next/link";
import { notFound } from "next/navigation";
import { getIssue } from "@/lib/issues-store";
import { IssueForm } from "@/components/issues/IssueForm";
import { updateIssueAction } from "@/app/(dashboard)/issues/actions";

export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = getIssue(id);
  if (!issue) {
    notFound();
  }

  const boundUpdate = updateIssueAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
          href={`/issues/${id}`}
        >
          Back to issue
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Edit issue</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Same Zod schemas as the API route, but invoked from a server action
          bound with the issue id.
        </p>
      </div>
      <IssueForm action={boundUpdate} issue={issue} submitLabel="Save changes" />
    </div>
  );
}
