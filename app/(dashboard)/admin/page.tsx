import { listAuditEvents } from "@/lib/audit-log-store";
import { listNotifications } from "@/lib/admin-notifications-store";
import { listPendingComments, moderationStats } from "@/lib/comments-store";
import { listPosts } from "@/lib/posts-store";
import {
  approveCommentAction,
  createPostAction,
  deleteCommentAction,
  deletePostAction,
  rejectCommentAction,
  updatePostAction,
} from "./actions";

export default function AdminDashboardPage() {
  const posts = listPosts();
  const pendingComments = listPendingComments();
  const notifications = listNotifications(8);
  const logs = listAuditEvents(12);
  const stats = moderationStats();

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

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Operational notifications
        </h2>
        <ul className="space-y-2">
          {notifications.length === 0 ? (
            <li className="text-sm text-zinc-500 dark:text-zinc-400">
              No notifications yet.
            </li>
          ) : (
            notifications.map((item) => (
              <li
                key={item.id}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
              >
                <p className="font-medium text-zinc-800 dark:text-zinc-100">
                  {item.title}
                </p>
                <p className="text-zinc-600 dark:text-zinc-300">{item.message}</p>
              </li>
            ))
          )}
        </ul>
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

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Moderation queue
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Pending: {stats.pending} | Approved: {stats.approved} | Rejected: {stats.rejected}
          </p>
        </div>
        <div className="space-y-3">
          {pendingComments.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No pending comments.
            </p>
          ) : (
            pendingComments.map((comment) => (
              <article
                key={comment.id}
                className="space-y-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-700"
              >
                <p className="text-sm text-zinc-700 dark:text-zinc-200">{comment.body}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  post: {comment.postId} • {new Date(comment.createdAt).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  <form action={approveCommentAction} className="flex gap-2">
                    <input type="hidden" name="commentId" value={comment.id} />
                    <input
                      name="reason"
                      placeholder="reason (optional)"
                      className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-950"
                    />
                    <button className="rounded bg-emerald-600 px-2 py-1 text-xs text-white">
                      Approve
                    </button>
                  </form>
                  <form action={rejectCommentAction} className="flex gap-2">
                    <input type="hidden" name="commentId" value={comment.id} />
                    <input
                      required
                      name="reason"
                      placeholder="rejection reason"
                      className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-950"
                    />
                    <button className="rounded bg-amber-600 px-2 py-1 text-xs text-white">
                      Reject
                    </button>
                  </form>
                  <form action={deleteCommentAction} className="flex gap-2">
                    <input type="hidden" name="commentId" value={comment.id} />
                    <input
                      required
                      name="reason"
                      placeholder="delete reason"
                      className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-950"
                    />
                    <button className="rounded bg-red-700 px-2 py-1 text-xs text-white">
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Weekly digest and audit trail
          </h2>
          <a
            href="/api/admin/digest/weekly"
            className="text-sm text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
          >
            View digest JSON
          </a>
        </div>
        <ul className="space-y-2">
          {logs.length === 0 ? (
            <li className="text-sm text-zinc-500 dark:text-zinc-400">
              No audit events yet.
            </li>
          ) : (
            logs.map((event) => (
              <li
                key={event.id}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
              >
                <p className="font-medium text-zinc-800 dark:text-zinc-100">
                  {event.action} comment {event.entityId.slice(0, 8)}
                </p>
                <p className="text-zinc-600 dark:text-zinc-300">
                  {event.reason} • {new Date(event.timestamp).toLocaleString()}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
