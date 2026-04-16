import { NextResponse } from "next/server";
import { listPostsPage } from "@/lib/posts-store";

const DEFAULT_PAGE_SIZE = 3;
const MAX_PAGE_SIZE = 12;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limitParam = Number(searchParams.get("limit") ?? DEFAULT_PAGE_SIZE);
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  const { items, nextCursor } = listPostsPage(cursor, limit);

  return NextResponse.json({
    posts: items,
    pagination: { nextCursor, limit },
  });
}
