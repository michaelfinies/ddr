"use client";
import { IconCirclePlus } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavMain({ items }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu></SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url || "#"}>
                <SidebarMenuButton
                  className={`w-full text-left px-4 py-6 rounded-lg font-medium transition hover:cursor-pointer ${
                    pathname === item.url
                      ? "bg-blue-100 text-black"
                      : " text-gray-600"
                  }`}
                  tooltip={item.title}
                >
                  <div className=" flex items-center justify-center">
                    {item.icon && (
                      <item.icon
                        className={` ${
                          pathname === item.url
                            ? "text-blue-400"
                            : " text-gray-600"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={` ${
                      pathname === item.url ? "text-blue-400" : " text-gray-600"
                    }`}
                  >
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem className="flex items-center justify-center gap-2 mt-10">
            <Link className="w-full" href="/create-log">
              <SidebarMenuButton
                tooltip="Quick Create"
                className={`text-left px-7 w-full flex items-center justify-center py-4 rounded-lg font-medium transition hover:cursor-pointer hover:bg-blue-200 bg-blue-400 border-blue-400 border-2 hover:text-gray-500 text-gray-50
                  
              `}
              >
                <IconCirclePlus className="!size-7" />
                <span className="font-bold">Create Log</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
