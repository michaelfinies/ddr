"use client";

import React, { useEffect, useState } from "react";
import BoringAvatar from "boring-avatars";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Book, Clock, Flame } from "lucide-react";
import { IconCoin, IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

// Simple color palette for charts
const COLORS = [
  "#7c3aed",
  "#f59e42",
  "#10b981",
  "#ef4444",
  "#facc15",
  "#6366f1",
  "#e879f9",
  "#60a5fa",
  "#22d3ee",
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState({
    students: [],
    logs: [],
    rewards: [],
    stats: {
      students: null,
      books: null,
      tokens: null,
      minutes: null,
      streak: null,
    },
  });

  useEffect(() => {
    console.log("current active user:" + JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (!user?.schoolId) return;
    async function fetchAllData() {
      try {
        const res = await fetch(`/api/admin/dashboard/${user.schoolId}`);
        if (!res.ok) throw new Error("Failed to fetch dashboard data.");
        const data = await res.json();
        console.log("this is the dash data:" + JSON.stringify(data));
        setDashboard(data);
      } catch (err) {
        toast.error("Failed to load school dashboard data.");
      }
    }
    fetchAllData();
  }, [user]);

  const students = dashboard.students || [];
  const allLogs = dashboard.logs || [];
  const allRewards = dashboard.rewards || [];
  const schoolStats = dashboard.stats || {
    students: 0,
    books: 0,
    tokens: 0,
    minutes: 0,
    streak: 0,
  };

  const TOP_N = 8;

  // Books per Student (Top N + Others)
  const sortedBooks = students
    .map((student, i) => ({
      name: student.name?.split(" ")[0] || `Student ${i + 1}`,
      fullName: student.name,
      books: allLogs.filter((l) => l.userId === student.id).length,
      avatarSeed: student.avatarSeed,
      avatarColor: student.avatarColor,
    }))
    .sort((a, b) => b.books - a.books);

  const booksTop = sortedBooks.slice(0, TOP_N);
  const booksOthers = sortedBooks.slice(TOP_N);

  const totalOthersBooks = booksOthers.reduce((sum, s) => sum + s.books, 0);
  const booksChartData = [
    ...booksTop,
    ...(booksOthers.length > 0
      ? [{ name: "Others", books: totalOthersBooks }]
      : []),
  ];

  // Tokens per student (Pie) (Top N + Others)
  const sortedTokens = students
    .map((student, i) => ({
      name: student.name?.split(" ")[0] || `Student ${i + 1}`,
      fullName: student.name,
      value: allRewards
        .filter((r) => r.userId === student.id)
        .reduce((a, r) => a + (r.tokenValue || 0), 0),
    }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

  const tokensTop = sortedTokens.slice(0, TOP_N);
  const tokensOthers = sortedTokens.slice(TOP_N);

  const totalOthersTokens = tokensOthers.reduce((sum, s) => sum + s.value, 0);
  const tokensChartData = [
    ...tokensTop,
    ...(tokensOthers.length > 0
      ? [{ name: "Others", value: totalOthersTokens }]
      : []),
  ];

  // Books Per Day (Timeline)
  const booksPerDay = (() => {
    const map = {};
    allLogs.forEach((l) => {
      const day = l.timestamp?.slice(0, 10);
      if (day) map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map)
      .sort()
      .map(([day, count]) => ({ day, books: count }));
  })();

  // --- RENDER CHARTS ---
  function renderCharts() {
    return (
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart: Top Readers */}
        <Card className="p-4">
          <CardTitle className="mb-4 text-base font-semibold">
            Top Readers
          </CardTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart className="-ml-7" data={booksChartData}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis allowDecimals={false} />
              <ChartTooltip
                formatter={(value, name, props) => [
                  `${value} book${value === 1 ? "" : "s"}`,
                  "Books Read",
                ]}
                labelFormatter={(label) => {
                  const user = booksChartData.find((d) => d.name === label);
                  return user ? user.fullName : label;
                }}
              />
              <Bar dataKey="books" radius={[6, 6, 0, 0]}>
                {booksChartData.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        {/* Pie Chart: Token Distribution */}
        <Card className="p-4">
          <CardTitle className="mb-4 text-base font-semibold">
            Top Token Earners
          </CardTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={tokensChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {tokensChartData.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <ChartTooltip
                formatter={(value, name) => [`${value} tokens`, name]}
                labelFormatter={(label) => {
                  const user = tokensChartData.find((d) => d.name === label);
                  return user ? user.fullName : label;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        {/* Line Chart: Reading Over Time */}
        <Card className="p-4">
          <CardTitle className="mb-4 text-base font-semibold">
            Books Read Over Time
          </CardTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart className="-ml-7" data={booksPerDay}>
              <XAxis dataKey="day" fontSize={11} minTickGap={8} />
              <YAxis allowDecimals={false} />
              <ChartTooltip
                formatter={(value) => [`${value} books`, "Books"]}
              />
              <Line
                type="monotone"
                dataKey="books"
                stroke="#6366f1"
                strokeWidth={2}
                dot={booksPerDay.length < 40}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    );
  }

  function renderSchoolStats() {
    return (
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Users className="w-6 h-6 mb-2 text-primary" />
            <div className="text-2xl font-bold h-10">
              {schoolStats.students === null ? (
                <IconLoader className="w-8 h-8 animate-spin" />
              ) : (
                schoolStats.students
              )}
            </div>
            <div className="text-xs text-muted-foreground">Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Book className="w-6 h-6 mb-2 text-indigo-500" />
            <div className="text-2xl font-bold">
              {schoolStats.books === null ? (
                <IconLoader className="w-8 h-8 animate-spin" />
              ) : (
                schoolStats.books
              )}
            </div>
            <div className="text-xs text-muted-foreground">Books Read</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <IconCoin className="w-6 h-6 mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">
              {schoolStats.tokens === null ? (
                <IconLoader className="w-8 h-8 animate-spin" />
              ) : (
                schoolStats.tokens
              )}
            </div>
            <div className="text-xs text-muted-foreground">Tokens Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Clock className="w-6 h-6 mb-2 text-orange-500" />
            <div className="text-2xl font-bold">
              {schoolStats.minutes === null ? (
                <IconLoader className="w-8 h-8 animate-spin" />
              ) : (
                schoolStats.minutes
              )}
            </div>
            <div className="text-xs text-muted-foreground">Total Minutes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Flame className="w-6 h-6 mb-2 text-rose-500" />
            <div className="text-2xl font-bold">
              {schoolStats.streak === null ? (
                <IconLoader className="w-8 h-8 animate-spin" />
              ) : (
                schoolStats.streak
              )}
            </div>
            <div className="text-xs text-muted-foreground">Longest Streak</div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="px-4 py-8 max-w-7xl">
      <Card
        className="
    mb-8 p-8 flex flex-col md:flex-row items-center justify-between gap-6
    rounded-2xl shadow-xl
    bg-[url('/store2.png')] bg-cover bg-center
    relative bg-amber-400
  "
      >
        <div>
          <CardTitle className="text-2xl text-gray-300">
            Welcome back to readify
          </CardTitle>
          <div className="text-muted-foreground">
            <span className="font-semibold">{user?.name || "-"}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{user?.email}</Badge>
        </div>
      </Card>

      {renderSchoolStats()}
      {renderCharts()}
      <Card className="mt-6 p-4">
        <CardTitle className="mb-2 text-base font-semibold">
          Leaderboard (All Students)
        </CardTitle>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-right py-2">Books</th>
                <th className="text-right py-2">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {sortedBooks.map((student, i) => {
                const tokens =
                  sortedTokens.find((s) => s.fullName === student.fullName)
                    ?.value || 0;
                return (
                  <tr key={student.fullName} className="border-t">
                    <td className="py-1">{student.fullName}</td>
                    <td className="text-right py-1">{student.books}</td>
                    <td className="text-right py-1">{tokens}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
