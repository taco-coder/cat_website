"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Issue } from "@/lib/issues-store";
import { updateIssueDialogAction } from "@/app/(dashboard)/issues/actions";
import { IssueForm } from "@/components/issues/IssueForm";
import { statusLabel } from "@/components/issues/status-label";

const secondaryBtn =
  "inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900";

const primaryBtn =
  "inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white";

export function IssueCard({ issue }: { issue: Issue }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const router = useRouter();

  const openDialog = () => {
    setMode("view");
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleSuccess = () => {
    closeDialog();
    router.refresh();
  };

  const boundUpdate = updateIssueDialogAction.bind(null, issue.id);

  return (
    <>
      <button
        className="block w-full rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        type="button"
        onClick={openDialog}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {issue.title}
            </h2>
            {issue.description ? (
              <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
                {issue.description}
              </p>
            ) : null}
          </div>
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {statusLabel(issue.status)}
          </span>
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Created {new Date(issue.createdAt).toLocaleString()}
        </p>
      </button>

      <dialog
        ref={dialogRef}
        className="max-h-[90vh] w-[min(100%-2rem,32rem)] max-w-lg overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 [&::backdrop]:bg-zinc-950/50"
        onClose={() => setMode("view")}
      >
        {mode === "view" ? (
          <>
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {issue.title}
                </h2>
                <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  {statusLabel(issue.status)}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Created {new Date(issue.createdAt).toLocaleString()}
              </p>
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Description
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                  {issue.description || "No description provided."}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                className={primaryBtn}
                type="button"
                onClick={() => setMode("edit")}
              >
                Edit
              </button>
              <button className={secondaryBtn} type="button" onClick={closeDialog}>
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Edit issue
            </h2>
            <IssueForm
              key={issue.id}
              action={boundUpdate}
              issue={issue}
              submitLabel="Save changes"
              onSuccess={handleSuccess}
            />
            <div className="mt-4">
              <button
                className={secondaryBtn}
                type="button"
                onClick={() => setMode("view")}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
