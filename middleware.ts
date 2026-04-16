import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/issues")) {
    return NextResponse.next();
  }

  const ok = request.cookies.get("demo_session")?.value === "1";
  if (!ok) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/issues/:path*"],
};
