"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import NavBar from "@/components/NavBar";
import Onboarding from "@/components/Onboarding";
import PinScreen from "@/components/PinScreen";
import { registerServiceWorker } from "@/lib/sw-register";
import { db, initializeSettings } from "@/db/database";
import { setSessionKey } from "@/db/queries";
import { verifyPin } from "@/lib/crypto";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const settings = useLiveQuery(() => db.settings.get(1));

  useEffect(() => {
    registerServiceWorker();
    initializeSettings().then((s) => {
      // If no PIN enabled, use device key automatically
      if (!s.pinEnabled) {
        setSessionKey(s.encryptionKey);
        setUnlocked(true);
      }
      if (!s.onboardingCompleted) {
        setShowOnboarding(true);
      }
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  // Show onboarding first
  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={() => {
          setShowOnboarding(false);
        }}
      />
    );
  }

  // PIN gate if enabled
  if (settings?.pinEnabled && !unlocked) {
    return (
      <PinScreen
        mode="enter"
        onSubmit={async (pin) => {
          if (!settings.pinHash) return false;
          const valid = await verifyPin(pin, settings.pinHash);
          if (valid) {
            // Derive encryption key from PIN
            setSessionKey(pin);
            setUnlocked(true);
            return true;
          }
          return false;
        }}
        onForgot={async () => {
          if (
            confirm(
              "This will permanently delete ALL your data. Are you sure?"
            )
          ) {
            await db.logs.clear();
            await db.settings.update(1, {
              pinEnabled: false,
              pinHash: null,
            });
            setSessionKey(settings.encryptionKey);
            setUnlocked(true);
          }
        }}
      />
    );
  }

  return (
    <>
      <main className="pb-16">{children}</main>
      <NavBar />
    </>
  );
}
