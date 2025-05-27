"use client";

import React, { useState, useEffect } from "react";
import BoringAvatar from "boring-avatars";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useWalletClient,
} from "wagmi";
import { parseEther } from "viem";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Copy, Wallet, Send } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { REWARD_TOKEN_ABI, REWARD_TOKEN_ADDRESS } from "@/constants/contracts";

export default function WalletPage() {
  const { user, setUser } = useAuthStore();

  const [minting, setMinting] = useState(false); // changed from sending
  const [mintDialogOpen, setMintDialogOpen] = useState(false); // changed from sendDialogOpen
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address,
    token: REWARD_TOKEN_ADDRESS,
    enabled: !!address,
    watch: true,
  });
  const { data: walletClient } = useWalletClient();
  const metamaskConnector = connectors.find((c) => c.name === "MetaMask");

  useEffect(() => {
    const updateWalletIfChanged = async () => {
      if (!isConnected || !address || !user?.id) return;

      if (user.walletAddress !== address) {
        try {
          const res = await axios.patch("/api/user", {
            id: user.id,
            walletAddress: address,
          });

          if (res.data?.user) {
            setUser(res.data.user);
            toast.success("Wallet address updated!");
          }
        } catch (err) {
          console.error("Wallet update error:", err);
          toast.error("Failed to update wallet address");
        }
      }
    };

    updateWalletIfChanged();
  }, [isConnected, address, user?.id]);

  async function handleMintToken() {
    if (!walletClient) {
      toast.error("Wallet not connected");
      return;
    }
    if (!recipient || !amount) {
      toast.error("Recipient and amount are required");
      return;
    }
    setMinting(true);
    setTxHash("");
    try {
      // CHANGED: call "mint", not "transfer"
      const hash = await walletClient.writeContract({
        address: REWARD_TOKEN_ADDRESS,
        abi: REWARD_TOKEN_ABI,
        functionName: "mint", // change this if your contract uses "mintTo"
        args: [recipient, parseEther(amount)],
      });
      setTxHash(hash);
      toast.success("Token minted to student!");
      setRecipient("");
      setAmount("");
      refetchBalance();
    } catch (e) {
      toast.error("Error minting token: " + (e?.message || e));
    } finally {
      setMinting(false);
    }
  }

  return (
    <div className="px-4 py-8">
      {/* Header/Profile */}
      <Card className="mb-8 w-full md:w-2/3 flex flex-col md:flex-row items-center md:items-start p-6 gap-6 rounded-2xl shadow-xl">
        <Avatar className="w-20 h-20 shadow">
          <BoringAvatar
            size={64}
            name={user?.name || "default"}
            variant={user?.avatarSeed}
            colors={
              user?.avatarColor?.split("-") ||
              user?.avatarColor?.split("#").map((col) => `#${col}`)
            }
            className="w-20 h-20 rounded-full"
          />
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-2xl mb-1">
            {user?.name || "User"}
          </CardTitle>
          <CardDescription className="mb-2">{user?.email}</CardDescription>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-yellow-600" />
            <span className="font-mono">
              {user?.walletAddress || address || "Not connected"}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      user?.walletAddress || address || ""
                    );
                    toast.success("Copied wallet address!");
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy address</TooltipContent>
            </Tooltip>
            <Badge className={isConnected ? "bg-green-500" : "bg-red-500"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            {isConnected ? (
              <Button size="sm" variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => connect({ connector: metamaskConnector })}
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div>
        <Dialog open={mintDialogOpen} onOpenChange={setMintDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 hover:cursor-pointer">
              <Send className="w-4 h-4" /> Mint Tokens to Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Mint Tokens to Student</DialogTitle>
            <DialogDescription>
              Mint reward tokens (ERC20) directly to a student's address.
            </DialogDescription>
            <div className="space-y-3 mt-4">
              <div>
                <label className="block mb-1 font-medium">
                  Student Wallet Address
                </label>
                <input
                  className="w-full px-2 py-1 border rounded"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Amount</label>
                <input
                  className="w-full px-2 py-1 border rounded"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Tokens to mint (e.g. 10)"
                  type="number"
                  min="0"
                />
              </div>

              <Button
                onClick={handleMintToken}
                disabled={minting || !recipient || !amount}
              >
                {minting ? "Minting..." : "Mint"}
              </Button>
              {txHash && (
                <div className="text-xs text-yellow-600 mt-2">
                  Tx Hash:{" "}
                  <a
                    href={`https://etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {txHash}
                  </a>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
