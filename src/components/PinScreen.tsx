"use client";

import { useState, useCallback } from "react";

interface PinScreenProps {
  mode: "enter" | "set";
  onSubmit: (pin: string) => Promise<boolean>;
  onForgot?: () => void;
}

export default function PinScreen({ mode, onSubmit, onForgot }: PinScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const handleDigit = useCallback(
    async (digit: string) => {
      if (locked) return;
      const newPin = pin + digit;
      if (newPin.length > 4) return;
      setPin(newPin);
      setError("");

      if (newPin.length === 4) {
        const success = await onSubmit(newPin);
        if (!success) {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          setPin("");
          if (newAttempts >= 3) {
            setLocked(true);
            setError("Too many attempts. Wait 30 seconds.");
            setTimeout(() => {
              setLocked(false);
              setAttempts(0);
              setError("");
            }, 30000);
          } else {
            setError("Wrong PIN. Try again.");
          }
        }
      }
    },
    [pin, locked, attempts, onSubmit]
  );

  const handleDelete = useCallback(() => {
    setPin((p) => p.slice(0, -1));
    setError("");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1a1a2e]">
      <h1 className="text-2xl font-bold mb-2">PostOpp</h1>
      <p className="text-gray-400 mb-8">
        {mode === "set" ? "Set a 4-digit PIN" : "Enter your PIN"}
      </p>

      {/* PIN dots */}
      <div className="flex gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full ${
              i < pin.length ? "bg-white" : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4" role="alert">
          {error}
        </p>
      )}

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map(
          (key) => {
            if (key === "") return <div key="empty" />;
            if (key === "del") {
              return (
                <button
                  key="del"
                  onClick={handleDelete}
                  className="w-18 h-18 rounded-full flex items-center justify-center text-xl text-gray-400 active:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Delete"
                >
                  ←
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => handleDigit(key)}
                disabled={locked}
                className="w-18 h-18 rounded-full flex items-center justify-center text-2xl font-medium bg-white/10 active:bg-white/20 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                style={{ width: 72, height: 72 }}
              >
                {key}
              </button>
            );
          }
        )}
      </div>

      {mode === "enter" && onForgot && (
        <button
          onClick={onForgot}
          className="text-sm text-gray-500 underline focus:outline-none"
        >
          Forgot PIN? (clears all data)
        </button>
      )}
    </div>
  );
}
