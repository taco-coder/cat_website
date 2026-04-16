import { listPosts } from "@/lib/posts-store";
import {
  createPostAction,
  deletePostAction,
  updatePostAction,
} from "./actions";

export default function AdminDashboardPage() {
  const posts = listPosts();

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <section className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Admin dashboard
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Manage cat posts and captions.
          </p>
        </div>
        <form action="/api/admin/auth/logout" method="post">
          <button
            type="submit"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Log out
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Create new post
        </h2>
        <form action={createPostAction} className="grid gap-3 md:grid-cols-2">
          <input
            required
            name="imageUrl"
            placeholder="Image URL"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <input
            required
            name="caption"
            placeholder="Caption"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white md:col-span-2 md:w-fit"
          >
            Create post
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Existing posts
        </h2>
        {posts.map((post) => (
          <article
            key={post.id}
            className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {new Date(post.createdAt).toLocaleString()}
            </p>
            <form action={updatePostAction} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={post.id} />
              <input
                required
                name="imageUrl"
                defaultValue={post.imageUrl}
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
              <input
                required
                name="caption"
                defaultValue={post.caption}
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
              <button
                type="submit"
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 md:w-fit"
              >
                Save changes
              </button>
            </form>
            <form action={deletePostAction}>
              <input type="hidden" name="id" value={post.id} />
              <button
                type="submit"
                className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50 dark:border-red-700/60 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                Delete post
              </button>
            </form>
          </article>
        ))}
      </section>
    </main>
  );
}
