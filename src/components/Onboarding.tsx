"use client";

import { db } from "@/db/database";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  async function handleAccept() {
    await db.settings.update(1, { onboardingCompleted: true });
    onComplete();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1a1a2e]">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">PostOpp</h1>
        <p className="text-center text-gray-400 mb-8">
          Quick symptom tracking for veterans
        </p>

        <div className="bg-white/5 rounded-2xl p-6 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h2 className="font-bold text-lg">Not a Medical Device</h2>
              <p className="text-sm text-gray-300">
                PostOpp is a personal symptom tracker. It does{" "}
                <strong>not</strong> diagnose, treat, or prevent any medical
                condition.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🩺</span>
            <div>
              <h2 className="font-bold">Always Consult Your Doctor</h2>
              <p className="text-sm text-gray-300">
                For personal tracking only. Always consult your VA medical team
                or healthcare provider for medical decisions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h2 className="font-bold">Your Data Stays on Your Device</h2>
              <p className="text-sm text-gray-300">
                All data is stored locally and encrypted with AES-256. No
                accounts, no cloud, no tracking. You own your data.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <h2 className="font-bold">GPS Location</h2>
              <p className="text-sm text-gray-300">
                PostOpp may request your location to log where symptoms occur.
                You can deny this permission — the app works without it.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-900/20 rounded-xl p-4 mb-6 border border-red-800/50">
          <h3 className="font-bold text-red-300 mb-2">Emergency Resources</h3>
          <ul className="text-sm text-red-200 space-y-1">
            <li>
              <strong>Emergency:</strong> Call 911
            </li>
            <li>
              <strong>Veterans Crisis Line:</strong> Dial 988, then press 1
            </li>
            <li>
              <strong>Crisis Text Line:</strong> Text 838255
            </li>
            <li>
              <strong>VA Benefits:</strong> 1-800-827-1000 or VA.gov
            </li>
          </ul>
        </div>

        <button
          onClick={handleAccept}
          className="w-full h-14 rounded-2xl text-lg font-bold bg-white text-black active:scale-95 transition-transform focus:outline-none focus:ring-3 focus:ring-white"
        >
          I Understand — Continue
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
