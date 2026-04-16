import { NextResponse } from "next/server";
import { consumeMagicToken, getAdminSessionCookieName } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const next = url.searchParams.get("next") ?? "/admin";
  const ok = consumeMagicToken(token);

  if (!ok) {
    return NextResponse.redirect(new URL("/admin/login?error=magic", request.url));
  }

  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(getAdminSessionCookieName(), "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
