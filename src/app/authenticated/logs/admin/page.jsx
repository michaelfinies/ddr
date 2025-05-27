"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, CircleCheckIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useAuthStore } from "@/store/useAuthStore"; // Make sure you import this!

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Approved", value: "APPROVED" },
  { label: "Pending", value: "PENDING" },
  { label: "Rejected", value: "REJECTED" },
];

function statusIcon(status) {
  switch (status) {
    case "APPROVED":
      return <CheckCircle2 className="text-green-500 w-4 h-4" />;
    case "REJECTED":
      return <XCircle className="text-red-500 w-4 h-4" />;
    case "PENDING":
    default:
      return <Clock className="text-yellow-500 w-4 h-4" />;
  }
}

export default function AdminLogsPage() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!user?.schoolId) return;
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/logs/${user?.schoolId}`);

        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();

        console.log(data);

        setLogs(
          (data.logs || []).map((log) => ({
            ...log,
            studentName: log.user?.name || "",
            validatorName: log.validator || "",
            tokenType: log.reward?.tokenType || "",
            tokenValue: log.reward?.tokenValue || 0,
          }))
        );
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user]);

  // Filtering logic
  const filteredLogs = useMemo(() => {
    return logs
      .filter(
        (log) =>
          (!search ||
            log.studentName?.toLowerCase().includes(search.toLowerCase())) &&
          (!status || log.status === status)
      )
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }, [logs, search, status]);

  const columns = [
    {
      id: "statusIcon",
      header: "",
      accessorKey: "status",
      cell: ({ getValue }) => statusIcon(getValue()),
    },
    {
      id: "student",
      header: "Student",
      accessorKey: "studentName",
    },
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
    },
    {
      id: "timestamp",
      header: "Date",
      accessorKey: "timestamp",
      cell: ({ getValue }) =>
        new Date(getValue()).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      id: "validator",
      header: "Validator",
      accessorKey: "validatorName",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span
            className={`px-2 py-1 text-xs rounded-xl font-semibold ${
              value === "APPROVED"
                ? "bg-green-100 text-green-700"
                : value === "REJECTED"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {value}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-10 space-y-6">
      <Card className="p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="flex gap-2 w-full max-w-xl">
          <Input
            placeholder="Filter by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <select
            className="border rounded-xl px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setStatus("");
          }}
        >
          Clear
        </Button>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-12">{error}</div>
      ) : (
        <div className="rounded-2xl shadow border bg-background">
          <DataTable
            columns={columns}
            data={filteredLogs}
            getRowProps={(row) => ({
              className:
                "cursor-pointer transition hover:bg-primary/10 hover:shadow text-sm",
              onClick: () =>
                router.push(`/authenticated/logs/admin/${row.original.id}`),
            })}
            pageSize={10}
          />
        </div>
      )}
    </div>
  );
}
