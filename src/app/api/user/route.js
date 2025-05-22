import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      email = "",
      name = "",
      avatarSeed = "",
      avatarColor = "",
      walletAddress = "",
      genres = [],
      goal = "",
      consent = {},
    } = data || {};

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // 1. Find user
    const user = await prisma.user?.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Update user
    const updatedUser = await prisma.user?.update({
      where: { email },
      data: {
        name,
        avatarSeed,
        avatarColor,
        walletAddress,
        hasOnboarded: true,
        preferences: {
          upsert: {
            update: {
              genrePrefs: genres ?? [],
              goal: goal ?? null,
              notification: consent?.notifications ?? true,
            },
            create: {
              genrePrefs: genres ?? [],
              goal: goal ?? null,
              notification: consent?.notifications ?? true,
              darkMode: false,
            },
          },
        },
      },
      include: {
        preferences: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error("Onboarding error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
