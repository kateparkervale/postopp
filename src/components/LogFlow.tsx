"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/database";
import { findSymptom } from "@/db/symptoms";
import { createLog } from "@/db/queries";
import { getCurrentLocation } from "@/lib/geolocation";
import { scheduleFollowUp } from "@/lib/notifications";
import PainScale from "@/components/PainScale";
import LogConfirmation from "@/components/LogConfirmation";

interface LogFlowProps {
  symptomId: string;
}

export default function LogFlow({ symptomId }: LogFlowProps) {
  const router = useRouter();
  const settings = useLiveQuery(() => db.settings.get(1));
  const customSymptoms = useLiveQuery(() => db.customSymptoms.toArray()) ?? [];
  const symptom = findSymptom(symptomId, customSymptoms);

  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const handleLog = useCallback(async () => {
    if (painLevel === null || !symptom || isLogging) return;
    setIsLogging(true);

    const location = await getCurrentLocation();
    const logId = await createLog({
      symptomId: symptom.id,
      painLevel,
      timestamp: Date.now(),
      latitude: location.latitude,
      longitude: location.longitude,
      locationAccuracy: location.accuracy,
      followUpPainLevel: null,
      followUpTimestamp: null,
      notes: "",
    });

    if (settings?.notificationsEnabled && settings.followUpDelayMinutes > 0) {
      scheduleFollowUp(
        logId,
        symptom.name,
        settings.followUpDelayMinutes * 60 * 1000
      );
    }

    setShowConfirmation(true);
  }, [painLevel, symptom, isLogging, settings]);

  const handleConfirmDone = useCallback(() => {
    router.push("/");
  }, [router]);

  if (!symptom) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-4rem)]">
        <p className="text-xl text-gray-400">Symptom not found</p>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <LogConfirmation
        symptomName={symptom.name}
        painLevel={painLevel!}
        onDone={handleConfirmDone}
      />
    );
  }

  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col p-4">
      <header className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-lg px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          aria-label="Go back"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold ml-4" style={{ color: symptom.color }}>
          {symptom.icon} {symptom.name}
        </h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-xl text-gray-300 mb-8">How bad is it?</p>
        <PainScale value={painLevel} onChange={setPainLevel} />
      </div>

      <button
        onClick={handleLog}
        disabled={painLevel === null || isLogging}
        className="w-full h-16 rounded-2xl text-xl font-bold text-white transition-transform active:scale-95 disabled:opacity-40 focus:outline-none focus:ring-3 focus:ring-white mb-2"
        style={{
          backgroundColor: painLevel !== null ? symptom.color : "rgba(255,255,255,0.1)",
        }}
      >
        {isLogging ? "Logging..." : "LOG IT"}
      </button>
    </div>
  );
}
