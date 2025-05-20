// pages/onboarding.jsx or app/onboarding/page.jsx
import { OnboardingFlow } from "@/components/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 via-sky-100 to-indigo-200">
      <OnboardingFlow />
    </div>
  );
}
