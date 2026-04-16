"use client";

import { useState } from "react";
import type { CatPost } from "@/lib/types";

type FeedResponse = {
  posts: CatPost[];
  pagination: {
    nextCursor: string | null;
    limit: number;
  };
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

export function PostFeedClient({
  initialPosts,
  initialNextCursor,
}: PostFeedClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
            <div className="space-y-2 p-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {relativeTimeLabel(post.createdAt)}
              </p>
              <p className="text-base text-zinc-800 dark:text-zinc-100">
                {post.caption}
              </p>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {post.heartCount} hearts
              </p>
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
