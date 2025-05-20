"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function ConsentStep({ consent, setConsent, onNext }) {
  return (
    <motion.div
      key="consent"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-center">
          Permissions & Consent
        </h2>

        <div className="flex items-center gap-3">
          <Checkbox
            checked={consent.notifications}
            onCheckedChange={(v) =>
              setConsent({ ...consent, notifications: v })
            }
          />
          <span>
            Allow Readify to send me notifications about my reading progress and
            rewards.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            checked={consent.blockchain}
            onCheckedChange={(v) => setConsent({ ...consent, blockchain: v })}
          />
          <span>
            I consent to the use of blockchain technology to track and reward my
            reading.
          </span>
        </div>
        <div className="text-xs text-muted-foreground pl-2">
          <b>Disclaimer:</b> Readify is not financial advice. Crypto rewards are
          subject to market risk.
        </div>
        <Button
          onClick={onNext}
          disabled={!(consent.notifications && consent.blockchain)}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
