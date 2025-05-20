"use client";
import { useState } from "react";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { AccountSettings } from "@/components/settings/account-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { DangerZoneSettings } from "@/components/settings/danger-zone-settings";

// Sidebar nav items config
const NAV = [
  { key: "profile", label: "Profile" },
  { key: "account", label: "Account" },
  { key: "appearance", label: "Appearance" },
  { key: "danger", label: "Danger Zone" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  return (
    <div className="flex bg-[#fafafa] min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 m-10 ml-0">
        <nav>
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setActive(item.key)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                    active === item.key
                      ? "bg-gray-200 text-black"
                      : "hover:bg-gray-100 text-gray-600"
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
          <div className="bg-white border rounded-2xl shadow p-2">
            {active === "profile" && <ProfileSettings />}
            {active === "account" && <AccountSettings />}
            {active === "appearance" && <AppearanceSettings />}
            {active === "danger" && <DangerZoneSettings />}
          </div>
        </div>
      </main>
    </div>
  );
}
