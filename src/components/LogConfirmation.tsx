"use client";

import { useEffect } from "react";

interface LogConfirmationProps {
  symptomName: string;
  painLevel: number;
  onDone: () => void;
}

export default function LogConfirmation({
  symptomName,
  painLevel,
  onDone,
}: LogConfirmationProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1500);
    if ("vibrate" in navigator) {
      navigator.vibrate(100);
    }
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: "rgba(26, 26, 46, 0.95)" }}
      role="alert"
      aria-live="assertive"
    >
      <div className="text-7xl mb-4">✓</div>
      <div className="text-3xl font-bold text-white mb-2">Logged!</div>
      <div className="text-xl text-gray-300">
        {symptomName} &middot; Level {painLevel}
      </div>
      <div className="text-lg text-gray-400 mt-1">
        {new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
