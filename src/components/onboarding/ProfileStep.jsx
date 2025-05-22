"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import BoringAvatar from "boring-avatars";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AVATAR_SEEDS = ["marble", "beam", "pixel", "sunset", "ring", "bauhaus"];

const THEME_OPTIONS = [
  {
    colors: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
  },
  {
    colors: ["#FFB347", "#F98866", "#A2DED0", "#00BCD4", "#5C6BC0"],
  },
  {
    colors: ["#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA"],
  },
  {
    colors: ["#F44336", "#9C27B0", "#3F51B5", "#2196F3", "#00BCD4"],
  },
];

export function ProfileStep({ profile, setProfile, onNext }) {
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState(
    profile.avatarSeed || AVATAR_SEEDS[0]
  );
  const [selectedTheme, setSelectedTheme] = useState(0);

  const handleThemeChange = (value) => {
    const themeIndex = parseInt(value, 10);
    setProfile({
      ...profile,
      avatarColor: THEME_OPTIONS[themeIndex]?.colors?.join("-"),
    });
    setSelectedTheme(themeIndex);
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-blue-500">
          Set Up Your Profile
        </h2>
        <Label className="-mb-3" htmlFor="displayName">
          Username
        </Label>
        <Input
          id="displayName"
          placeholder="ExampleReader57"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          required
        />
        <div>
          <Label className="mb-4 block">Choose a theme</Label>
          <RadioGroup defaultValue="0" onValueChange={handleThemeChange}>
            <div className="grid grid-cols-2 gap-4">
              {THEME_OPTIONS.map((theme, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`theme-${index}`}
                    className="bg-gray-200 border-2"
                  />
                  <Label
                    htmlFor={`theme-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <div className="flex space-x-1">
                      {theme.colors.map((color) => (
                        <div
                          key={color}
                          className="w-6 h-6 border rounded-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="mb-4 block">Choose your profile avatar style</Label>
          <div className="grid grid-cols-3 gap-3">
            {AVATAR_SEEDS.map((seed) => (
              <div
                key={`div-${seed}`}
                className="p-1 flex items-center justify-center"
              >
                <button
                  key={seed}
                  type="button"
                  className={cn(
                    "rounded-full border-2 transition-all",
                    selectedAvatarSeed === seed
                      ? "border-blue-500 ring-2 ring-indigo-400"
                      : "border-muted"
                  )}
                  onClick={() => {
                    setSelectedAvatarSeed(seed);
                    setProfile({ ...profile, avatarSeed: seed });
                  }}
                >
                  <BoringAvatar
                    size={64}
                    name={profile.name || "default"}
                    variant={seed}
                    colors={THEME_OPTIONS[selectedTheme].colors}
                    className="w-16 h-16 rounded-full"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onNext()}
          className="mt-2"
          disabled={!profile.name || !profile.avatarSeed}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
