"use client";
import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BoringAvatar from "boring-avatars";

export function ProfileSettings() {
  const { user } = useAuthStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            {user?.avatarSeed ? (
              <BoringAvatar
                size={20}
                name={user?.name || "default"}
                variant={user?.avatarSeed}
                colors={
                  user?.avatarColor?.split("-") ||
                  user?.avatarColor?.split("#").map((col) => `#${col}`)
                }
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <AvatarFallback className="font-bold text-2xl uppercase">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        <div>
          <p className="text-sm font-medium">Name</p>
          <p className="text-muted-foreground">{user?.name}</p>
        </div>

        <div>
          <p className="text-sm font-medium">Email</p>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <div>
          <p className="text-sm font-medium">School</p>
          <p className="text-muted-foreground">{user?.school}</p>
        </div>

        {user?.bio && (
          <div>
            <p className="text-sm font-medium">Profile Information</p>
            <p className="text-muted-foreground">{user.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
