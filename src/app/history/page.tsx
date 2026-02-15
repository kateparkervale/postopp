"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { getSymptomById } from "@/db/symptoms";
import { getPainColor } from "@/lib/constants";
import { exportToPdf } from "@/lib/pdf-export";
import { getAllLogs } from "@/db/queries";
import type { SymptomLog } from "@/types";

export default function HistoryPage() {
  const [filter, setFilter] = useState<string | null>(null);

  const logs = useLiveQuery(async () => {
    const allLogs = await getAllLogs();
    if (filter) return allLogs.filter((l) => l.symptomId === filter);
    return allLogs;
  }, [filter]);

  const grouped = groupByDate(logs ?? []);

  const activeSymptomIds = [
    ...new Set((logs ?? []).map((l) => l.symptomId)),
  ];

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex flex-col p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">History</h1>
        <button
          onClick={() => exportToPdf()}
          className="px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          Export PDF
        </button>
      </header>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-shrink-0">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${
            filter === null ? "bg-white text-black" : "bg-white/10 text-white"
          }`}
        >
          All
        </button>
        {activeSymptomIds.map((id) => {
          const symptom = getSymptomById(id);
          if (!symptom) return null;
          return (
            <button
              key={id}
              onClick={() => setFilter(filter === id ? null : id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                filter === id ? "text-white" : "text-white/70"
              }`}
              style={{
                backgroundColor: filter === id ? symptom.color : "rgba(255,255,255,0.1)",
              }}
            >
              {symptom.icon} {symptom.shortName}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {(!logs || logs.length === 0) && (
          <div className="flex items-center justify-center h-48 text-gray-400 text-lg">
            No logs yet. Tap a symptom on the home screen to start.
          </div>
        )}
        {Object.entries(grouped).map(([dateStr, entries]) => (
          <div key={dateStr}>
            <div className="sticky top-0 py-2 text-sm font-medium text-gray-400 bg-[#1a1a2e]">
              {dateStr}
            </div>
            {entries.map((log) => {
              const symptom = getSymptomById(log.symptomId);
              if (!symptom) return null;
              return (
                <div
                  key={log.id}
                  className="flex items-center gap-3 py-3 border-b border-white/5"
                >
                  <span className="text-2xl">{symptom.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{symptom.shortName}</div>
                    {log.latitude !== null && (
                      <div className="text-xs text-gray-500">
                        📍 {log.latitude.toFixed(4)}, {log.longitude!.toFixed(4)}
                      </div>
                    )}
                    {log.followUpPainLevel !== null && (
                      <div className="text-sm text-gray-400">
                        Follow-up:{" "}
                        <span style={{ color: getPainColor(log.followUpPainLevel) }}>
                          {log.followUpPainLevel}/10
                        </span>
                        {" at "}
                        {formatTime(log.followUpTimestamp!)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div
                      className="text-lg font-bold"
                      style={{ color: getPainColor(log.painLevel) }}
                    >
                      {log.painLevel}/10
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatTime(log.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function groupByDate(
  logs: SymptomLog[]
): Record<string, SymptomLog[]> {
  const groups: Record<string, SymptomLog[]> = {};
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const log of logs) {
    const date = new Date(log.timestamp);
    let label: string;
    if (isSameDay(date, today)) {
      label = "Today";
    } else if (isSameDay(date, yesterday)) {
      label = "Yesterday";
    } else {
      label = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(log);
  }
  return groups;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
