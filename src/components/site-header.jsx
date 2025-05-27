"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  const TransformHistory = (pathname) => {
    // Handle the case where pathname might be an empty string or just '/'
    if (!pathname || pathname === "/") {
      return ["Home"]; // Or whatever default you prefer
    }
    // Split, filter out empty strings (from leading/trailing slashes), and capitalize the first letter
    return pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => {
        return segment.charAt(0).toUpperCase() + segment.slice(1);
      });
  };

  const pathSegments = TransformHistory(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-gray-700">
              {pathSegments.map((name, index) => (
                // Add the key to the outermost element within the map.
                // Using a combination of name and index is generally safe for stable lists.
                <li
                  key={`${name}-${index}`}
                  className="flex items-center gap-1"
                >
                  {index > 0 && ( // Only render separator for segments after the first one
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 rtl:rotate-180" // Apply rtl:rotate-180 directly here
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <div className="block transition-colors hover:text-gray-900">
                    {name}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </h1>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  );
}
