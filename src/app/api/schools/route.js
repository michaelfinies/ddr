import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(schools);
  } catch (err) {
    console.error("Failed to fetch schools:", err);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}
