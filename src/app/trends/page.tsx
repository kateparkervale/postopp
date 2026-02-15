"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/database";
import { findSymptom } from "@/db/symptoms";
import { getAllLogs } from "@/db/queries";
import { getPainColor } from "@/lib/constants";
import type { SymptomLog } from "@/types";

type Range = "7d" | "30d" | "90d";

const RANGE_LABELS: Record<Range, string> = { "7d": "Week", "30d": "Month", "90d": "3 Months" };
const RANGE_MS: Record<Range, number> = {
  "7d": 7 * 86400000,
  "30d": 30 * 86400000,
  "90d": 90 * 86400000,
};

export default function TrendsPage() {
  const [range, setRange] = useState<Range>("30d");
  const customSymptoms = useLiveQuery(() => db.customSymptoms.toArray()) ?? [];

  const logs = useLiveQuery(async () => {
    const all = await getAllLogs();
    const cutoff = Date.now() - RANGE_MS[range];
    return all.filter((l) => l.timestamp >= cutoff);
  }, [range]);

  if (!logs) return null;

  // Group by symptom
  const bySymptom = new Map<string, SymptomLog[]>();
  for (const log of logs) {
    const arr = bySymptom.get(log.symptomId) ?? [];
    arr.push(log);
    bySymptom.set(log.symptomId, arr);
  }

  // Sort symptoms by most logged
  const symptomIds = [...bySymptom.keys()].sort(
    (a, b) => (bySymptom.get(b)?.length ?? 0) - (bySymptom.get(a)?.length ?? 0)
  );

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex flex-col p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Trends</h1>
      </header>

      <div className="flex gap-2 mb-6">
        {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white ${
              range === r ? "bg-white text-black" : "bg-white/10"
            }`}
          >
            {RANGE_LABELS[r]}
          </button>
        ))}
      </div>

      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-lg">
          No data for this period.
        </div>
      ) : (
        <div className="space-y-6 flex-1 overflow-y-auto">
          {/* Overall stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Total Logs" value={String(logs.length)} />
            <StatCard
              label="Avg Pain"
              value={(logs.reduce((s, l) => s + l.painLevel, 0) / logs.length).toFixed(1)}
            />
            <StatCard label="Symptoms" value={String(symptomIds.length)} />
          </div>

          {/* Per-symptom charts */}
          {symptomIds.map((id) => {
            const symptom = findSymptom(id, customSymptoms);
            const entries = bySymptom.get(id) ?? [];
            if (!symptom) return null;
            return (
              <SymptomChart
                key={id}
                name={symptom.shortName}
                icon={symptom.icon}
                color={symptom.color}
                entries={entries}
                rangeMs={RANGE_MS[range]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/5 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

function SymptomChart({
  name,
  icon,
  color,
  entries,
  rangeMs,
}: {
  name: string;
  icon: string;
  color: string;
  entries: SymptomLog[];
  rangeMs: number;
}) {
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const avg = sorted.reduce((s, l) => s + l.painLevel, 0) / sorted.length;
  const max = Math.max(...sorted.map((l) => l.painLevel));
  const min = Math.min(...sorted.map((l) => l.painLevel));

  // Build SVG path
  const W = 300;
  const H = 80;
  const PAD = 4;
  const now = Date.now();
  const start = now - rangeMs;

  const points = sorted.map((l) => ({
    x: PAD + ((l.timestamp - start) / rangeMs) * (W - PAD * 2),
    y: PAD + (1 - (l.painLevel - 1) / 9) * (H - PAD * 2),
  }));

  const pathD =
    points.length > 1
      ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
      : "";

  return (
    <div className="rounded-lg bg-white/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex gap-3 text-xs text-gray-400">
          <span>{entries.length} logs</span>
          <span>avg <span style={{ color: getPainColor(Math.round(avg)) }} className="font-bold">{avg.toFixed(1)}</span></span>
        </div>
      </div>

      {points.length > 1 ? (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
          {/* Grid lines */}
          {[1, 5, 10].map((level) => {
            const y = PAD + (1 - (level - 1) / 9) * (H - PAD * 2);
            return (
              <line
                key={level}
                x1={PAD}
                y1={y}
                x2={W - PAD}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            );
          })}
          {/* Line */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
          ))}
        </svg>
      ) : (
        <div className="h-20 flex items-center justify-center text-gray-500 text-sm">
          Single entry: {sorted[0]?.painLevel}/10
        </div>
      )}

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Low: {min}/10</span>
        <span>High: {max}/10</span>
      </div>
    </div>
  );
}
