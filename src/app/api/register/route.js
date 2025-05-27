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

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const userData = {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      avatarSeed: user?.avatarSeed,
      avatarColor: user?.avatarColor,
      walletAddress: user?.walletAddress,
      genres: user?.genres,
      goal: user?.goal,
      hasOnboarded: user?.hasOnboarded,
      isAdmin: user?.isAdmin,
      schoolId: user?.schoolId,
    };

    const response = NextResponse.json({
      message: "Authenticated",
      user: userData,
    });

    response.cookies.set(
      "user",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
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
