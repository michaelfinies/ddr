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

export async function PATCH(request, { params }) {
  const logId = params.id;
  if (!logId)
    return Response.json({ error: "No log ID provided" }, { status: 400 });

  const body = await request.json();

  // Determine what is being updated
  const updateData = {};
  if ("status" in body) {
    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(body.status))
      return Response.json({ error: "Invalid status" }, { status: 400 });
    updateData.status = body.status;
  }
  if ("approvals" in body) {
    if (
      typeof body.approvals !== "number" ||
      body.approvals < 0 ||
      body.approvals > 3
    )
      return Response.json({ error: "Invalid approvals" }, { status: 400 });
    updateData.approvals = body.approvals;
  }

  if (Object.keys(updateData).length === 0) {
    return Response.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const log = await prisma.readingLog.findFirst({
    where: { id: logId },
  });
  if (!log)
    return Response.json(
      { error: "Log not found or no permission" },
      { status: 404 }
    );

  const updated = await prisma.readingLog.update({
    where: { id: logId },
    data: updateData,
    include: { reward: true },
  });

  return Response.json({ success: true, log: updated });
}
