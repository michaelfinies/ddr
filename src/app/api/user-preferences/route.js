// UserPreferences API (GET, PUT)
export async function GET() {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: user?.id },
  });

  return Response.json({ success: true, preferences });
}

export async function PUT(request) {
  const cookie = cookies();
  const user = JSON.parse(cookie.get("user")?.value || "null");
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();

  const preferences = await prisma.userPreferences.upsert({
    where: { userId: user?.id },
    update: data,
    create: { userId: user?.id, ...data },
  });

  return Response.json({ success: true, preferences });
}
