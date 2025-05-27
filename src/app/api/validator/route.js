//  API (GET)
export async function GET() {
  const validators = await prisma.validator.findMany({});
  return Response.json({ success: true, validators });
}
