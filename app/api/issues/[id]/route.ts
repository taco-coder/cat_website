import { NextResponse } from "next/server";
import { updateIssueSchema } from "@/lib/schemas";
import { getIssue, updateIssue } from "@/lib/issues-store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const issue = getIssue(id);
  if (!issue) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ issue });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = getIssue(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateIssueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const issue = updateIssue(id, {
    title: parsed.data.title,
    description: parsed.data.description ?? "",
    status: parsed.data.status,
  });

  return NextResponse.json({ issue });
}
