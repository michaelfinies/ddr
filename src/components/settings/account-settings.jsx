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

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export function AccountSettings() {
  const [googleConnected, setGoogleConnected] = React.useState(false);

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

  function handleGoogleConnect() {
    setGoogleConnected(true);
    toast.success("Google connected!", {
      description: "Your Google account is now connected.",
    });
    // Add OAuth logic later
  }

  function handleGoogleDisconnect() {
    setGoogleConnected(false);
    toast("Disconnected Google account.");
    // Add disconnect logic later
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
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
                        type="password"
                        placeholder="New password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Google Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                {googleConnected
                  ? "Google Account Connected"
                  : "Google Account Not Connected"}
              </div>
              <div className="text-sm text-muted-foreground">
                {googleConnected
                  ? "Your account is linked with Google."
                  : "Connect your Google account for easy login."}
              </div>
            </div>
            {googleConnected ? (
              <Button variant="outline" onClick={handleGoogleDisconnect}>
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleGoogleConnect}>Connect</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
