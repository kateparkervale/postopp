import { db } from "./database";
import type { SymptomLog, EncryptedSymptomLog } from "@/types";
import { encrypt, decrypt } from "@/lib/crypto";

// In-memory encryption key for the current session
let sessionKey: string | null = null;

export function setSessionKey(key: string) {
  sessionKey = key;
}

export function getSessionKey(): string | null {
  return sessionKey;
}

function getKey(): string {
  if (!sessionKey) throw new Error("Encryption key not set");
  return sessionKey;
}

async function encryptLog(
  log: Omit<SymptomLog, "id">
): Promise<Omit<EncryptedSymptomLog, "id">> {
  const { timestamp, ...sensitiveFields } = log;
  const encryptedData = await encrypt(JSON.stringify(sensitiveFields), getKey());
  return { encryptedData, timestamp };
}

async function decryptLog(
  encrypted: EncryptedSymptomLog
): Promise<SymptomLog> {
  try {
    const decrypted = await decrypt(encrypted.encryptedData, getKey());
    const fields = JSON.parse(decrypted);
    return { id: encrypted.id, timestamp: encrypted.timestamp, ...fields };
  } catch {
    // Return placeholder for corrupted entries
    return {
      id: encrypted.id,
      symptomId: "unknown",
      painLevel: 0,
      timestamp: encrypted.timestamp,
      latitude: null,
      longitude: null,
      locationAccuracy: null,
      followUpPainLevel: null,
      followUpTimestamp: null,
      notes: "[encrypted - unable to decrypt]",
    };
  }
}

export async function createLog(log: Omit<SymptomLog, "id">): Promise<number> {
  const encrypted = await encryptLog(log);
  const id = await db.logs.add(encrypted as EncryptedSymptomLog);
  return id as number;
}

export async function updateFollowUp(
  logId: number,
  painLevel: number
): Promise<void> {
  const existing = await db.logs.get(logId);
  if (!existing) return;

  const decrypted = await decryptLog(existing);
  decrypted.followUpPainLevel = painLevel;
  decrypted.followUpTimestamp = Date.now();

  const { id: _id, timestamp, ...sensitiveFields } = decrypted;
  const encryptedData = await encrypt(JSON.stringify(sensitiveFields), getKey());
  await db.logs.update(logId, { encryptedData });
}

export async function getAllLogs(): Promise<SymptomLog[]> {
  const encrypted = await db.logs.orderBy("timestamp").reverse().toArray();
  return Promise.all(encrypted.map(decryptLog));
}

export async function getLogsByDateRange(
  startMs: number,
  endMs: number
): Promise<SymptomLog[]> {
  const encrypted = await db.logs
    .where("timestamp")
    .between(startMs, endMs)
    .toArray();
  const logs = await Promise.all(encrypted.map(decryptLog));
  return logs.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getLogById(id: number): Promise<SymptomLog | undefined> {
  const encrypted = await db.logs.get(id);
  if (!encrypted) return undefined;
  return decryptLog(encrypted);
}

export async function clearAllLogs(): Promise<void> {
  await db.logs.clear();
}
