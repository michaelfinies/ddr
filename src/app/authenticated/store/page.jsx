"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ShoppingCart,
  Coins,
  Package,
  Loader2,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import axios from "axios";
import { REWARD_TOKEN_ABI, REWARD_TOKEN_ADDRESS } from "@/constants/contracts";

const STORE_RECEIVER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const TOKEN_CONTRACT = REWARD_TOKEN_ADDRESS;
const TOKEN_ABI = REWARD_TOKEN_ABI;
const TOKEN_DECIMALS = 18;

export default function StorePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTokens, setUserTokens] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [buying, setBuying] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const user = useAuthStore((u) => u.user);
  const schoolId = user?.schoolId;

  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading: connecting } = useConnect();
  const { disconnect } = useDisconnect();

  // 1. Fetch user token balance with hook
  const {
    data: tokenBalanceRaw,
    refetch: refetchTokenBalance,
    isLoading: loadingBalance,
  } = useReadContract({
    address: TOKEN_CONTRACT,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    watch: true,
    enabled: !!address,
  });

  // 2. Wagmi v2 write hook
  const { writeContractAsync } = useWriteContract();

  // 3. Keep userTokens up to date
  useEffect(() => {
    if (tokenBalanceRaw !== undefined && tokenBalanceRaw !== null) {
      let raw;
      if (typeof tokenBalanceRaw === "bigint") {
        raw = tokenBalanceRaw;
      } else if (typeof tokenBalanceRaw === "string") {
        raw = BigInt(tokenBalanceRaw);
      } else {
        raw = BigInt(0);
      }
      setUserTokens(Number(raw) / 10 ** TOKEN_DECIMALS);
    } else {
      setUserTokens(0);
    }
  }, [tokenBalanceRaw]);

  // 4. Fetch store items
  const fetchItems = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setFetchError(null);
    try {
      const itemsRes = await fetch(`/api/store-items?schoolId=${schoolId}`);
      if (!itemsRes.ok) throw new Error("Could not fetch store items");
      const itemsData = await itemsRes.json();
      const normalized = (itemsData.items || []).map((item) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
      }));
      setItems(normalized);
    } catch (err) {
      setFetchError(err.message || "Unknown error");
      toast.error(
        "Failed to load store data: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // 5. Handle buy
  const handleBuy = async () => {
    if (!selectedItem) return;
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (userTokens < selectedItem.price) {
      toast.error("Not enough tokens!");
      return;
    }
    if (selectedItem.quantity <= 0) {
      toast.error("This item is out of stock.");
      return;
    }
    setBuying(true);
    setPurchaseSuccess(false);

    try {
      const priceRaw = BigInt(
        Math.floor(selectedItem.price * 10 ** TOKEN_DECIMALS)
      );
      const hash = await writeContractAsync({
        address: TOKEN_CONTRACT,
        abi: TOKEN_ABI,
        functionName: "transfer",
        args: [STORE_RECEIVER, priceRaw],
      });

      toast.info("Transaction sent. Waiting for confirmation...");

      await axios.post("/api/purchase", {
        itemId: selectedItem.id,
        txHash: hash,
        walletAddress: address,
      });

      setPurchaseSuccess(true);
      toast.success(
        <>
          <span>
            You bought <b>{selectedItem.title}</b>.
          </span>
          <br />
          <span className="text-xs">Tx Hash: {hash}</span>
        </>
      );

      await Promise.all([fetchItems(), refetchTokenBalance()]);
    } catch (err) {
      console.error("Transaction failed:", err);
      toast.error(
        "Purchase failed: " +
          (err?.shortMessage || err?.message || "Unknown error")
      );
    } finally {
      setBuying(false);
    }
  };

  // 6. UI
  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 mb-6">
        <img
          src={"/store2.png"}
          alt="Store Banner"
          className="w-full h-full object-cover rounded-b-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-3xl flex items-end px-8 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            Marketplace
          </h1>
        </div>
      </div>

      {/* User token balance */}
      <div className="flex items-center justify-center gap-2 mb-8 px-4">
        <Coins className="w-6 h-6 text-yellow-500" />
        <span className="font-medium text-lg">My Tokens:</span>
        <span className="text-xl font-bold text-primary">
          {loadingBalance ? (
            <Loader2 className="animate-spin inline-block w-4 h-4" />
          ) : (
            userTokens.toLocaleString(undefined, { maximumFractionDigits: 4 })
          )}
        </span>
        {!isConnected && (
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => connect({ connector: connectors[0] })}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>

      {/* Store grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-64" />
          ))
        ) : fetchError ? (
          <div className="col-span-full flex flex-col items-center justify-center text-red-500 py-12">
            <XCircle className="w-12 h-12 mb-2" />
            <span>{fetchError}</span>
            <Button className="mt-4" onClick={fetchItems}>
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground py-12">
            <ShoppingCart className="w-12 h-12 mb-2" />
            <span>No items in the store yet.</span>
          </div>
        ) : (
          items.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-xl transition-shadow cursor-pointer flex flex-col justify-between"
              onClick={() => {
                setSelectedItem(item);
                setPurchaseSuccess(false);
              }}
            >
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-lg">{item.title}</span>
                </div>
                <div className="flex-1 text-muted-foreground text-sm line-clamp-2 mb-2">
                  {item.description}
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-xl font-bold">{item.price}</span>
                  <span className="ml-auto text-xs px-2 py-1 rounded-lg bg-muted">
                    {item.quantity > 0
                      ? item.quantity + " left"
                      : "Out of stock"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Item Dialog */}
      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
            setPurchaseSuccess(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  {selectedItem.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedItem.description}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 mt-4">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-lg">
                  {selectedItem.price} tokens
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Quantity available: <b>{selectedItem.quantity}</b>
              </div>
              {selectedItem.qrCodeUrl && (
                <div className="mt-4">
                  <img
                    src={selectedItem.qrCodeUrl}
                    alt="QR code"
                    className="max-h-24 mx-auto"
                  />
                </div>
              )}
              {purchaseSuccess && (
                <div className="flex items-center gap-1 text-green-600 mt-2 text-sm justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                  Purchase complete!
                </div>
              )}
              <DialogFooter className="mt-6 flex flex-col gap-2">
                {!purchaseSuccess && (
                  <Button
                    onClick={handleBuy}
                    disabled={
                      buying ||
                      !isConnected ||
                      !address ||
                      userTokens < selectedItem.price ||
                      selectedItem.quantity <= 0
                    }
                    className="w-full"
                  >
                    {buying ? (
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 mr-2" />
                    )}
                    {isConnected
                      ? buying
                        ? "Processing..."
                        : "Buy"
                      : "Connect Wallet"}
                  </Button>
                )}
                {selectedItem.quantity === 0 && (
                  <div className="flex items-center gap-1 text-red-500 text-sm justify-center">
                    <XCircle className="w-4 h-4" />
                    Out of stock
                  </div>
                )}
                {userTokens < selectedItem.price &&
                  selectedItem.quantity > 0 && (
                    <div className="text-red-500 text-sm text-center">
                      Not enough tokens to buy this item.
                    </div>
                  )}
                {!isConnected && (
                  <div className="text-red-500 text-xs text-center">
                    Please connect your wallet to buy items.
                  </div>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
