"use client";

import React, { useState, useEffect } from "react";
import BoringAvatar from "boring-avatars";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useReadContract,
} from "wagmi";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { REWARD_TOKEN_ABI, REWARD_TOKEN_ADDRESS } from "@/constants/contracts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Copy,
  Wallet,
  Trophy,
  Book,
  Star,
  Flame,
  User,
  Sun,
  Clock,
} from "lucide-react";

import { IconMedal, IconGift, IconCoin } from "@tabler/icons-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { QRCodeCanvas } from "qrcode.react";

function shortAddress(addr) {
  return addr ? addr.slice(0, 10) + "..." + addr.slice(-10) : "";
}

const BADGE_ICONS = [
  {
    icon: <Trophy className="w-8 h-8 text-yellow-600" />,
    label: "First Book",
    desc: "Congrats! You read your first book.",
    theme: "bg-yellow-300 text-yellow-900 shadow-lg border-yellow-800",
    condition: ({ stats }) => stats.books >= 1,
  },
  {
    icon: <Book className="w-8 h-8 text-indigo-600" />,
    label: "10 Books",
    desc: "10 books read! You're on a roll.",
    theme:
      "bg-indigo-200 text-indigo-900 shadow-lg border-indigo-800 bg-opacity-75",
    condition: ({ stats }) => stats.books >= 10,
  },
  {
    icon: <Book className="w-8 h-8 text-pink-600" />,
    label: "25 Books",
    desc: "25 books down. That's dedication!",
    theme: "bg-pink-200 text-pink-900 shadow-md border-pink-800",
    condition: ({ stats }) => stats.books >= 25,
  },
  {
    icon: <Book className="w-8 h-8 text-rose-700" />,
    label: "50 Books",
    desc: "Half a hundred! You're elite.",
    theme: "bg-rose-200 text-rose-900 shadow-xl border-rose-800",
    condition: ({ stats }) => stats.books >= 50,
  },
  {
    icon: <Clock className="w-8 h-8 text-yellow-500" />,
    label: "1 Hour",
    desc: "You've tracked 1 hour of reading.",
    theme: "bg-yellow-100 text-yellow-900 shadow-sm border-yellow-800",
    condition: ({ stats }) => stats.minutes >= 60,
  },
  {
    icon: <Clock className="w-8 h-8 text-yellow-700" />,
    label: "10 Hours",
    desc: "10 hours of focused reading time.",
    theme: "bg-yellow-300 text-yellow-900 shadow-md border-brown-800",
    condition: ({ stats }) => stats.minutes >= 600,
  },
  {
    icon: <Flame className="w-8 h-8 text-orange-600" />,
    label: "7-Day Streak",
    desc: "7 days of consecutive reading!",
    theme: "bg-orange-200 text-orange-900 shadow-lg border-orange-800",
    condition: ({ stats }) => stats.streak >= 7,
  },
  {
    icon: <Flame className="w-8 h-8 text-red-700" />,
    label: "30-Day Streak",
    desc: "30 days in a row. Impressive!",
    theme: "bg-red-200 text-red-900 shadow-xl border-red-800",
    condition: ({ stats }) => stats.streak >= 30,
  },
  {
    icon: <IconMedal className="w-8 h-8 text-green-600" />,
    label: "Validator's Choice",
    desc: "Hand-picked by a validator.",
    theme: "bg-green-300 text-green-900 shadow-lg border-green-800",
    condition: ({ rewards }) =>
      rewards.some((r) => r.tokenType === "validator"),
  },
  {
    icon: <User className="w-8 h-8 text-blue-500" />,
    label: "5 Logs",
    desc: "You've submitted 5 reading logs.",
    theme: "bg-blue-200 text-blue-900 shadow-sm border-blue-800",
    condition: ({ stats }) => stats.books >= 5,
  },
  {
    icon: <User className="w-8 h-8 text-blue-800" />,
    label: "20 Logs",
    desc: "20 reading logs submitted. Nice!",
    theme: "bg-blue-300 text-blue-900 shadow-md border-indigo-800",
    condition: ({ stats }) => stats.books >= 20,
  },
  {
    icon: <Star className="w-8 h-8 text-fuchsia-500" />,
    label: "Night Owl",
    desc: "Logged a session after midnight.",
    theme: "bg-black text-white shadow-md border-fuchsia-800",
    condition: ({ logs }) =>
      logs.some(
        (log) =>
          new Date(log.timestamp).getHours() >= 0 &&
          new Date(log.timestamp).getHours() < 5
      ),
  },
  {
    icon: <Sun className="w-8 h-8 text-yellow-600" />,
    label: "Early Bird",
    desc: "Logged a session before 7 AM.",
    theme: "bg-yellow-100 text-yellow-900 shadow-sm border-orange-800",
    condition: ({ logs }) =>
      logs.some((log) => new Date(log.timestamp).getHours() < 7),
  },
  {
    icon: <Star className="w-8 h-8 text-purple-600" />,
    label: "Power Hour",
    desc: "Logged a session over 60 minutes.",
    theme: "bg-purple-300 text-purple-900 shadow-md border-purple-800",
    condition: ({ logs }) => logs.some((log) => (log.duration || 0) >= 60),
  },
  {
    icon: <IconGift className="w-8 h-8 text-pink-500" />,
    label: "First Reward",
    desc: "Claimed your first reward!",
    theme: "bg-pink-100 text-pink-900 shadow-md border-pink-800",
    condition: ({ rewards }) => rewards.length > 0,
  },
  {
    icon: <IconCoin className="w-8 h-8 text-teal-500" />,
    label: "Token Collector",
    desc: "Earned over 100 tokens.",
    theme: "bg-teal-200 text-teal-900 shadow-lg border-teal-800",
    condition: ({ stats }) => stats.tokens >= 100,
  },
  {
    icon: <IconCoin className="w-8 h-8 text-emerald-700" />,
    label: "Token Hoarder",
    desc: "Earned over 500 tokens.",
    theme: "bg-emerald-300 text-emerald-900 shadow-xl border-green-800",
    condition: ({ stats }) => stats.tokens >= 500,
  },
  {
    icon: <Book className="w-8 h-8 text-cyan-600" />,
    label: "Speed Reader",
    desc: "Finished a book in <1 day.",
    theme: "bg-cyan-200 text-cyan-900 shadow-md border-blue-800",
    condition: ({ logs }) => {
      return logs.some((log) => {
        const started = new Date(log.startedAt || log.timestamp);
        const ended = new Date(log.timestamp);
        const diffHours = (ended - started) / 1000 / 60 / 60;
        return diffHours < 24;
      });
    },
  },
  {
    icon: <Trophy className="w-8 h-8 text-indigo-700" />,
    label: "Legend",
    desc: "Logged 100+ reading sessions!",
    theme: "bg-indigo-300 text-indigo-900 shadow-2xl border-gray-800",
    condition: ({ stats }) => stats.books >= 100,
  },
];

export default function WalletPage() {
  const { user } = useAuthStore();
  const [rewards, setRewards] = React.useState([]);
  const [ownedItems, setOwnedItems] = React.useState([]);
  const [logs, setLogs] = React.useState([]);
  const [stats, setStats] = React.useState({
    books: 0,
    tokens: 0,
    streak: 0,
    minutes: 0,
  });

  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: REWARD_TOKEN_ADDRESS,
    abi: REWARD_TOKEN_ABI,
    functionName: "balanceOf",
    args: [address],
    watch: true,
    enabled: !!address,
  });

  useEffect(() => {
    if (!user?.id) {
      setRewards([]);
      setOwnedItems([]);
      setLogs([]);
      return;
    }

    const fetchData = async () => {
      try {
        const rewardsResponse = await axios.get(
          `/api/token-reward?userId=${user?.id}`
        );
        setRewards(rewardsResponse.data?.rewards || []);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }

      try {
        const itemsResponse = await axios.get(
          `/api/owned-item?userId=${user?.id}`
        );
        setOwnedItems(itemsResponse.data?.items || []);
      } catch (error) {
        console.error("Error fetching owned items:", error);
      }

      try {
        const logsResponse = await axios.get(
          `/api/reading-log?userId=${user?.id}&status=APPROVED`
        );
        setLogs(logsResponse.data?.logs || []);
      } catch (error) {
        console.error("Error fetching reading logs:", error);
      }
    };

    fetchData();
  }, [user]);

  React.useEffect(() => {
    setStats({
      books: logs.length,
      tokens: rewards.reduce((acc, r) => acc + (r.tokenValue || 0), 0),
      streak: calcStreak(logs),
      minutes: logs.reduce((acc, l) => acc + (l.duration || 0), 0),
    });
  }, [logs, rewards]);

  function calcStreak(logs) {
    const dates = logs
      .map((l) => l.timestamp?.slice(0, 10))
      .sort()
      .reverse();
    let streak = 0,
      last = null;
    for (let d of dates) {
      if (!last) {
        last = d;
        streak++;
        continue;
      }
      let prev = new Date(last),
        curr = new Date(d);
      prev.setDate(prev.getDate() - 1);
      if (curr.toISOString().slice(0, 10) === prev.toISOString().slice(0, 10)) {
        streak++;
        last = d;
      } else break;
    }
    return streak;
  }

  function renderBadges() {
    const badges = BADGE_ICONS.filter((badge) =>
      badge.condition({ stats, rewards, logs })
    );

    return badges.length ? (
      <div className="grid grid-cols-2 md:grid-cols-5">
        {badges.map((badge, i) => (
          <Card
            key={badge.label}
            className={`flex mb-3 items-center justify-center w-48 h-48 rounded-full p-4 transition hover:scale-[1.03] duration-300 ${badge.theme} border-3`}
          >
            <div className="animate-pulse-slow -mb-4 ">{badge.icon}</div>
            <div className="font-extrabold text-xl tracking-wide drop-shadow">
              {badge.label}
            </div>
            <div className="text-sm text-gray-600 text-center opacity-90 -mt-5">
              {badge.desc}
            </div>
          </Card>
        ))}
      </div>
    ) : (
      <Card className="p-4 text-center text-muted-foreground">
        <IconGift className="mx-auto w-8 h-8 text-blue-400 mb-2" />
        <div>No badges yet. Log your first book to earn rewards!</div>
      </Card>
    );
  }

  function renderActivity() {
    if (!logs.length)
      return (
        <Card className="p-4 text-center text-muted-foreground">
          <Book className="mx-auto w-8 h-8 text-indigo-400 mb-2" />
          <div>No activity yet.</div>
        </Card>
      );
    return (
      <div className="space-y-4">
        {logs.map((log, i) => {
          const reward = rewards.find((r) => r.logId === log.id);
          return (
            <Card key={log.id} className="flex items-center gap-4 p-4 w-96">
              <Badge variant="secondary" className="mr-2 -mb-2">
                <Book className="w-4 h-4 mr-1 inline" />{" "}
                {log?.status?.toLowerCase() || "no status"}
              </Badge>
              <div className="flex-1">
                <div>
                  <span className="font-semibold">{log?.title}</span>{" "}
                  <span className="text-xs text-muted-foreground">
                    ({log?.duration} min)
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {log?.summary?.slice(0, 100)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(log?.timestamp).toLocaleString()}
                </div>
              </div>
              {reward ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="outline"
                      className="flex items-center justify-center "
                    >
                      <IconCoin className="w-4 h-4 mr-1  fill-yellow-500" />{" "}
                      {reward?.tokenValue}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {reward?.tokenType} <br />
                    <a
                      className="underline text-blue-500"
                      href={`https://etherscan.io/tx/${reward?.contractTx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Tx
                    </a>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </Card>
          );
        })}
      </div>
    );
  }

  function renderOwnedItems() {
    const [showQrId, setShowQrId] = React.useState(null);

    if (!ownedItems.length) return null;
    return (
      <div>
        <CardTitle className="mb-2">Owned Items (NFTs/Store)</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ownedItems.map((item) => (
            <Card key={item.id} className="p-4 flex flex-col items-center">
              <IconGift className="w-12 h-12 text-blue-500 -mb-4" />
              <div className="font-semibold -mb-4">
                {item.item?.title || "Item"}
              </div>
              {item.qrCodeUrl && (
                <img
                  src={item.qrCodeUrl}
                  alt="QR"
                  className="w-12 h-12 rounded"
                />
              )}
              <Button
                className="-mb-1 "
                onClick={() =>
                  setShowQrId(showQrId === item.id ? null : item.id)
                }
              >
                {showQrId === item.id ? "Hide QR Code" : "Generate QR Code"}
              </Button>
              {showQrId === item.id && (
                <div className="mt-1 flex flex-col items-center">
                  <QRCodeCanvas
                    value={`${window.location.origin}/redeem/${item.id}`}
                    size={180}
                    level="H"
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-center">
                    Scan to redeem (removes from wallet)
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      {/* Header/Profile */}
      <Card className="mb-8 w-2/3 flex flex-col md:flex-row items-center md:items-start p-6 gap-6 rounded-2xl shadow-xl">
        <Avatar className="w-20 h-20 shadow">
          <BoringAvatar
            size={64}
            name={user?.name || "default"}
            variant={user?.avatarSeed}
            colors={
              user?.avatarColor?.split("-") ||
              user?.avatarColor?.split("#").map((col) => `#${col}`)
            }
            className="w-20 h-20 rounded-full"
          />
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-2xl mb-1">
            {user?.name || "User"}
          </CardTitle>
          <CardDescription className="mb-2">{user?.email}</CardDescription>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span className="font-mono">
              {shortAddress(user?.walletAddress)}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      user?.walletAddress || address || ""
                    );
                    toast.success("Copied wallet address!");
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy address</TooltipContent>
            </Tooltip>
            <Badge className={isConnected ? "bg-green-500" : "bg-red-500"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            {isConnected ? (
              <Button size="sm" variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() =>
                  connect({
                    connector: connectors.find((c) => c.name === "MetaMask"),
                  })
                }
              >
                Connect
              </Button>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 mt-4">
            <div>
              <div className="font-bold text-lg">{stats.books}</div>
              <div className="text-xs text-muted-foreground">Books Read</div>
            </div>
            <div>
              <div className="font-bold text-lg">
                {tokenBalance !== undefined
                  ? (Number(tokenBalance) / 10 ** 18).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 4 }
                    )
                  : stats.tokens}
              </div>
              <div className="text-xs text-muted-foreground">Token balance</div>
            </div>
            <div>
              <div className="font-bold text-lg">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="badges" className="mt-8">
        <TabsList className="mb-4 flex justify-between">
          <TabsTrigger value="badges">Badges & Rewards</TabsTrigger>
          <TabsTrigger value="activity">Log Transactions</TabsTrigger>
          {ownedItems.length > 0 && (
            <TabsTrigger value="nfts"> Purchased Items</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="badges">{renderBadges()}</TabsContent>
        <TabsContent value="activity">{renderActivity()}</TabsContent>
        <TabsContent value="nfts">{renderOwnedItems()}</TabsContent>
      </Tabs>
    </div>
  );
}
