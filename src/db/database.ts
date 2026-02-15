import Dexie, { type EntityTable } from "dexie";
import type { SymptomLog, UserSettings } from "@/types";
import { DEFAULT_ACTIVE_IDS } from "./symptoms";

const db = new Dexie("PostOpp") as Dexie & {
  logs: EntityTable<SymptomLog, "id">;
  settings: EntityTable<UserSettings, "id">;
};

db.version(1).stores({
  logs: "++id, symptomId, timestamp, [symptomId+timestamp]",
  settings: "id",
});

export async function initializeSettings(): Promise<UserSettings> {
  const existing = await db.settings.get(1);
  if (existing) return existing;

  const defaults: UserSettings = {
    id: 1,
    activeSymptomIds: DEFAULT_ACTIVE_IDS,
    notificationsEnabled: false,
    followUpDelayMinutes: 60,
    installedAt: Date.now(),
    lastExportDate: null,
  };
  await db.settings.put(defaults);
  return defaults;
}

export { db };
