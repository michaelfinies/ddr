import { NextResponse } from "next/server";

export async function GET(request) {
  const res = NextResponse.redirect(new URL("/", request.url));
  res.cookies.set("user", "", { path: "/", expires: new Date(0) });
  return res;
}
