import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Page({ params }) {
  const { id } = params;

  // Try to find and delete the purchased item
  const item = await prisma.purchasedItem.findUnique({
    where: { id },
  });

  if (!item) {
    // Already used or invalid
    redirect("/redeem/error"); // Or show custom error UI
  }

  await prisma.purchasedItem.delete({ where: { id } });

  // Redirect or show a success message
  redirect("/redeem/success"); // Or custom success UI
}
