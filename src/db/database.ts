import Dexie, { type EntityTable } from "dexie";
import type { EncryptedSymptomLog, UserSettings, CustomSymptom } from "@/types";
const DEFAULT_ACTIVE_IDS = ["ptsd", "migraine", "hip-pain", "sinus"];
import { generateDeviceKey } from "@/lib/crypto";

const db = new Dexie("PostOpp") as Dexie & {
  logs: EntityTable<EncryptedSymptomLog, "id">;
  settings: EntityTable<UserSettings, "id">;
  customSymptoms: EntityTable<CustomSymptom, "id">;
};

db.version(2).stores({
  logs: "++id, timestamp",
  settings: "id",
});

db.version(3).stores({
  logs: "++id, timestamp",
  settings: "id",
  customSymptoms: "id",
});

export async function initializeSettings(): Promise<UserSettings> {
  const existing = await db.settings.get(1);
  if (existing) {
    // Migrate: add new fields if missing
    if (existing.encryptionKey === undefined) {
      const key = await generateDeviceKey();
      await db.settings.update(1, {
        encryptionKey: key,
        pinHash: null,
        pinEnabled: false,
        onboardingCompleted: false,
      });
      return { ...existing, encryptionKey: key, pinHash: null, pinEnabled: false, onboardingCompleted: false };
    }
    return existing;
  }

  const key = await generateDeviceKey();
  const defaults: UserSettings = {
    id: 1,
    activeSymptomIds: DEFAULT_ACTIVE_IDS,
    notificationsEnabled: false,
    followUpDelayMinutes: 60,
    installedAt: Date.now(),
    lastExportDate: null,
    pinHash: null,
    pinEnabled: false,
    encryptionKey: key,
    onboardingCompleted: false,
  };
  await db.settings.put(defaults);
  return defaults;
}

export { db };
