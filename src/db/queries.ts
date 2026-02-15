import { db } from "./database";
import type { SymptomLog } from "@/types";

export async function createLog(log: Omit<SymptomLog, "id">): Promise<number> {
  const id = await db.logs.add(log as SymptomLog);
  return id as number;
}

export async function updateFollowUp(
  logId: number,
  painLevel: number
): Promise<void> {
  await db.logs.update(logId, {
    followUpPainLevel: painLevel,
    followUpTimestamp: Date.now(),
  });
}

export async function getLogsByDateRange(
  startMs: number,
  endMs: number
): Promise<SymptomLog[]> {
  return db.logs
    .where("timestamp")
    .between(startMs, endMs)
    .reverse()
    .sortBy("timestamp");
}

export async function getLogsBySymptom(
  symptomId: string,
  startMs?: number,
  endMs?: number
): Promise<SymptomLog[]> {
  let collection = db.logs.where("symptomId").equals(symptomId);
  const results = await collection.toArray();
  return results
    .filter((l) => {
      if (startMs && l.timestamp < startMs) return false;
      if (endMs && l.timestamp > endMs) return false;
      return true;
    })
    .sort((a, b) => b.timestamp - a.timestamp);
}

export async function getAllLogs(): Promise<SymptomLog[]> {
  return db.logs.orderBy("timestamp").reverse().toArray();
}

export async function getLogById(id: number): Promise<SymptomLog | undefined> {
  return db.logs.get(id);
}

export async function clearAllLogs(): Promise<void> {
  await db.logs.clear();
}
