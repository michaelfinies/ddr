// Example: /api/book/index.js (GET, POST)
export async function GET() {
  const books = await prisma.book.findMany({});
  return Response.json({ success: true, books });
}

export async function POST(request) {
  const { title, author, genre, description } = await request.json();

  const book = await prisma.book.create({
    data: { title, author, genre, description },
  });

  return Response.json({ success: true, book });
}
