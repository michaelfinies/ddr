"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { WelcomeStep } from "./onboarding/welcomeStep";
import { ProfileStep } from "./onboarding/ProfileStep";
import { WalletStep } from "./onboarding/walletStep";
import { PreferencesStep } from "./onboarding/preferencesStep";
import { GoogleStep } from "./onboarding/GoogleStep";
import { ConsentStep } from "./onboarding/ConsentStep";
import { FinishStep } from "./onboarding/FinishStep";

const STEPS = [
  "Welcome",
  "Profile",
  "Wallet",
  "Preferences",
  "Google",
  "Consent",
  "Finish",
];

// Progress bar
function ProgressBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 my-6">
      {STEPS.map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-8 rounded-full transition-all duration-300",
            i <= step
              ? "bg-gradient-to-r from-blue-500 to-indigo-400"
              : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}

export function OnboardingFlow({ className }) {
  const [step, setStep] = useState(0);

  const [profile, setProfile] = useState({
    displayName: "",
    avatarSeed: "",
    nftAvatarSeed: "",
  });
  const [wallet, setWallet] = useState({ address: "" });
  const [prefs, setPrefs] = useState({ genres: [], goal: "" });
  const [googleConnected, setGoogleConnected] = useState(false);
  const [consent, setConsent] = useState({
    terms: false,
    notifications: false,
    blockchain: false,
  });

  const steps = [
    <WelcomeStep onNext={() => setStep(step + 1)} />,
    <ProfileStep
      profile={profile}
      setProfile={setProfile}
      onNext={() => setStep(step + 1)}
    />,
    <WalletStep
      wallet={wallet}
      setWallet={setWallet}
      onNext={() => setStep(step + 1)}
    />,
    <PreferencesStep
      prefs={prefs}
      setPrefs={setPrefs}
      onNext={() => setStep(step + 1)}
    />,
    <GoogleStep
      googleConnected={googleConnected}
      setGoogleConnected={setGoogleConnected}
      onNext={() => setStep(step + 1)}
    />,
    <ConsentStep
      consent={consent}
      setConsent={setConsent}
      onNext={() => setStep(step + 1)}
    />,
    <FinishStep />,
  ];

  return (
    <div
      className={cn(
        "flex flex-col items-center w-full h-full min-h-screen justify-center",
        className
      )}
    >
      <Card className="w-[98vw] max-w-lg mx-auto rounded-2xl shadow-xl border-2 bg-white p-1">
        <CardContent className="py-7 px-4 md:px-10">
          <ProgressBar step={step} />
          <AnimatePresence mode="wait" initial={false}>
            {steps[step]}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
