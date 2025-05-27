"use client";
import { CheckCircle2 } from "lucide-react";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="bg-white border border-green-200 p-8 rounded-2xl shadow-lg text-center max-w-md flex flex-col items-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 drop-shadow-lg" />
        <h2 className="text-3xl font-extrabold text-green-700 mb-2">
          Item Redeemed!
        </h2>
        <p className="text-gray-700 mb-2">
          This item has been successfully redeemed and removed from your wallet.
        </p>
        <p className="text-xs text-green-600">
          Thank you for using Readify Rewards!
        </p>
      </div>
    </div>
  );
}
