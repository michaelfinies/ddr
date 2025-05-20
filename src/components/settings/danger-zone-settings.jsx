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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <div>
              <p className="mb-4">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
