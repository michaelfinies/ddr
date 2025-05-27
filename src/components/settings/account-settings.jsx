"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useWalletClient } from "wagmi";
import {
  SUBMISSION_MANAGER_ABI,
  SUBMISSION_MANAGER_ADDRESS,
} from "@/constants/contracts";

const themePresets = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export function AccountSettings() {
  const [open, setOpen] = React.useState(false);
  const [theme, setTheme] = React.useState("system");
  const { data: walletClient } = useWalletClient();

  const form = useForm({
    resolver: zodResolver(appearanceSchema),
    defaultValues: { theme: "system" },
  });

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    if (theme === "system") return;
    document.documentElement.classList.add(theme);
  }, [theme]);

  function onSubmit(data) {
    setTheme(data.theme);
    toast.success("Theme updated!", {
      description: `Theme set to ${data.theme}.`,
    });
  }

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  function onPasswordSubmit(data) {
    toast.success("Password changed!", {
      description: "Your password has been updated.",
    });
    passwordForm.reset();
  }

  function handleDeleteAccount() {
    setOpen(false);
    toast.error("Account deleted!", {
      description: "Your account has been permanently deleted.",
    });
    // Call your API here for actual delete
  }

  async function handleGrantTeacherRole() {
    if (!walletClient) {
      toast.error("Connect wallet first.");
      return;
    }

    try {
      const txHash = await walletClient.writeContract({
        address: SUBMISSION_MANAGER_ADDRESS,
        abi: SUBMISSION_MANAGER_ABI,
        functionName: "addTeacher",
        args: ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
      });

      toast.success("You're now a teacher!", {
        description: `Tx sent: ${txHash}`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to grant teacher role", {
        description: err.message || "Check console for details",
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Password Card */}
      <Card>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        className="w-72"
                        type="password"
                        placeholder="Current password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        className="w-72"
                        type="password"
                        placeholder="New password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-64">
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Theme Selection Card */}
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setTheme(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {themePresets.map((theme) => (
                          <SelectItem key={theme.value} value={theme.value}>
                            {theme.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Theme</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Grant Teacher Role Card */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground -mt-4">
            You have been approved for Admin wallet Access, click below to
            authorize your wallet for approving student logs on-chain.
          </p>
          <Button onClick={handleGrantTeacherRole} className="w-64">
            Grant Teacher Role
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Card */}
      <Card>
        <CardHeader className="-mb-3">
          <CardTitle>Delete your Readify Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-64">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <div>
                <p className="mb-2">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="w-1/2"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="w-1/2"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
