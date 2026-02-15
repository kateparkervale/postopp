"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/database";
import { SYMPTOM_CATALOG, DEFAULT_ACTIVE_IDS } from "@/db/symptoms";
import SymptomButton from "@/components/SymptomButton";

export default function Home() {
  const settings = useLiveQuery(() => db.settings.get(1));
  const activeIds = settings?.activeSymptomIds ?? DEFAULT_ACTIVE_IDS;
  const activeSymptoms = activeIds
    .map((id) => SYMPTOM_CATALOG.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">PostOpp</h1>
      </header>
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
        {activeSymptoms.map((symptom) => (
          <SymptomButton key={symptom!.id} symptom={symptom!} />
        ))}
      </div>
    </div>
  );
}
