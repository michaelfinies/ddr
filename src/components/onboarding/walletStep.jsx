"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletStep({ wallet, setWallet, onNext }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && address) {
      setWallet({ address });
    }
  }, [address, isConnected, setWallet]);

  const metamaskConnector = connectors.find((c) => c.name === "MetaMask");

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

        {!isConnected ? (
          <Button
            onClick={() => connect({ connector: metamaskConnector })}
            className="w-60 py-6 text-lg flex gap-2 justify-center items-center bg-orange-700 hover:cursor-pointer"
            disabled={isLoading}
          >
            {isLoading
              ? "Connecting..."
              : `Connect ${metamaskConnector?.name ?? "Wallet"}`}
          </Button>
        ) : (
          <div>
            <div className="mb-2 text-center -mt-3">
              <p className="text-green-500 font-bold uppercase">
                CONNECTED successfully
              </p>
              <span className="font-mono text-xs font-semibold text-gray-600">
                {address}
              </span>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => disconnect()}
                className="w-52 py-6 text-lg flex gap-2 justify-center items-center bg-red-500 hover:cursor-pointer"
              >
                Disconnect
              </Button>
              <Button
                onClick={onNext}
                className="w-52 py-6 text-lg flex gap-2 justify-center items-center bg-black text-white hover:cursor-pointer"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center">{error.message}</p>
        )}
      </div>
    </motion.div>
  );
}
