import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("next") ?? "/issues";

  const res = NextResponse.redirect(new URL(redirectTo, url.origin));
  res.cookies.set("demo_session", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
