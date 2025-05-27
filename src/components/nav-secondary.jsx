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

export function NavSecondary({ items }) {
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
                      ? "bg-yellow-100 text-black"
                      : " text-gray-600"
                  }`}
                  tooltip={item.title}
                >
                  <div className=" flex items-center justify-center">
                    {item.icon && (
                      <item.icon
                        className={` ${
                          pathname === item.url
                            ? "text-yellow-800"
                            : " text-gray-600"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={` ${
                      pathname === item.url
                        ? "text-yellow-800"
                        : " text-gray-600"
                    }`}
                  >
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
