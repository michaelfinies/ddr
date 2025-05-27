"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BookOpen, Loader2 } from "lucide-react";
import axios from "axios";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import {
  SUBMISSION_MANAGER_ABI,
  SUBMISSION_MANAGER_ADDRESS,
} from "@/constants/contracts";
import { useWalletClient, usePublicClient } from "wagmi";
import { keccak256, toBytes, decodeEventLog } from "viem";

export default function CreateLogPage() {
  const { user } = useAuthStore();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [summary, setSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const summaryWordCount = summary.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    setTitle(localStorage.getItem("logTitle") || "");
    setDuration(localStorage.getItem("logDuration") || "");
    setSummary(localStorage.getItem("logSummary") || "");
  }, []);

  useEffect(() => {
    console.log("zustand user" + user);
  }, [user]);

  useEffect(() => {
    localStorage.setItem("logTitle", title);
  }, [title]);
  useEffect(() => {
    localStorage.setItem("logDuration", duration);
  }, [duration]);
  useEffect(() => {
    localStorage.setItem("logSummary", summary);
  }, [summary]);

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !duration || !summary) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (summaryWordCount < 100) {
      toast.error("Summary must be at least 100 words.");
      return;
    }

    if (!walletClient || !user?.walletAddress) {
      toast.error("Wallet not connected");
      return;
    }

    setSubmitting(true);

    try {
      const summaryHash = keccak256(toBytes(summary.trim()));

      // ✅ 1. Call the contract
      const txHash = await walletClient.writeContract({
        address: SUBMISSION_MANAGER_ADDRESS,
        abi: SUBMISSION_MANAGER_ABI,
        functionName: "submitSummary",
        args: [user.name, title.trim(), summaryHash, BigInt(duration)],
      });

      // ✅ 2. Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      // ✅ 3. Decode the SummarySubmitted event
      const summaryEvent = receipt.logs.find(
        (log) =>
          log.address.toLowerCase() === SUBMISSION_MANAGER_ADDRESS.toLowerCase()
      );

      if (!summaryEvent) throw new Error("No SummarySubmitted event found");

      const decoded = decodeEventLog({
        abi: SUBMISSION_MANAGER_ABI,
        data: summaryEvent.data,
        topics: summaryEvent.topics,
        eventName: "SummarySubmitted",
      });

      const index = Number(decoded.args.index);

      // ✅ 4. Store in DB
      await axios.post("/api/reading-log", {
        userId: user.id,
        title: title.trim(),
        duration: parseInt(duration),
        summary: summary.trim(),
        summaryHash,
        approvals: 1,
        contractIndex: index,
      });

      // ✅ 5. Reset form and trigger animations
      confetti({ particleCount: 120, spread: 100 });
      toast.success("Reading log submitted!");

      localStorage.removeItem("logTitle");
      localStorage.removeItem("logDuration");
      localStorage.removeItem("logSummary");

      setTitle("");
      setDuration("");
      setSummary("");
      confetti({ particleCount: 250, spread: 130, origin: { y: 0.7 } });

      router.push("/logs");
    } catch (e) {
      console.error("Submission failed:", e);
      toast.error("Failed to submit log.");
      setSubmitting(false);
    }
  }

  // Next badge inf
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white f py-8 px-4">
      <Card className="max-w-2xl w-full p-8 rounded-2xl shadow-2xl border-blue-100 relative z-10">
        <CardTitle className="-mb-2 flex items-center gap-2 text-2xl text-blue-700">
          <BookOpen className="w-7 h-7 text-blue-500" />
          New Reading Log
        </CardTitle>

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block font-semibold mb-1 text-blue-800">
              Book Title
            </label>
            <Input
              className="text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the book title"
              required
              disabled={submitting}
              maxLength={150}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-800">
              Duration (minutes)
            </label>
            <Input
              type="number"
              min={1}
              max={1440}
              className="text-base"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="How many minutes did you read?"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-blue-800">
              Summary
            </label>
            <Textarea
              className="min-h-[100px] md:min-h-[150px] text-base resize-vertical"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write about what you read and learned. Minimum 100 words for rewards!"
              required
              disabled={submitting}
              maxLength={3500}
            />
            <div
              className={`text-xs mt-2 ${
                summaryWordCount < 100 ? "text-red-500" : "text-blue-600"
              }`}
            >
              {summaryWordCount} / 100 words required
            </div>
          </div>
          <div>
            <Button
              type="submit"
              disabled={submitting || summaryWordCount < 100}
              className="w-full py-6 text-lg font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 transition"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Submitting...
                </span>
              ) : (
                "Submit Log"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
