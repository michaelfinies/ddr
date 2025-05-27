import { prisma } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return Response.json({ error: "userId required" }, { status: 400 });

  const transactions = await prisma.transactionHistory.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
  });

  return Response.json(transactions);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      userId,
      transactionType,
      transactionHash,
      amount,
      tokenAddress,
      blockNumber,
      status = "CONFIRMED",
    } = body;

    if (!userId || !transactionHash || !transactionType) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tx = await prisma.transactionHistory.create({
      data: {
        userId,
        transactionType,
        transactionHash,
        amount,
        tokenAddress,
        blockNumber,
        status,
      },
    });

    return Response.json({ success: true, transaction: tx });
  } catch (err) {
    console.error("❌ POST /api/transactions error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
