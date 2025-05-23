"use client";
import React from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function DangerZoneSettings() {
  const [open, setOpen] = React.useState(false);

  function handleDeleteAccount() {
    setOpen(false);
    toast.error("Account deleted!", {
      description: "Your account has been permanently deleted.",
    });
    // Call your API here for actual delete
  }

  return <div></div>;
}
