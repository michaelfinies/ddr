"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function WelcomeStep({ onNext }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        <img
          src="/mascot2.png"
          alt="Mascot"
          className="w-46 h-46 mb-4 drop-shadow-2xl"
        />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 mb-2">
          Welcome to Readify!
        </h1>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Track your reading journey, earn crypto rewards, and collect unique
          NFTs—all while building better habits.
        </p>
        <Button
          onClick={onNext}
          size="lg"
          className="px-10 py-6 text-lg shadow-xl hover:cursor-pointer bg-blue-300"
        >
          Let’s Get Started
        </Button>
      </div>
    </motion.div>
  );
}
