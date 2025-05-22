import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Find user by email
    const user = await prisma.user?.findUnique({
      where: { email },
    });

    if (!user || !user?.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2. Compare password
    const isValid = await bcrypt.compare(password, user?.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. Create session cookie (or use JWT if needed)
    const response = NextResponse.json({
      message: "Authenticated",
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        walletAddress: user?.walletAddress,
        avatarSeed: user?.avatarSeed,
        avatarColor: user?.avatarColor,
        hasOnboarded: user?.hasOnboarded,
      },
    });

    response.cookies.set(
      "user",
      JSON.stringify({
        id: user?.id,
        name: user?.name,
        email: user?.email,
        walletAddress: user?.walletAddress,
        avatarSeed: user?.avatarSeed,
        avatarColor: user?.avatarColor,
        hasOnboarded: user?.hasOnboarded,
      }),
      {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      }
    );

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
