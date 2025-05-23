"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TestQuiz from "@/components/TestQuiz";
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
} from "lucide-react";
import { useParams } from "next/navigation";

export default function LogDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchLog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reading-log/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success)
          throw new Error(data.error || "Failed to fetch log");
        setLog(data.log);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [id]);

  async function handleQuizSubmit(passed) {
    if (passed) {
      try {
        const data = await axios.post("/api/reading-log", {
          userId: user?.id,
          id: params?.id,
          approvals: 2,
        });

        confetti({ particleCount: 120, spread: 100 });
      } catch (e) {
        toast.error("Failed to submit log.");
      } finally {
      }
    }
  }

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
  if (error)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-600">
        {error}
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
      <Card className="shadow-lg border-2 border-primary/40 rounded-2xl">
        <CardContent className="p-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {statusBlock(log.status)}
              <span className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                {log.title}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm mt-2 text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(log.timestamp).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="inline-flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {log.duration} min
              </span>
              <span className="inline-flex items-center gap-1">
                approvals:
                <div className="flex gap-1 text-sm text-muted-foreground mt-1">
                  {[...Array(log.approvals)].fill(1).map((val, index) => (
                    <BadgeCheck
                      key={`green-${index}-${log.title}`}
                      className="text-green-500 w-4 h-4"
                    />
                  ))}
                  {[...Array(3 - log.approvals)].fill(1).map((val, index) => (
                    <BadgeCheck
                      key={`gray-${index}-${log.title}`}
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
              {log.summary}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="font-medium text-muted-foreground">
                Reviewer / Validator
              </div>
              <div className="flex items-center gap-2 text-lg">
                <UserCheck className="w-5 h-5 text-primary" />
                {log.reviewer || log.validatorId || (
                  <span className="italic text-muted-foreground">
                    Not assigned
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-muted-foreground">
              Blockchain Hash
            </div>
            <div className="flex items-center gap-2 text-lg">
              <Hash className="w-5 h-5 text-primary" />
              {log.hash ? (
                <span className="break-all">{log.hash}</span>
              ) : (
                <span className="italic text-muted-foreground">
                  Not available
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="font-medium text-muted-foreground mb-1">
              Token Reward
            </div>
            {log.reward ? (
              <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-200">
                <Gift className="w-6 h-6 text-green-700" />
                <div>
                  <div className="font-semibold text-green-700">
                    {log.reward.tokenValue} {log.reward.tokenType}
                  </div>
                  <div className="text-xs text-green-900">
                    Transaction:{" "}
                    <span className="break-all">{log.reward.contractTx}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="italic text-muted-foreground">
                No reward assigned
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-muted-foreground mb-1">
              Verification Quiz
            </div>
            {log.approvals !== 1 ? (
              <div className="flex items-center justify-center gap-4 w-20 text-center text-green-600 bg-green-100 p-2 text-xs rounded-full border border-green-600 font-thin">
                Passed
              </div>
            ) : (
              <div className="italic text-muted-foreground flex gap-3 mt-1">
                <TestQuiz
                  title={log.title}
                  summary={log.summary}
                  handleQuizSubmit={handleQuizSubmit}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
