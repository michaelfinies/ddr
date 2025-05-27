import { ethers } from "ethers";
import { NextResponse } from "next/server";
import { rewardTokenAbi } from "@/abi/ReadifyRewardToken";

const contractAddress = process.env.REWARD_TOKEN_ADDRESS;
const privateKey = process.env.ADMIN_PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;

export async function POST(request) {
  try {
    const { to, amount } = await request.json();

    if (!to || !amount) {
      return NextResponse.json(
        { error: "Missing 'to' or 'amount'" },
        { status: 400 }
      );
    }

    // Connect to provider
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Connect to contract
    const tokenContract = new ethers.Contract(
      contractAddress,
      rewardTokenAbi,
      wallet
    );

    // Mint tokens
    const tx = await tokenContract.mint(to, BigInt(amount));
    const receipt = await tx.wait();

    console.log({
      contractAddress: contractAddress,
      privateKey: privateKey,
      rpcUrl: rpcUrl,
      provider: provider,
      wallet: wallet,
      tokenContract: tokenContract,
      tx: tx,
      receipt: receipt,
    });

    return NextResponse.json({
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err) {
    console.error("❌ Mint error:", err);
    return NextResponse.json({ error: "Minting failed" }, { status: 500 });
  }
}
