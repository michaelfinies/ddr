import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
  try {
    const { itemId, txHash, walletAddress } = await req.json();
    if (!itemId || !txHash || !walletAddress) {
      return NextResponse.json(
        { error: "Missing itemId, txHash, or walletAddress" },
        { status: 400 }
      );
    }

    // Find user by wallet
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find item
    const item = await prisma.storeItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.quantity < 1) {
      return NextResponse.json(
        { error: "Item not available or out of stock" },
        { status: 400 }
      );
    }

    // Create PurchasedItem
    const purchasedItem = await prisma.purchasedItem.create({
      data: {
        userId: user.id,
        itemId: item.id,
        txHash,
      },
    });

    // Decrement store item quantity
    await prisma.storeItem.update({
      where: { id: item.id },
      data: { quantity: { decrement: 1 } },
    });

    // Add to transaction history (optional)
    await prisma.transactionHistory.create({
      data: {
        userId: user.id,
        transactionType: "ITEM_PURCHASE",
        amount: item.price,
        tokenAddress: process.env.REWARD_TOKEN_ADDRESS,
        transactionHash: txHash,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json({ success: true, purchasedItem });
  } catch (error) {
    console.error("Purchase API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
