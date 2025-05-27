import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
  const school = await params;

  if (!school.id) {
    return Response.json({ error: "Missing schoolId" }, { status: 400 });
  }

  const logs = await prisma.readingLog.findMany({
    where: {
      user: { schoolId: school.id },
      approvals: { in: [2, 3] },
    },
    orderBy: {
      timestamp: "desc",
    },
    select: {
      id: true,
      userId: true,
      title: true,
      duration: true,
      summary: true,
      timestamp: true,
      status: true,
      approvals: true,
      logHash: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarSeed: true,
          avatarColor: true,
        },
      },
      reward: {
        select: {
          id: true,
          tokenType: true,
          tokenValue: true,
          contractTx: true,
        },
      },
    },
  });

  return Response.json({ logs });
}
