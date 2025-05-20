// Purchase API (GET, POST)
export async function GET() {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    include: { item: true },
  });

  return Response.json({ success: true, purchases });
}

export async function POST(request) {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId, txHash } = await request.json();

  const purchase = await prisma.purchase.create({
    data: {
      userId: user.id,
      itemId,
      txHash,
    },
  });

  return Response.json({ success: true, purchase });
}
