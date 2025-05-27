import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { school: true },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

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
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
