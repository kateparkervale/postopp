"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getLogById, updateFollowUp } from "@/db/queries";
import { getSymptomById } from "@/db/symptoms";
import PainScale from "@/components/PainScale";
import type { SymptomLog } from "@/types";

function FollowUpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const logId = Number(searchParams.get("logId"));

  const [log, setLog] = useState<SymptomLog | null>(null);
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (logId) {
      getLogById(logId).then((l) => setLog(l ?? null));
    }
  }, [logId]);

  const symptom = log ? getSymptomById(log.symptomId) : null;

  const handleUpdate = useCallback(async () => {
    if (painLevel === null || !log?.id || isUpdating) return;
    setIsUpdating(true);
    await updateFollowUp(log.id, painLevel);
    router.push("/");
  }, [painLevel, log, isUpdating, router]);

  if (!log || !symptom) {
    return (
      <div className="flex items-center justify-center h-screen" role="status" aria-busy="true">
        <p className="text-xl text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">
          How is your{" "}
          <span style={{ color: symptom.color }}>{symptom.name}</span> now?
        </h1>
        <p className="text-gray-400 mb-8">
          Originally rated: {log.painLevel}/10
        </p>
        <PainScale value={painLevel} onChange={setPainLevel} />
      </div>

      <div className="space-y-3 mb-4">
        <button
          onClick={handleUpdate}
          disabled={painLevel === null || isUpdating}
          className="w-full h-16 rounded-2xl text-xl font-bold text-white transition-transform active:scale-95 disabled:opacity-40 focus:outline-none focus:ring-3 focus:ring-white"
          style={{
            backgroundColor:
              painLevel !== null ? symptom.color : "rgba(255,255,255,0.1)",
          }}
        >
          {isUpdating ? "Updating..." : "UPDATE"}
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full h-14 rounded-2xl text-lg font-medium text-gray-400 bg-white/5 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

export default function FollowUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl text-gray-400">Loading...</p>
        </div>
      }
    >
      <FollowUpContent />
    </Suspense>
  );
}
