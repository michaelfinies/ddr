"use client";
import React, { useEffect, useState } from "react";
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
import { ShoppingCart, Coins, Package, Loader, XCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function StorePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTokens, setUserTokens] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [buying, setBuying] = useState(false);

  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const itemsRes = await fetch("/api/storeitem");
        const itemsData = await itemsRes.json();
        setItems(itemsData.items || []);

        const userRes = await fetch("/api/user");
        const userData = await userRes.json();
        setUserTokens(userData.tokens ?? 0);
      } catch (err) {
        toast.error("Failed to load store data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  async function buyItemWithSmartContract(item) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({ success: true, txHash: "0x123abc456def" });
      }, 1200);
    });
  }

  async function handleBuy() {
    if (!selectedItem) return;
    if (!userTokens || userTokens < selectedItem.price) return;

    setBuying(true);
    try {
      const result = await buyItemWithSmartContract(selectedItem);
      if (result.success) {
        toast.success(
          <>
            You bought <b>{selectedItem.title}</b>.<br />
            <span className="text-xs">Tx Hash: {result.txHash}</span>
          </>
        );
        setUserTokens((prev) =>
          prev !== null ? prev - selectedItem.price : prev
        );
        setItems((prev) =>
          prev.map((it) =>
            it.id === selectedItem.id
              ? { ...it, quantity: Math.max(0, it.quantity - 1) }
              : it
          )
        );
        setSelectedItem(null);
      } else {
        toast.error("There was a problem with your purchase.");
      }
    } catch (err) {
      toast.error("Transaction error. Try again.");
    } finally {
      setBuying(false);
    }
  }

  const bannerUrl = "/banner-placeholder.jpg";

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
      <div className=" flex  items-center justify-center gap-2 mb-8 px-4">
        <Coins className="w-6 h-6 text-yellow-500" />
        <span className="font-medium text-lg">My Tokens:</span>
        <span className="text-xl font-bold text-primary">
          {userTokens !== null ? (
            userTokens
          ) : (
            <Loader className="animate-spin  w-4 h-4" />
          )}
        </span>
      </div>
      {/* Store grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-64" />
          ))
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
              onClick={() => setSelectedItem(item)}
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
      {/* Modal / Dialog for item details */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-md">
          {selectedItem && (
            <React.Fragment>
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
              <DialogFooter className="mt-6 flex flex-col gap-2">
                <Button
                  onClick={handleBuy}
                  disabled={
                    buying ||
                    !userTokens ||
                    selectedItem.quantity === 0 ||
                    userTokens < selectedItem.price
                  }
                  className="w-full"
                >
                  {buying ? (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    <ShoppingCart className="w-4 h-4 mr-2" />
                  )}
                  Buy
                </Button>
                {selectedItem.quantity === 0 && (
                  <div className="flex items-center gap-1 text-red-500 text-sm justify-center">
                    <XCircle className="w-4 h-4" />
                    Out of stock
                  </div>
                )}
                {userTokens !== null &&
                  userTokens < selectedItem.price &&
                  selectedItem.quantity > 0 && (
                    <div className="text-red-500 text-sm text-center">
                      Not enough tokens to buy this item.
                    </div>
                  )}
              </DialogFooter>
            </React.Fragment>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
