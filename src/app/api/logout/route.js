import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("user", "", { maxAge: 0, path: "/" }); // Clears cookie
  return response;
}
