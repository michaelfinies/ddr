"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function GoogleStep({ googleConnected, setGoogleConnected, onNext }) {
  function connectGoogle() {
    // Placeholder, replace with actual OAuth
    setGoogleConnected(true);
    setTimeout(onNext, 500);
  }
  return (
    <motion.div
      key="google"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6">
        <img src="/mascot2.png" alt="Mascot" className="w-32 h-32 -mb-6" />
        <h2 className="text-2xl font-bold text-center -mb-4">
          Sync with Google
        </h2>
        <p className="text-center text-muted-foreground max-w-md">
          Connect your Google account to sync your reading with Google Books and
          get reading reminders in your Google Calendar. <br />
        </p>
        <Button
          onClick={connectGoogle}
          className="w-64 flex items-center gap-2 py-6"
          disabled={googleConnected}
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <g>
              <path
                fill="#4285F4"
                d="M43.611,20.083H42V20H24v8h11.303C34.704,34.657,29.272,38,24,38c-7.732,0-14-6.268-14-14s6.268-14,14-14 c3.06,0,5.863,1.1,8.013,2.904l6.052-6.052C33.942,4.049,29.228,2,24,2C12.96,2,4,10.96,4,22s8.96,20,20,20s20-8.96,20-20 C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#34A853"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.06,0,5.863,1.1,8.013,2.904 l6.052-6.052C33.942,4.049,29.228,2,24,2C16.318,2,9.656,6.337,6.306,14.691z"
              ></path>
              <path
                fill="#FBBC05"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#EA4335"
                d="M43.611,20.083L43.595,20L42,20H24v8h11.303 c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24 C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </g>
          </svg>
          {googleConnected ? "Google Connected!" : "Connect Google"}
        </Button>
      </div>
    </motion.div>
  );
}
