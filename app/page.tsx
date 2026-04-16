import { listPostsPage } from "@/lib/posts-store";
import { PostFeedClient } from "@/components/feed/PostFeedClient";

export default function HomePage() {
  const { items, nextCursor } = listPostsPage(null, 3);

  return (
    <main className="pb-10">
      <header className="border-b border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-10">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Cat social
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Pixel the Cat
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Welcome to Pixel&apos;s daily adventures. Scroll for naps, zoomies,
            and the occasional judgmental stare from the windowsill.
          </p>
        </div>
      </header>

      <PostFeedClient initialPosts={items} initialNextCursor={nextCursor} />
    </main>
  );
}
