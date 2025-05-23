"use client";
import { useState } from "react";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { AccountSettings } from "@/components/settings/account-settings";

// Sidebar nav items config
const NAV = [
  { key: "profile", label: "Profile Information" },
  { key: "account", label: "Account Settings" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  return (
    <div className="flex bg-[#fafafa] dark:bg-slate-900 dark:text-gray-600 min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 m-10 ml-2">
        <nav>
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setActive(item.key)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                    active === item.key
                      ? "bg-gray-200 dark:bg-gray-900 dark:text-gray-600 text-black"
                      : "hover:bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-600"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className=" mx-auto">
          <div className="bg-white dark:bg-gray-900 border rounded-2xl shadow p-2 m-5">
            {active === "profile" && <ProfileSettings />}
            {active === "account" && <AccountSettings />}
          </div>
        </div>
      </main>
    </div>
  );
}
