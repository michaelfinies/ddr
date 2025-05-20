// Wallet API (GET, POST)
export async function GET() {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  return Response.json({ success: true, wallet });
}

export async function POST(request) {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { address } = await request.json();

  const wallet = await prisma.wallet.upsert({
    where: { userId: user.id },
    update: { address },
    create: { userId: user.id, address },
  });

  return Response.json({ success: true, wallet });
}
