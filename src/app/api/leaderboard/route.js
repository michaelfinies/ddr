// Example: /api/leaderboard/index.js (GET, POST, PUT)
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const leaderboard = await prisma.leaderboard.findMany({
    include: { user: true },
    orderBy: { booksRead: "desc" },
  });

  return Response.json({ success: true, leaderboard });
}

export async function POST(request) {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { booksRead } = await request.json();

  const entry = await prisma.leaderboard.create({
    data: {
      userId: user.id,
      booksRead,
    },
  });

  return Response.json({ success: true, entry });
}

export async function PUT(request) {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { booksRead } = await request.json();

  const entry = await prisma.leaderboard.update({
    where: { userId: user.id },
    data: {
      booksRead,
      lastUpdated: new Date(),
    },
  });

  return Response.json({ success: true, entry });
}
