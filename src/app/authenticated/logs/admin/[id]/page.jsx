"use client";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useWalletClient } from "wagmi";
import {
  SUBMISSION_MANAGER_ABI,
  SUBMISSION_MANAGER_ADDRESS,
} from "@/constants/contracts";
import axios from "axios";

import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  BadgeCheck,
  Hash,
  UserCheck,
  Gift,
  BookOpen,
  Calendar,
  Timer,
  Send,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePublicClient } from "wagmi";
import { useAuthStore } from "@/store/useAuthStore";

export default function LogDetailPage() {
  const { user } = useAuthStore();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const params = useParams();
  const id = params?.id;
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchLog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/logs/log/${id}`);
        const data = await res.json();
        console.log("this is the id" + data);
        if (!res.ok || !data.success)
          throw new Error(data.pageError || "Failed to fetch log");
        console.log(data.log);
        setLog(data.log);
        setSelectedStatus(data.log.status);
      } catch (err) {
        // setError(err.message || "Unknown pageError");
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [id]);

  async function approveAndReward() {
    if (
      !walletClient ||
      !log?.user?.walletAddress ||
      log?.contractIndex === undefined
    ) {
      toast.error("Missing wallet or log data");
      return;
    }

    setSending(true);
    setError(null);
    console.log("Calling approveAndReward with:");
    console.log("Student:", log.user.walletAddress);
    console.log("Index:", log.contractIndex);
    console.log("Signer:", walletClient.account.address);

    try {
      // 1. Call the contract
      const txHash = await walletClient.writeContract({
        address: SUBMISSION_MANAGER_ADDRESS,
        abi: SUBMISSION_MANAGER_ABI,
        functionName: "approveAndReward",
        args: [log.user.walletAddress, log.contractIndex],
      });

      toast.success("Approval & minting transaction sent!");

      // 2. Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      await axios.patch(`/api/reading-log/${params?.id}`, {
        approvals: 3,
      });

      setLog((prev) => prev && { ...prev, approvals: 3 });

      await axios.post(`/api/token-reward`, {
        logId: params?.id,
        contractTx: txHash,
        tokenType: "RRT",
        tokenValue: log.duration,
      });

      setLog(
        (prev) =>
          prev && {
            ...prev,
            reward: {
              id: params?.id,
              contractTx: txHash,
              tokenType: "RRT",
              tokenValue: log.duration,
            },
          }
      );

      toast.success("Tokens minted and saved!");

      // Optionally re-fetch the updated log
      const updated = await axios.get(`/api/admin/logs/log/${id}`);
      const updatedData = await updated.json();
      setLog(updatedData.log);

      setTxHash(txHash);
    } catch (err) {
      console.error("Approval error:", err);
      toast.error(err.message || "Failed to approve and mint tokens");
    } finally {
      setSending(false);
    }
  }

  async function handleStatusSubmit(e) {
    e.preventDefault();

    if (!id) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/logs/log/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          feedback: feedback ? feedback : null,
          validator: user?.name || "Your school",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.pageError || "Failed to update status");
      setFeedback("");

      setLog(data.log);
    } catch (err) {
      setError(err.message || "Unknown pageError");
    } finally {
      setSubmitting(false);
    }
  }

  // Status badge rendering (unchanged)
  const statusBlock = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-2xl bg-green-100 text-green-700 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-2xl bg-red-100 text-red-700 font-semibold text-sm">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-2xl bg-yellow-100 text-yellow-700 font-semibold text-sm">
            <Clock className="w-4 h-4" /> Pending
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  if (pageError)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-600">
        {pageError}
      </div>
    );
  if (!log)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-muted-foreground">
        Log not found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-10 px-2">
      <form onSubmit={handleStatusSubmit} className="mb-5 z-10">
        <span className="inline-flex right-0 divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setSelectedStatus("PENDING")}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors focus:relative
              ${
                selectedStatus === "PENDING"
                  ? "bg-yellow-100 text-yellow-800 font-bold"
                  : "text-yellow-700 hover:bg-yellow-50 hover:text-yellow-900"
              }`}
            title="Set to Pending"
          >
            <Clock className="w-4 h-4" />
            Pending
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus("APPROVED")}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors focus:relative
              ${
                selectedStatus === "APPROVED"
                  ? "bg-green-100 text-green-800 font-bold"
                  : "text-green-700 hover:bg-green-50 hover:text-green-900"
              }`}
            title="Approve"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus("REJECTED")}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors focus:relative
              ${
                selectedStatus === "REJECTED"
                  ? "bg-red-100 text-red-800 font-bold"
                  : "text-red-700 hover:bg-red-50 hover:text-red-900"
              }`}
            title="Reject"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </span>
        {/* ---- TEXTAREA + SUBMIT ---- */}
        <div className="mt-4 flex flex-col gap-3">
          <textarea
            className="w-full min-h-[150px] rounded-xl border border-gray-300 p-4 text-base"
            placeholder="Leave feedback here (optional)..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={submitting}
          />
          <Button
            type="submit"
            className={`bg-primary text-white rounded-lg  w-32 font-semibold shadow transition
              ${submitting ? "opacity-70 cursor-not-allowed" : ""}
            `}
            disabled={submitting || !selectedStatus}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>

      {/* ---- REST OF CARD DETAILS (UNCHANGED) ---- */}
      <Card className="shadow-lg border-2 border-primary/40 rounded-2xl">
        <CardContent className="p-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {statusBlock(log?.status)}
              <span className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                {log?.title}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm mt-2 text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(log?.timestamp).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="inline-flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {log?.duration} min
              </span>
              <span className="inline-flex items-center gap-1">
                approvals:
                <div className="flex gap-1 text-sm text-muted-foreground mt-1">
                  {[...Array(log?.approvals)].fill(1).map((val, index) => (
                    <BadgeCheck
                      key={`green-${index}-${log?.title}`}
                      className="text-green-500 w-4 h-4"
                    />
                  ))}
                  {[...Array(3 - log?.approvals)].fill(1).map((val, index) => (
                    <BadgeCheck
                      key={`gray-${index}-${log?.title}`}
                      className="text-gray-500 w-4 h-4"
                    />
                  ))}
                </div>
              </span>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2 text-base text-primary">
              Summary
            </div>
            <div className="rounded-lg bg-muted p-4 text-foreground text-base whitespace-pre-line">
              {log?.summary}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="font-medium text-muted-foreground">
                Reviewer / Validator
              </div>
              <div className="flex items-center gap-2 text-lg">
                <UserCheck className="w-5 h-5 text-primary" />
                {log?.validator && (
                  <span className="italic text-muted-foreground">
                    {log?.validator}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-muted-foreground">Log Hash</div>
            <div className="flex items-center gap-2 text-lg">
              <Hash className="w-5 h-5 text-primary" />
              {log?.logHash ? (
                <span className="break-all text-sm">{log?.logHash}</span>
              ) : (
                <span className="italic text-muted-foreground">
                  Not available
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="font-medium text-muted-foreground mb-1">
              Token Reward{" "}
              {log?.status !== "APPROVED" || selectedStatus !== "APPROVED" ? (
                <p className="text-xs text-red-500">(must be approved first)</p>
              ) : null}
            </div>
            {log?.reward ? (
              <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-200">
                <Gift className="w-6 h-6 text-green-700" />
                <div>
                  <div className="font-semibold text-green-700">
                    {log?.reward.tokenValue} {log?.reward.tokenType}
                  </div>
                  <div className="text-xs text-green-900">
                    Transaction:{" "}
                    <span className="break-all">{log?.reward.contractTx}</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {log?.status === "APPROVED" && selectedStatus === "APPROVED" ? (
                  <div className="pb-4">
                    {log?.user?.walletAddress && !log?.reward && (
                      <Button
                        className="flex items-center gap-2 hover:cursor-pointer mt-3"
                        onClick={approveAndReward}
                        disabled={sending || !log?.user?.walletAddress}
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Send Reward Tokens to
                            Account
                          </>
                        )}
                      </Button>
                    )}
                    {log?.reward && (
                      <p className="text-sm text-green-600 mt-2">
                        ✅ Tokens already rewarded for this log.
                      </p>
                    )}
                  </div>
                ) : null}
              </>
            )}
          </div>
          {log?.feedback && (
            <div>
              <div className="font-semibold mb-2 text-gray-500">Feedback</div>
              <div className="rounded-lg bg-muted p-4 text-foreground text-base whitespace-pre-line">
                {log?.feedback}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
