// Example: /api/owned-item/index.js (GET, POST)
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.purchasedItem.findMany({
    where: { userId: user?.id },
    include: { item: true },
  });

  return Response.json({ success: true, items });
}

export async function POST(request) {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId, qrCodeUrl } = await request.json();

  const item = await prisma.purchasedItem.create({
    data: {
      userId: user?.id,
      itemId,
      qrCodeUrl,
    },
  });

  return Response.json({ success: true, item });
}
