"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  CircleCheckIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyLogsPage() {
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log(logs);
  }, [logs]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/reading-log");
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        setLogs(data.logs);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const statusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="text-green-500" />;
      case "REJECTED":
        return <XCircle className="text-red-500" />;
      case "PENDING":
      default:
        return <Clock className="text-yellow-500" />;
    }
  };

  return (
    <div className="p-10">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="tlogsext-red-500 py-8 text-center">{error}</div>
      )}

      {logs
        ? !loading &&
          logs?.length === 0 && (
            <div className="text-muted-foreground text-center py-8">
              You have not submitted any reading logs yet.
            </div>
          )
        : null}

      <div className="grid grid-cols-2 gap-6 w-full">
        {logs?.map((log) => (
          <Card
            key={log.id}
            className="cursor-pointer border-gray-200 w-full hover:shadow-lg transition-all border-2 hover:border-primary/50"
            onClick={() => router.push(`/logs/${log.id}`)}
          >
            <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {statusIcon(log.status)}
                  <span className="font-semibold text-lg">{log.title}</span>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-xl font-semibold ${
                    log.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : log.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {log.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                <span>
                  <b>Duration:</b> {log.duration} min
                </span>
                <span>
                  <b>Date:</b>{" "}
                  {new Date(log.timestamp).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex gap-1 text-sm text-muted-foreground mt-1">
                <b>Approvals:</b>
                {[...Array(log.approvals)].fill(1).map((val, index) => (
                  <CircleCheckIcon
                    key={`green-${index}-${log.title}`}
                    className="text-green-500"
                  />
                ))}
                {[...Array(3 - log.approvals)].fill(1).map((val, index) => (
                  <CircleCheckIcon
                    key={`gray-${index}-${log.title}`}
                    className="text-gray-500"
                  />
                ))}
              </div>
              <div className="mt-2 text-base line-clamp-2 text-foreground">
                {log.summary}
              </div>
              {log.status === "APPROVED" && log.reward && (
                <div className="mt-2 flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Reward: {log.reward.tokenValue} {log.reward.tokenType}
                </div>
              )}
              {log.status === "REJECTED" && log.reviewer && (
                <div className="mt-2 text-red-600 text-sm">
                  Reviewed by: {log.reviewer}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
