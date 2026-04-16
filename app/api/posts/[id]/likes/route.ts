import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACTOR_COOKIE, getActorContext } from "@/lib/actor-key";
import { evaluateInteractionPolicy } from "@/lib/interaction-policy";
import { addLike, hasActorLiked } from "@/lib/likes-store";
import { getPost, incrementHeartCount } from "@/lib/posts-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  const actor = getActorContext(request);
  const liked = hasActorLiked(id, actor.actorKey);
  const response = NextResponse.json({ liked, postId: id });
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const actor = getActorContext(request);
  const decision = evaluateInteractionPolicy({
    actorKey: actor.actorKey,
    ipPrefixHash: actor.ipPrefixHash,
    kind: "like",
  });

  if (decision.action === "soft_challenge") {
    const response = NextResponse.json(
      {
        error: "You are interacting too fast. Try again shortly.",
        retryAfterMs: decision.retryAfterMs ?? 30000,
        decision,
      },
      { status: 429 },
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

  const likeResult = addLike(id, actor.actorKey);
  const updated = likeResult.alreadyLiked ? getPost(id) : incrementHeartCount(id);
  const response = NextResponse.json({
    liked: !likeResult.alreadyLiked,
    duplicate: likeResult.alreadyLiked,
    post: { id, heartCount: updated?.heartCount ?? post.heartCount },
    decision,
  });
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
