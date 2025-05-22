import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma?.user?.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user?.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const response = NextResponse.json({
      message: "User registered successfully",
      user: {
        id: user?.id,
        name: user?.name || null,
        email: user?.email || null,
        walletAddress: user?.walletAddress || null,
        avatarSeed: user?.avatarSeed || null,
        avatarColor: user?.avatarColor || null,
        hasOnboarded: user?.hasOnboarded || null,
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
        maxAge: 60 * 60 * 24,
      }
    );

    return response;
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
