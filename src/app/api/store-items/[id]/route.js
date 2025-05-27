import { prisma } from "@/lib/db";

// Get store item by ID
export async function GET(req, { params }) {
  const { id } = params;
  const item = await prisma.storeItem.findUnique({ where: { id } });
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(item);
}

// Edit store item by ID (partial update)
export async function PATCH(req, { params }) {
  const { id } = params;
  const data = await req.json();
  const updated = await prisma.storeItem.update({ where: { id }, data });
  return Response.json(updated);
}

// Edit store item by ID (full update)
export async function PUT(request, { params }) {
  const { id } = params;
  const { title, description, price, quantity, schoolId } =
    await request.json();

  const item = await prisma.storeItem.update({
    where: { id },
    data: {
      title,
      description,
      price: Number(price),
      quantity: Number(quantity),
      ...(schoolId && { schoolId }), // Allow updating school if provided
    },
  });

  return Response.json(item);
}

// Delete store item by ID
export async function DELETE(request, { params }) {
  const { id } = params;
  const item = await prisma.storeItem.delete({ where: { id } });
  return Response.json({ success: true, item });
}
