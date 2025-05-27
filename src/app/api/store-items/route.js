// /api/storeitem/route.js

import { prisma } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const schoolId = searchParams.get("schoolId");

  let items;
  if (schoolId) {
    items = await prisma.storeItem.findMany({ where: { schoolId } });
  } else {
    items = await prisma.storeItem.findMany();
  }
  return Response.json({ items });
}

export async function POST(request) {
  const { title, description, price, quantity, schoolId } =
    await request.json();

  if (!schoolId) {
    return Response.json({ error: "Missing schoolId" }, { status: 400 });
  }

  const item = await prisma.storeItem.create({
    data: {
      title,
      description,
      price: Number(price),
      quantity: Number(quantity),
      schoolId,
    },
  });

  return Response.json(item);
}
