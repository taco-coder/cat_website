"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { Issue } from "@/lib/issues-store";
import type { IssueFormState } from "@/app/(dashboard)/issues/actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600 dark:text-red-400">{message}</p>;
}

export function IssueForm({
  action,
  issue,
  submitLabel,
  onSuccess,
}: {
  action: (state: IssueFormState, payload: FormData) => Promise<IssueFormState>;
  issue?: Issue;
  submitLabel: string;
  onSuccess?: () => void;
}) {
  const [state, formAction] = useActionState(action, null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (state && "success" in state && state.success) {
      onSuccessRef.current?.();
    }
  }, [state]);

  const fieldErrors =
    state && "errors" in state ? state.errors : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1">
        <label
          className="text-sm font-medium text-zinc-800 dark:text-zinc-100"
          htmlFor="title"
        >
          Title
        </label>
        <input
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          defaultValue={issue?.title}
          id="title"
          name="title"
          required
        />
        <FieldError message={fieldErrors?.title?.[0]} />
      </div>

      <div className="space-y-1">
        <label
          className="text-sm font-medium text-zinc-800 dark:text-zinc-100"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          defaultValue={issue?.description}
          id="description"
          name="description"
        />
        <FieldError message={fieldErrors?.description?.[0]} />
      </div>

      <div className="space-y-1">
        <label
          className="text-sm font-medium text-zinc-800 dark:text-zinc-100"
          htmlFor="status"
        >
          Status
        </label>
        <select
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          defaultValue={issue?.status ?? "open"}
          id="status"
          name="status"
        >
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <FieldError message={fieldErrors?.status?.[0]} />
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
