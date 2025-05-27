import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      id,
      email = "",
      name = "",
      avatarSeed = "",
      avatarColor = "",
      walletAddress = "",
      genres = [],
      goal = "",
      school = "",
      isAdmin = false,
      hasOnboarded = true,
    } = data || {};

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    if (!school) {
      return NextResponse.json({ error: "Missing school" }, { status: 400 });
    }

    // 1. Confirm user and school exist
    const user = await prisma.user?.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const schoolRecord = await prisma.school?.findUnique({
      where: { id: school },
    });
    if (!schoolRecord) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // 2. Update user with schoolId and preferences
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        avatarSeed,
        avatarColor,
        walletAddress,
        school: { connect: { id: school } },
        isAdmin,
        hasOnboarded,
        preferences: {
          upsert: {
            update: {
              genrePrefs: genres ?? [],
              goal: goal ?? null,
            },
            create: {
              genrePrefs: genres ?? [],
              goal: goal ?? null,
              darkMode: false,
            },
          },
        },
      },
      include: {
        preferences: true,
        school: true,
      },
    });

    if (isAdmin && schoolRecord.adminId !== id) {
      await prisma.school.update({
        where: { id: school },
        data: { adminId: id, isActive: true },
      });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error("Onboarding error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const data = await request.json();
    const { id, walletAddress } = data;

    if (!id || !walletAddress) {
      return NextResponse.json(
        { error: "Missing id or walletAddress" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existingUser.walletAddress === walletAddress) {
      return NextResponse.json({ message: "No changes made" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { walletAddress },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating wallet address:", error);
    return NextResponse.json(
      { error: "Server error while updating wallet" },
      { status: 500 }
    );
  }
}
