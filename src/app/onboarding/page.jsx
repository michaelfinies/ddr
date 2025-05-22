// pages/onboarding.jsx or app/onboarding/page.jsx
"use client";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import "./onboarding.css";
import { Web3Provider } from "../providers/wagmi-config";

export default function OnboardingPage() {
  return (
    <div className="flex justify-center content-center items-center h-screen bg-gradient-to-tr from-blue-200 via-sky-100 to-indigo-200">
      <div className="relative w-full h-screen overflow-hidden">
        <div className="area absolute z-0 w-full h-full overflow-hidden">
          <ul className="circles">
            {[...Array(10)].map((_, index) => (
              <li key={index} className="flex items-center justify-center">
                <img
                  width="50"
                  height="50"
                  src="https://img.icons8.com/ios-filled/50/book.png"
                  alt="book"
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <Web3Provider>
            <OnboardingFlow />
          </Web3Provider>
        </div>
      </div>
    </div>
  );
}
