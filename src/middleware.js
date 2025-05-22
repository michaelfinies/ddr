import { NextRequest, NextResponse } from "next/server";

export function middleware(request) {
  let user = null;
  try {
    const cookie = request.cookies.get("user")?.value ?? "";
    if (!cookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    user = JSON.parse(cookie);
    if (!user?.id) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (err) {
    console.error("Error parsing user cookie:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    user &&
    !user?.hasOnboarded &&
    request.nextUrl.pathname !== "/onboarding"
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/logs",
    "/leaderboard",
    "/wallet",
    "/books",
    "/settings",
    "/history",
    "/store",
    "/create-log",
    "/onboarding",
  ],
};
