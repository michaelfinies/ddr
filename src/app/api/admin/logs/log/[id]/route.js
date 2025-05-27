// app/api/reading-log/[id]/route.js
import { prisma } from "@/lib/db";

export async function GET(request, { params }) {
  const logData = await params;
  const logId = logData.id;
  if (!logId)
    return Response.json({ error: "No log ID provided" }, { status: 400 });

  const log = await prisma.readingLog.findFirst({
    where: { id: logId },
    include: {
      reward: true,
      user: true,
    },
  });

  if (!log) return Response.json({ error: "Log not found" }, { status: 404 });

  return Response.json({ success: true, log });
}

export async function PATCH(request, { params }) {
  const logId = params.id;
  if (!logId)
    return Response.json({ error: "No log ID provided" }, { status: 400 });

  const { status, feedback, validator } = await request.json();
  const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
  if (!validStatuses.includes(status))
    return Response.json({ error: "Invalid status" }, { status: 400 });

  const log = await prisma.readingLog.findFirst({
    where: { id: logId },
  });
  if (!log)
    return Response.json(
      { error: "Log not found or no permission" },
      { status: 404 }
    );

  const updateData = {
    status: status,
    validator: validator,
    ...(feedback && { feedback: feedback }),
  };

  const updated = await prisma.readingLog.update({
    where: { id: logId },
    data: updateData,
    include: { reward: true, user: true },
  });

  return Response.json({ success: true, log: updated });
}
