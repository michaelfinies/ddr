import { NextRequest, NextResponse } from "next/server";

export function middleware(request) {
  let user = null;
  try {
    const cookie = request.cookies.get("user")?.value ?? "";
    if (!cookie) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("user", "", { maxAge: 0 });
      return res;
    }
    user = JSON.parse(cookie);
    if (!user?.id) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("user", "", { maxAge: 0 });
      return res;
    }

    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!user.isAdmin) {
        return NextResponse.redirect(new URL("/not-authorized", request.url));
      }
    }
  } catch (err) {
    console.error("Error parsing user cookie:", err);
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.set("user", "", { maxAge: 0 });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/logs/:path*",
    "/leaderboard/:path*",
    "/wallet/:path*",
    "/books/:path*",
    "/settings/:path*",
    "/history/:path*",
    "/store/:path*",
    "/create-log/:path*",
    "/onboarding/:path*",
    "/admin/:path*",
  ],
};
