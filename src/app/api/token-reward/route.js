// Example: /api/token-reward/index.js (GET, POST)
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rewards = await prisma.tokenReward.findMany({
    where: {
      log: {
        userId: user.id,
      },
    },
    include: {
      log: true,
    },
  });

  return Response.json({ success: true, rewards });
}

export async function POST(request) {
  const { logId, tokenType, tokenValue, contractTx } = await request.json();

  const reward = await prisma.tokenReward.create({
    data: {
      logId,
      tokenType,
      tokenValue,
      contractTx,
    },
  });

  return Response.json({ success: true, reward });
}
