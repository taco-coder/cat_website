import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACTOR_COOKIE, getActorContext } from "@/lib/actor-key";
import { appendAuditEvent } from "@/lib/audit-log-store";
import { createComment, listCommentsForPost } from "@/lib/comments-store";
import { createNotification } from "@/lib/admin-notifications-store";
import { evaluateInteractionPolicy } from "@/lib/interaction-policy";
import { getPost } from "@/lib/posts-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({ comments: listCommentsForPost(id, "approved") });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const text = String((body as { body?: unknown })?.body ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "Comment body is required" }, { status: 422 });
  }
  if (text.length > 500) {
    return NextResponse.json({ error: "Comment must be 500 chars or fewer" }, { status: 422 });
  }

  const actor = getActorContext(request);
  const decision = evaluateInteractionPolicy({
    actorKey: actor.actorKey,
    ipPrefixHash: actor.ipPrefixHash,
    kind: "comment",
    text,
  });

  const status =
    decision.action === "allow"
      ? "approved"
      : decision.action === "queue"
        ? "pending"
        : "rejected";

  const comment = createComment({
    postId: id,
    body: text,
    actorKey: actor.actorKey,
    status,
    moderationReason: decision.reasonCode,
    safetySignals: {
      hasProfanity: text.toLowerCase().includes("fuck") || text.toLowerCase().includes("shit"),
      hasLink: /(https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})/i.test(text),
      hasObfuscatedLink: /(hxxp|dot\s+com|\[dot\])/i.test(text),
      spamScore: /(buy now|click here|free money)/i.test(text) ? 80 : 0,
    },
  });

  if (decision.action === "reject") {
    appendAuditEvent({
      action: "auto_reject",
      actor: "policy-engine",
      entityType: "comment",
      entityId: comment.id,
      reason: decision.reasonCode,
    });
  }
  if (decision.action === "queue") {
    appendAuditEvent({
      action: "auto_queue",
      actor: "policy-engine",
      entityType: "comment",
      entityId: comment.id,
      reason: decision.reasonCode,
    });
    createNotification({
      level: "warning",
      title: "Comment queued for review",
      message: "A new comment requires moderation review.",
    });
  }

  const response = NextResponse.json(
    {
      comment: {
        id: comment.id,
        postId: comment.postId,
        body: comment.body,
        status: comment.status,
        createdAt: comment.createdAt,
      },
      decision,
    },
    { status: decision.httpStatus === 200 ? 201 : decision.httpStatus },
  );

  if (!actor.hasExistingCookie) {
    response.cookies.set(ACTOR_COOKIE, actor.actorId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}
