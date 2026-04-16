"use server";

import { revalidatePath } from "next/cache";
import { appendAuditEvent } from "@/lib/audit-log-store";
import { createNotification } from "@/lib/admin-notifications-store";
import { updateCommentStatus } from "@/lib/comments-store";
import { createPost, deletePost, updatePost } from "@/lib/posts-store";

function readFormValue(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export async function createPostAction(formData: FormData) {
  const imageUrl = readFormValue(formData, "imageUrl");
  const caption = readFormValue(formData, "caption");

  if (!imageUrl || !caption) return;

  createPost({ imageUrl, caption });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updatePostAction(formData: FormData) {
  const id = readFormValue(formData, "id");
  const imageUrl = readFormValue(formData, "imageUrl");
  const caption = readFormValue(formData, "caption");
  if (!id || !imageUrl || !caption) return;

  updatePost(id, { imageUrl, caption });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deletePostAction(formData: FormData) {
  const id = readFormValue(formData, "id");
  if (!id) return;

  deletePost(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

async function updateCommentModeration(
  formData: FormData,
  status: "approved" | "rejected" | "deleted",
  action: "approve" | "reject" | "delete",
) {
  const commentId = readFormValue(formData, "commentId");
  const reason = readFormValue(formData, "reason") || "manual moderation";
  if (!commentId) return;

  const updated = updateCommentStatus(commentId, status, reason, "admin");
  if (!updated) return;

  appendAuditEvent({
    action,
    actor: "admin",
    entityType: "comment",
    entityId: commentId,
    reason,
  });

  createNotification({
    level: status === "approved" ? "info" : "warning",
    title: `Comment ${status}`,
    message: `Comment ${commentId.slice(0, 8)} moved to ${status}.`,
  });

  revalidatePath("/admin");
}

export async function approveCommentAction(formData: FormData) {
  await updateCommentModeration(formData, "approved", "approve");
}

export async function rejectCommentAction(formData: FormData) {
  await updateCommentModeration(formData, "rejected", "reject");
}

export async function deleteCommentAction(formData: FormData) {
  await updateCommentModeration(formData, "deleted", "delete");
}
