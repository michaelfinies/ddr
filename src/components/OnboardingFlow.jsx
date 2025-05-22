"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { WelcomeStep } from "./onboarding/welcomeStep";
import { ProfileStep } from "./onboarding/ProfileStep";
import { WalletStep } from "./onboarding/walletStep";
import { PreferencesStep } from "./onboarding/preferencesStep";
import { ConsentStep } from "./onboarding/ConsentStep";
import { FinishStep } from "./onboarding/FinishStep";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { AudienceStep } from "./onboarding/StudentOrSchoolStep";
const STEPS = [
  "Welcome",
  "Audience",
  "Profile",
  "Wallet",
  "Preferences",
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
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    avatarSeed: "pixel",
    avatarColor: "#92A1C6#146A7C#F0AB3D#C271B4#C20D90",
  });
  const [wallet, setWallet] = useState({ address: "" });
  const [prefs, setPrefs] = useState({ genres: [], goal: "" });

  const [consent, setConsent] = useState({
    terms: false,
    notifications: false,
    blockchain: false,
  });

  async function handleFinish() {
    setLoading(true);
    setError("");

    try {
      const payload = {
        email: user?.email,
        name: profile.name,
        avatarSeed: profile.avatarSeed,
        avatarColor: profile.avatarColor,
        walletAddress: wallet.address,
        genres: prefs.genres,
        goal: prefs.goal,
        hasOnboarded: true,
        isSchool: profile.role === "school" || false,
        school: profile.school || null,
      };

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        setUser(res.updatedUser);
        return router.push("/books");
      }
      if (!res.ok) throw new Error(json.error || "Unknown error");

      setStep(step + 1);
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    <WelcomeStep onNext={() => setStep(step + 1)} />,
    <AudienceStep
      profile={profile}
      setProfile={setProfile}
      onNext={() => setStep(step + 1)}
    />,
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
    <ConsentStep
      consent={consent}
      setConsent={setConsent}
      onNext={() => setStep(step + 1)}
    />,
    <FinishStep onNext={handleFinish} loading={loading} error={error} />,
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
