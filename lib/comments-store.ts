import type { CatComment, ModerationState } from "@/lib/types";

type GlobalComments = typeof globalThis & {
  __commentsStore?: CatComment[];
};

function store() {
  const globalStore = globalThis as GlobalComments;
  if (!globalStore.__commentsStore) {
    globalStore.__commentsStore = [];
  }
  return globalStore.__commentsStore;
}

export function createComment(
  input: Omit<CatComment, "id" | "createdAt"> & { status?: ModerationState },
) {
  const comment: CatComment = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: input.status ?? "pending",
    ...input,
  };
  store().unshift(comment);
  return comment;
}

export function listCommentsForPost(postId: string, status: ModerationState = "approved") {
  return store().filter((comment) => comment.postId === postId && comment.status === status);
}

export function listPendingComments() {
  return store().filter((comment) => comment.status === "pending");
}

export function updateCommentStatus(
  commentId: string,
  status: ModerationState,
  moderationReason: string,
  moderatedBy = "admin",
) {
  const comments = store();
  const idx = comments.findIndex((comment) => comment.id === commentId);
  if (idx === -1) return undefined;
  comments[idx] = {
    ...comments[idx],
    status,
    moderationReason,
    moderatedBy,
    moderatedAt: new Date().toISOString(),
  };
  return comments[idx];
}

export function moderationStats() {
  const comments = store();
  return {
    total: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
    deleted: comments.filter((c) => c.status === "deleted").length,
  };
}
