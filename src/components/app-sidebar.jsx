"use client";

import * as React from "react";
import {
  IconFileWord,
  IconMedal,
  IconUsers,
  IconWallet,
  IconBook,
  IconHistory,
  IconBuildingStore,
} from "@tabler/icons-react";
import Link from "next/link";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "My logs",
      url: "/logs",
      icon: IconFileWord,
    },
    {
      title: "LeaderBoard",
      url: "/leaderboard",
      icon: IconMedal,
    },
    {
      title: "Wallet",
      url: "/wallet",
      icon: IconWallet,
    },
    {
      title: "Books",
      url: "/books",
      icon: IconBook,
    },
    {
      title: "History",
      url: "/history",
      icon: IconHistory,
    },
    {
      title: "Store",
      url: "/store",
      icon: IconBuildingStore,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/create-log">
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5 mb-1"
              >
                <div className="flex items-center justify-center">
                  <IconBook className="!size-8 text-blue-400" />

                  <span className="text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-extrabold">
                    Readify
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
