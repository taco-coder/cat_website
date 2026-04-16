"use client";

import { useCallback, useEffect, useState } from "react";
import type { CatPost } from "@/lib/types";

type FeedResponse = {
  posts: CatPost[];
  pagination: {
    nextCursor: string | null;
    limit: number;
  };
};

type ApprovedComment = {
  id: string;
  postId: string;
  body: string;
  status: string;
  createdAt: string;
};

type PostFeedClientProps = {
  initialPosts: CatPost[];
  initialNextCursor: string | null;
};

function relativeTimeLabel(isoDate: string) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  if (filled) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        width={28}
        height={28}
        aria-hidden
      >
        <path
          fill="#ff3040"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={28}
      height={28}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function PostFeedClient({
  initialPosts,
  initialNextCursor,
}: PostFeedClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLikingPostId, setIsLikingPostId] = useState<string | null>(null);
  const [likedByMe, setLikedByMe] = useState<Record<string, boolean>>({});
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, ApprovedComment[]>
  >({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [commentSubmitting, setCommentSubmitting] = useState<string | null>(null);
  const [commentFeedback, setCommentFeedback] = useState<Record<string, string>>({});
  const [likeFeedback, setLikeFeedback] = useState<Record<string, string>>({});

  const postIdsKey = posts.map((p) => p.id).join(",");

  const syncLikedState = useCallback(async () => {
    const entries = await Promise.all(
      posts.map(async (post) => {
        const res = await fetch(`/api/posts/${post.id}/likes`, {
          cache: "no-store",
        });
        if (!res.ok) return [post.id, false] as const;
        const data = (await res.json()) as { liked?: boolean };
        return [post.id, Boolean(data.liked)] as const;
      }),
    );
    setLikedByMe((prev) => {
      const next = { ...prev };
      for (const [id, liked] of entries) {
        next[id] = liked;
      }
      return next;
    });
  }, [posts]);

  const loadCommentsForPosts = useCallback(async () => {
    const entries = await Promise.all(
      posts.map(async (post) => {
        const res = await fetch(`/api/posts/${post.id}/comments`, {
          cache: "no-store",
        });
        if (!res.ok) return [post.id, [] as ApprovedComment[]] as const;
        const data = (await res.json()) as { comments?: ApprovedComment[] };
        return [post.id, data.comments ?? []] as const;
      }),
    );
    setCommentsByPost((prev) => {
      const next = { ...prev };
      for (const [id, list] of entries) {
        next[id] = list;
      }
      return next;
    });
  }, [posts]);

  useEffect(() => {
    void syncLikedState();
  }, [syncLikedState, postIdsKey]);

  useEffect(() => {
    void loadCommentsForPosts();
  }, [loadCommentsForPosts, postIdsKey]);

  async function handleLoadMore() {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(`/api/posts?cursor=${nextCursor}&limit=3`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Could not load more posts");
      }
      const data = (await res.json()) as FeedResponse;
      setPosts((current) => [...current, ...data.posts]);
      setNextCursor(data.pagination.nextCursor);
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function handleLike(postId: string) {
    if (isLikingPostId) return;
    setIsLikingPostId(postId);
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: "POST",
      });
      const data = (await response.json()) as {
        liked?: boolean;
        duplicate?: boolean;
        post?: { id: string; heartCount: number };
        error?: string;
      };
      if (response.status === 429 && data.error) {
        setLikeFeedback((prev) => ({
          ...prev,
          [postId]: data.error ?? "Slow down a moment.",
        }));
        return;
      }
      setLikeFeedback((prev) => ({ ...prev, [postId]: "" }));
      if (data.post) {
        setPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? { ...post, heartCount: data.post?.heartCount ?? post.heartCount }
              : post,
          ),
        );
      }
      const nowLiked = Boolean(data.liked) || Boolean(data.duplicate);
      setLikedByMe((prev) => ({ ...prev, [postId]: nowLiked }));
    } finally {
      setIsLikingPostId(null);
    }
  }

  async function handleSubmitComment(postId: string) {
    const body = (commentDraft[postId] ?? "").trim();
    if (!body || commentSubmitting) return;
    setCommentSubmitting(postId);
    setCommentFeedback((prev) => ({ ...prev, [postId]: "" }));
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = (await res.json()) as {
        comment?: ApprovedComment;
        decision?: { action?: string; reasonCode?: string };
        error?: string;
      };

      if (res.status === 403) {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]:
            data.error ??
            "That comment could not be posted. Please revise and try again.",
        }));
        return;
      }
      if (res.status === 429) {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]:
            data.error ?? "You are commenting too fast. Try again in a moment.",
        }));
        return;
      }

      const status = data.comment?.status;
      if (status === "approved") {
        setCommentDraft((prev) => ({ ...prev, [postId]: "" }));
        setCommentsByPost((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] ?? []), data.comment!],
        }));
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: "Posted! Your comment is visible below.",
        }));
      } else if (status === "pending") {
        setCommentDraft((prev) => ({ ...prev, [postId]: "" }));
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]:
            "Thanks! Your comment is pending review and will appear once approved.",
        }));
      } else if (status === "rejected") {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]:
            "This comment was not published. Please remove links or offensive language.",
        }));
      } else {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: "Something went wrong. Please try again.",
        }));
      }
    } finally {
      setCommentSubmitting(null);
    }
  }

  return (
    <section className="mx-auto mt-8 max-w-3xl px-4 pb-12">
      <ul className="space-y-6">
        {posts.map((post) => (
          <li
            key={post.id}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="h-80 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-3 p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  disabled={isLikingPostId === post.id}
                  aria-pressed={likedByMe[post.id] ?? false}
                  aria-label={likedByMe[post.id] ? "Unlike" : "Like"}
                  className="-m-1 rounded-full p-1 text-zinc-800 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-200"
                >
                  <HeartIcon filled={Boolean(likedByMe[post.id])} />
                </button>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {post.heartCount}{" "}
                  {post.heartCount === 1 ? "like" : "likes"}
                </p>
              </div>
              {likeFeedback[post.id] ? (
                <p className="text-sm text-amber-700 dark:text-amber-400" role="status">
                  {likeFeedback[post.id]}
                </p>
              ) : null}
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {relativeTimeLabel(post.createdAt)}
              </p>
              <p className="text-base text-zinc-800 dark:text-zinc-100">
                {post.caption}
              </p>

              <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Comments
                </p>
                <ul className="mb-3 space-y-2">
                  {(commentsByPost[post.id] ?? []).length === 0 ? (
                    <li className="text-sm text-zinc-500 dark:text-zinc-400">
                      No comments yet. Be the first.
                    </li>
                  ) : (
                    (commentsByPost[post.id] ?? []).map((c) => (
                      <li
                        key={c.id}
                        className="text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        <span className="text-zinc-400 dark:text-zinc-500">
                          {relativeTimeLabel(c.createdAt)} ·{" "}
                        </span>
                        {c.body}
                      </li>
                    ))
                  )}
                </ul>
                <label className="sr-only" htmlFor={`comment-${post.id}`}>
                  Add a comment
                </label>
                <textarea
                  id={`comment-${post.id}`}
                  rows={2}
                  maxLength={500}
                  placeholder="Add a comment…"
                  value={commentDraft[post.id] ?? ""}
                  onChange={(e) =>
                    setCommentDraft((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  className="mb-2 w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSubmitComment(post.id)}
                    disabled={commentSubmitting === post.id}
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                  >
                    {commentSubmitting === post.id ? "Posting…" : "Post"}
                  </button>
                  <span className="text-xs text-zinc-400">
                    {(commentDraft[post.id] ?? "").length}/500
                  </span>
                </div>
                {commentFeedback[post.id] ? (
                  <p
                    className="mt-2 text-sm text-zinc-600 dark:text-zinc-400"
                    role="status"
                  >
                    {commentFeedback[post.id]}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        {nextCursor ? (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {isLoadingMore ? "Loading..." : "Load more"}
          </button>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            You have reached the end of the feed.
          </p>
        )}
      </div>
    </section>
  );
}
