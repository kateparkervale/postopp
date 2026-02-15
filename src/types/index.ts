export type SymptomCategory =
  | "mental-health"
  | "neurological"
  | "musculoskeletal"
  | "respiratory"
  | "gastrointestinal"
  | "general";

export interface Symptom {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  category: SymptomCategory;
}

export interface SymptomLog {
  id?: number;
  symptomId: string;
  painLevel: number;
  timestamp: number;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
  followUpPainLevel: number | null;
  followUpTimestamp: number | null;
  notes: string;
}

// Encrypted version stored in IndexedDB
export interface EncryptedSymptomLog {
  id?: number;
  encryptedData: string; // AES-256-GCM encrypted JSON of SymptomLog fields
  timestamp: number; // kept unencrypted for indexing/sorting
}

export interface UserSettings {
  id: number;
  activeSymptomIds: string[];
  notificationsEnabled: boolean;
  followUpDelayMinutes: number;
  installedAt: number | null;
  lastExportDate: number | null;
  pinHash: string | null; // PBKDF2 hash if PIN enabled
  pinEnabled: boolean;
  encryptionKey: string; // auto-generated device key (used when no PIN)
  onboardingCompleted: boolean;
}
