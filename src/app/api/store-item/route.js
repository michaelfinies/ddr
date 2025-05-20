export async function GET() {
  const items = await prisma.storeItem.findMany({});
  return Response.json({ success: true, items });
}

export async function POST(request) {
  const { title, description, price, quantity, qrCodeUrl } =
    await request.json();

  const item = await prisma.storeItem.create({
    data: { title, description, price, quantity, qrCodeUrl },
  });

  return Response.json({ success: true, item });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const item = await prisma.storeItem.delete({ where: { id } });
  return Response.json({ success: true, item });
}
