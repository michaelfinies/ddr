// Example: /api/reading-log/index.js (GET, POST)
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await prisma.readingLog.findMany({
    where: { userId: user.id },
    include: { book: true, validator: true, reward: true },
  });

  return Response.json({ success: true, logs });
}

export async function POST(request) {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { bookId, duration, summary } = await request.json();

  const log = await prisma.readingLog.create({
    data: {
      userId: user.id,
      bookId,
      duration,
      summary,
      status: "PENDING",
    },
  });

  return Response.json({ success: true, log });
}
