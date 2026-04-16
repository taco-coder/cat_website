import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminSessionCookieName } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/issues")) {
    const ok = request.cookies.get("demo_session")?.value === "1";
    if (!ok) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }
    const ok =
      request.cookies.get(getAdminSessionCookieName())?.value === "1";
    if (!ok) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/issues/:path*", "/admin/:path*"],
};
