"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/database";
import { DEFAULT_ACTIVE_IDS, findSymptom } from "@/db/symptoms";
import SymptomButton from "@/components/SymptomButton";

export default function Home() {
  const settings = useLiveQuery(() => db.settings.get(1));
  const customSymptoms = useLiveQuery(() => db.customSymptoms.toArray()) ?? [];
  const lastExport = settings?.lastExportDate;
  const daysSinceExport = lastExport
    ? Math.floor((Date.now() - lastExport) / (1000 * 60 * 60 * 24))
    : null;
  const showExportReminder = daysSinceExport === null || daysSinceExport >= 30;

  const activeIds = settings?.activeSymptomIds ?? DEFAULT_ACTIVE_IDS;
  const activeSymptoms = activeIds
    .map((id) => findSymptom(id, customSymptoms))
    .filter(Boolean);

  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">PostOpp</h1>
      </header>
      {showExportReminder && (
        <a
          href="/settings"
          className="block mb-3 px-4 py-3 rounded-lg bg-amber-900/40 border border-amber-600/50 text-sm text-amber-200"
        >
          {daysSinceExport === null
            ? "You haven't backed up your data yet. Tap to export."
            : `It's been ${daysSinceExport} days since your last backup. Tap to export.`}
        </a>
      )}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
        {activeSymptoms.map((symptom) => (
          <SymptomButton key={symptom!.id} symptom={symptom!} />
        ))}
      </div>
    </div>
  );
}
