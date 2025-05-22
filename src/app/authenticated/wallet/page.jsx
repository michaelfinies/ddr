"use client";

import React, { useState, useEffect } from "react";
import BoringAvatar from "boring-avatars";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useBalance,
} from "wagmi";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Copy,
  Wallet,
  Send,
  Trophy,
  Book,
  Star,
  Flame,
  User,
} from "lucide-react";
import { IconBook, IconMedal, IconGift, IconCoin } from "@tabler/icons-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

function shortAddress(addr) {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
}

const BADGE_ICONS = [
  {
    icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    label: "First Book",
    condition: (count) => count >= 1,
  },
  {
    icon: <Book className="w-6 h-6 text-indigo-500" />,
    label: "10 Books",
    condition: (count) => count >= 10,
  },
  {
    icon: <Flame className="w-6 h-6 text-red-500" />,
    label: "Streak",
    condition: (days) => days >= 7,
  },
  {
    icon: <Star className="w-6 h-6 text-purple-500" />,
    label: "1 Hour",
    condition: (minutes) => minutes >= 60,
  },
  {
    icon: <IconMedal className="w-6 h-6 text-emerald-500" />,
    label: "Validator's Choice",
    condition: (reward) => reward?.tokenType === "validator",
  },
  // add more as needed
];

export default function WalletPage() {
  const { user } = useAuthStore();

  const [sending, setSending] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
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

  if (!isConnected) {
  }

  // useEffect(() => {
  //   if (isConnected && address) {
  //     setWallet({ address });
  //   }
  // }, [address, isConnected, setWallet]);

  const metamaskConnector = connectors.find((c) => c.name === "MetaMask");

  // Send token form
  const [sendType, setSendType] = useState("token");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (!user?.id) {
      // Also check for user?.id specifically
      // Optionally clear data if user is not available
      // setRewards([]);
      // setOwnedItems([]);
      // setLogs([]);
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
        // Handle rewards error, e.g., toast.error("Failed to load rewards."), setRewards([])
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

  // Quick stats
  React.useEffect(() => {
    setStats({
      books: logs.length,
      tokens: rewards.reduce((acc, r) => acc + (r.tokenValue || 0), 0),
      streak: calcStreak(logs),
      minutes: logs.reduce((acc, l) => acc + (l.duration || 0), 0),
    });
  }, [logs, rewards]);

  // For live token balance
  const { data: balanceData } = useBalance({
    address: address,
    watch: true,
    enabled: !!address,
  });

  function calcStreak(logs) {
    // simple: 1 per consecutive day, real streak logic may be more involved
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

  // Send token handler (dummy, replace with wagmi contract write as needed)
  async function handleSendToken() {
    setSending(true);
    try {
      // If ERC20: use wagmi writeContract or ethers.js
      // If NFT: similar
      // For demo: just show a fake tx hash
      setTimeout(() => {
        setTxHash("0x" + Math.random().toString(16).slice(2, 18));
        setSending(false);
        toast.success("Token sent!");
      }, 1500);
    } catch (e) {
      toast.error("Error sending token.");
      setSending(false);
    }
  }

  // Badge display logic
  function renderBadges() {
    // Creative logic, e.g. match based on stats/rewards
    const badges = [];
    if (stats.books >= 1)
      badges.push({
        ...BADGE_ICONS[0],
        desc: "Congrats! You read your first book.",
      });
    if (stats.books >= 10)
      badges.push({ ...BADGE_ICONS[1], desc: "10 books read! Keep going." });
    if (stats.streak >= 7)
      badges.push({ ...BADGE_ICONS[2], desc: "Reading streak: 7+ days!" });
    if (stats.minutes >= 60)
      badges.push({ ...BADGE_ICONS[3], desc: "1 hour of reading tracked." });
    // Validator's choice badge for any reward with validator type
    if (rewards.some((r) => r.tokenType === "validator"))
      badges.push({ ...BADGE_ICONS[4], desc: "Validator's Choice!" });

    return badges.length ? (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge, i) => (
          <Card
            key={badge.label}
            className="flex flex-col items-center p-4 rounded-2xl shadow"
          >
            <div className="mb-2">{badge.icon}</div>
            <div className="font-bold text-lg">{badge.label}</div>
            <div className="text-xs text-muted-foreground text-center">
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

  // Activity timeline (reading logs + rewards)
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
            <Card key={log.id} className="flex items-center gap-4 p-4">
              <Badge variant="secondary" className="mr-2">
                <Book className="w-4 h-4 mr-1 inline" />{" "}
                {log.book?.title || "Book"}
              </Badge>
              <div className="flex-1">
                <div>
                  <span className="font-semibold">{log.book?.title}</span>{" "}
                  <span className="text-xs text-muted-foreground">
                    ({log.duration} min)
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {log.summary?.slice(0, 100)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
              {reward ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="flex items-center">
                      <IconCoin className="w-4 h-4 mr-1" /> {reward.tokenValue}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {reward.tokenType} <br />
                    <a
                      className="underline text-blue-500"
                      href={`https://etherscan.io/tx/${reward.contractTx}`}
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

  // Owned items/NFTs grid (optional, show only if you want to display NFTs)
  function renderOwnedItems() {
    if (!ownedItems.length) return null;
    return (
      <div>
        <CardTitle className="mb-2">Owned Items (NFTs/Store)</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ownedItems.map((item) => (
            <Card key={item.id} className="p-4 flex flex-col items-center">
              <IconGift className="w-6 h-6 text-pink-500 mb-2" />
              <div className="font-semibold">{item.item?.title || "Item"}</div>
              {item.qrCodeUrl && (
                <img
                  src={item.qrCodeUrl}
                  alt="QR"
                  className="w-12 h-12 rounded mt-2"
                />
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=" px-4 py-8">
      {/* Header/Profile */}
      <Card className="mb-8 flex flex-col md:flex-row items-center md:items-start p-6 gap-6 rounded-2xl shadow-xl w-3/4">
        <Avatar className="w-20 h-20 shadow">
          {/* Replace with your avatar generator if needed */}
          <BoringAvatar
            size={64}
            name={user?.name || "default"}
            variant={user?.AvatarSeed}
            colors={user?.AvatarColor?.split("-")}
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
            <span className="font-mono">{user?.walletAddress}</span>
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
                onClick={() => connect({ connector: metamaskConnector })}
              >
                Connect MetaMask
              </Button>
            )}
          </div>
          <div className="flex gap-4 mt-2">
            <div>
              <div className="font-bold text-lg">{stats.books}</div>
              <div className="text-xs text-muted-foreground">Books Read</div>
            </div>
            <div>
              <div className="font-bold text-lg">{stats.tokens}</div>
              <div className="text-xs text-muted-foreground">Tokens Earned</div>
            </div>
            <div>
              <div className="font-bold text-lg">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </div>
        <div>
          <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="blue" className="flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Token
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Send Token</DialogTitle>
              <DialogDescription>
                Transfer a reward token or NFT to another address.
              </DialogDescription>
              <div className="space-y-3 mt-4">
                <div>
                  <label className="block mb-1 font-medium">
                    Recipient Address
                  </label>
                  <input
                    className="w-full px-2 py-1 border rounded"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Amount</label>
                  <input
                    className="w-full px-2 py-1 border rounded"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="(ERC20 only)"
                    type="number"
                  />
                </div>
                {/* Could add token/NFT selector here if needed */}
                <Button
                  onClick={handleSendToken}
                  disabled={sending || !recipient}
                >
                  {sending ? "Sending..." : "Send"}
                </Button>
                {txHash && (
                  <div className="text-xs text-blue-600 mt-2">
                    Tx Hash:{" "}
                    <a
                      href={`https://etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {txHash}
                    </a>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
      {/* Main Tabs */}
      <Tabs defaultValue="badges" className="mt-8">
        <TabsList className="mb-4 flex justify-between">
          <TabsTrigger value="badges">Badges & Rewards</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          {ownedItems.length > 0 && (
            <TabsTrigger value="nfts">Owned Items</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="badges">{renderBadges()}</TabsContent>
        <TabsContent value="activity">{renderActivity()}</TabsContent>
        <TabsContent value="nfts">{renderOwnedItems()}</TabsContent>
      </Tabs>
    </div>
  );
}
