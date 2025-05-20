"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function WalletStep({ wallet, setWallet, onNext }) {
  // Placeholder for actual Metamask integration
  function connectMetamask() {
    setWallet({ address: "0x1234...abcd" });
    onNext();
  }
  return (
    <motion.div
      key="wallet"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6">
        <img
          src="/metamask-icon.png"
          alt="Mascot"
          className="w-32 h-32 -mb-5"
        />
        <h2 className="text-2xl font-bold text-center">Connect your Wallet</h2>
        <p className="text-center text-muted-foreground max-w-md -mt-5">
          Connect your <strong>Metamask</strong> wallet to earn crypto rewards
          and unique NFTs on your reading journey.
        </p>
        <Button
          onClick={connectMetamask}
          className="w-60 py-6 text-lg flex gap-2 justify-center items-center bg-orange-700 hover:cursor-pointer"
        >
          Connect
        </Button>
      </div>
    </motion.div>
  );
}
