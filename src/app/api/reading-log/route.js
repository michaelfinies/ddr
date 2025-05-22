// Example: /api/reading-log/index.js (GET, POST)
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookie = await cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await prisma.readingLog.findMany({
    where: { userId: user?.id },
    include: { reward: true },
  });

  return Response.json({ success: true, logs });
}

export async function POST(request) {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { duration, summary, title, approvals } = await request.json();

  const log = await prisma.readingLog.create({
    data: {
      userId: user?.id,
      duration,
      summary,
      title,
      approvals,
      status: "PENDING",
    },
  });

  return Response.json({ success: true, log });
}
