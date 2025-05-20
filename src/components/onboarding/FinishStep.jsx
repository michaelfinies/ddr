"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export function FinishStep() {
  return (
    <motion.div
      key="finish"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex flex-col items-center justify-center gap-5">
        <img
          src="/hero-background.png"
          alt="Mascot"
          className="w-52  h-52 border-2 border-gray-500 rounded-full drop-shadow-2xl"
        />
        <h2 className="text-3xl font-bold text-center -mb-4 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 text-transparent bg-clip-text">
          Welcome to Readify!
        </h2>
        <p className="text-center text-muted-foreground max-w-md -mb-4">
          You’re all set. Your reading journey begins now—start your first book
          and earn rewards!
        </p>
        <Link href="/dashboard">
          <Button
            size="lg"
            className="mt-4 px-10 py-6 text-lg shadow-xl hover:cursor-pointer"
          >
            Finish
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
