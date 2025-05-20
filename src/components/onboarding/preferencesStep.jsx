import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Biography",
  "Self-Help",
  "Technology",
  "History",
  "Young Adult",
  "Comics/Graphic Novels",
];

export function PreferencesStep({ prefs, setPrefs, onNext }) {
  return (
    <motion.div
      key="prefs"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-center">
          Personalize Your Experience
        </h2>
        <div>
          <Label className="mb-4">Favorite Genres</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                className={cn(
                  "px-3 py-1 rounded-full border transition-all text-sm",
                  prefs.genres?.includes(genre)
                    ? "bg-gradient-to-r from-blue-400 to-indigo-400 text-white border-indigo-600"
                    : "bg-muted border-gray-300 text-muted-foreground"
                )}
                onClick={() => {
                  const current = prefs.genres || [];
                  setPrefs({
                    ...prefs,
                    genres: current.includes(genre)
                      ? current.filter((g) => g !== genre)
                      : [...current, genre],
                  });
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-4" htmlFor="goal">
            Reading Goal{" "}
            <span className="text-muted-foreground">(books/month)</span>
          </Label>
          <Input
            className="w-1/3"
            id="goal"
            type="number"
            min={1}
            placeholder="1"
            value={prefs.goal}
            onChange={(e) => setPrefs({ ...prefs, goal: e.target.value })}
          />
        </div>
        <Button
          onClick={onNext}
          disabled={!(prefs.genres?.length && prefs.goal > 0)}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
