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

export interface UserSettings {
  id: number;
  activeSymptomIds: string[];
  notificationsEnabled: boolean;
  followUpDelayMinutes: number;
  installedAt: number | null;
  lastExportDate: number | null;
}
