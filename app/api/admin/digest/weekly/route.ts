import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminSessionCookieName } from "@/lib/admin-auth";
import { moderationStats } from "@/lib/comments-store";
import { listPosts } from "@/lib/posts-store";

export async function GET() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(getAdminSessionCookieName())?.value === "1";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = listPosts();
  const comments = moderationStats();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const postsCreated = posts.filter(
    (post) => new Date(post.createdAt).getTime() >= weekAgo.getTime(),
  ).length;

  return NextResponse.json({
    generatedAt: now.toISOString(),
    range: { start: weekAgo.toISOString(), end: now.toISOString() },
    counts: {
      postsCreated,
      commentsPending: comments.pending,
      commentsApproved: comments.approved,
      commentsRejected: comments.rejected,
      commentsDeleted: comments.deleted,
    },
    queueHealth: {
      pendingTotal: comments.pending,
      status: comments.pending > 10 ? "needs_attention" : "healthy",
    },
  });
}
