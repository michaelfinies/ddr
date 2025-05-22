// app/api/reading-log/[id]/route.js
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
  const cookie = await cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const logId = params.id;
  if (!logId)
    return Response.json({ error: "No log ID provided" }, { status: 400 });

  const log = await prisma.readingLog.findFirst({
    where: { id: logId, userId: user?.id },
    include: { reward: true },
  });

  if (!log) return Response.json({ error: "Log not found" }, { status: 404 });

  return Response.json({ success: true, log });
}
