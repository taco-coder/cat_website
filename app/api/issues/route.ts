import { NextResponse } from "next/server";
import { createIssueSchema } from "@/lib/schemas";
import { createIssue, listIssues } from "@/lib/issues-store";
import type { IssueStatus } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as IssueStatus | "all" | null;
  const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  let items = listIssues();
  if (status && status !== "all") {
    items = items.filter((i) => i.status === status);
  }
  items = [...items].sort((a, b) => {
    const da = new Date(a.createdAt).getTime();
    const db = new Date(b.createdAt).getTime();
    return sort === "oldest" ? da - db : db - da;
  });

  return NextResponse.json({ issues: items });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createIssueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const issue = createIssue({
    title: parsed.data.title,
    description: parsed.data.description ?? "",
    status: parsed.data.status,
  });

  return NextResponse.json({ issue }, { status: 201 });
}
