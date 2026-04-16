"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createIssueSchema, updateIssueSchema } from "@/lib/schemas";
import {
  createIssue as insertIssue,
  updateIssue as patchIssue,
  getIssue,
} from "@/lib/issues-store";

export type IssueFormState =
  | {
      errors?: {
        title?: string[];
        description?: string[];
        status?: string[];
      };
    }
  | { success: true }
  | null;

type FieldErrors = NonNullable<
  Extract<IssueFormState, { errors?: unknown }>["errors"]
>;

function tryUpdateIssueFromForm(
  id: string,
  formData: FormData,
): { ok: true } | { ok: false; errors: FieldErrors } {
  const existing = getIssue(id);
  if (!existing) {
    return { ok: false, errors: { title: ["Issue not found"] } };
  }

  const parsed = updateIssueSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  patchIssue(id, {
    title: parsed.data.title,
    description: parsed.data.description ?? "",
    status: parsed.data.status,
  });

  return { ok: true };
}

export async function createIssueAction(
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const parsed = createIssueSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  insertIssue({
    title: parsed.data.title,
    description: parsed.data.description ?? "",
    status: parsed.data.status,
  });

  revalidatePath("/issues");
  redirect("/issues");
}

export async function updateIssueAction(
  id: string,
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const result = tryUpdateIssueFromForm(id, formData);
  if (!result.ok) {
    return { errors: result.errors };
  }

  revalidatePath("/issues");
  revalidatePath(`/issues/${id}`);
  redirect(`/issues/${id}`);
}

export async function updateIssueDialogAction(
  id: string,
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const result = tryUpdateIssueFromForm(id, formData);
  if (!result.ok) {
    return { errors: result.errors };
  }

  revalidatePath("/issues");
  revalidatePath(`/issues/${id}`);
  return { success: true };
}
