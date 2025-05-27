import { prisma } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const schoolId = searchParams.get("schoolId");
  if (!schoolId)
    return Response.json({ error: "schoolId required" }, { status: 400 });

  // Get all users in this school, then their transactions
  const users = await prisma.user.findMany({
    where: { school: { id: schoolId } },
  });
  const userIds = users.map((u) => u.id);

  const transactions = await prisma.transactionHistory.findMany({
    where: { userId: { in: userIds } },
    orderBy: { timestamp: "desc" },
  });

  return Response.json(transactions);
}
