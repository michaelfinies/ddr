"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Web3Provider } from "../providers/wagmi-config";
import WormyChatWidget from "@/components/WormyChat";
import { useAuthStore } from "@/store/useAuthStore";

const layout = ({ children }) => {
  const { user } = useAuthStore();
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6 h-full">
              <Web3Provider>
                {" "}
                {children}
                <WormyChatWidget />
              </Web3Provider>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
