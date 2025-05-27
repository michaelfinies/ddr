"use client";

import * as React from "react";
import {
  IconFileWord,
  IconWallet,
  IconBook,
  IconBuildingStore,
  IconUsers,
  IconChartBar,
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
import { useAuthStore } from "@/store/useAuthStore";
import { NavSecondary } from "./nav-secondary";

export function AppSidebar({ ...props }) {
  const { user } = useAuthStore();
  const data = {
    user: user,
    navMain: [
      {
        title: "My logs",
        url: "/logs",
        icon: IconFileWord,
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
        title: "Marketplace",
        url: "/store",
        icon: IconBuildingStore,
      },
      // {
      //   title: "Transaction History",
      //   url: "/history",
      //   icon: IconHistory,
      // },
    ],
    navSecondary: [
      {
        title: "Dashboard",
        url: "/authenticated/dashboard/admin",
        icon: IconChartBar,
      },
      {
        title: "Student Logs",
        url: "/authenticated/logs/admin",
        icon: IconUsers,
      },
      {
        title: "Wallet",
        url: "/authenticated/wallet/admin",
        icon: IconWallet,
      },
      {
        title: "Books",
        url: "/books",
        icon: IconBook,
      },
      {
        title: "Marketplace",
        url: "/authenticated/store/admin",
        icon: IconBuildingStore,
      },
    ],
  };

  console.log("this is the user" + JSON.stringify(user));
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
                  {user?.isAdmin ? (
                    <>
                      <IconBook className="!size-8 text-yellow-400" />
                      <span className="text-transparent text-2xl bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-800 font-extrabold">
                        Readify
                      </span>
                    </>
                  ) : (
                    <>
                      <IconBook className="!size-8 text-blue-400" />
                      <span className="text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-extrabold">
                        Readify
                      </span>
                    </>
                  )}
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={"h-full"}>
        {user ? (
          <>
            {user?.isAdmin ? <NavSecondary items={data.navSecondary} /> : null}
            {!user?.isAdmin ? <NavMain items={data.navMain} /> : null}
          </>
        ) : null}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
