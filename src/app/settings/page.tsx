"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/database";
import { SYMPTOM_CATALOG, DEFAULT_ACTIVE_IDS } from "@/db/symptoms";
import { requestNotificationPermission } from "@/lib/notifications";
import { clearAllLogs } from "@/db/queries";

export default function SettingsPage() {
  const settings = useLiveQuery(() => db.settings.get(1));
  const [showPicker, setShowPicker] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearText, setClearText] = useState("");

  const activeIds = settings?.activeSymptomIds ?? DEFAULT_ACTIVE_IDS;

  async function toggleNotifications() {
    if (!settings) return;
    if (!settings.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }
    await db.settings.update(1, {
      notificationsEnabled: !settings.notificationsEnabled,
    });
  }

  async function setFollowUpDelay(minutes: number) {
    await db.settings.update(1, { followUpDelayMinutes: minutes });
  }

  async function toggleSymptom(symptomId: string) {
    if (!settings) return;
    const current = [...activeIds];
    const idx = current.indexOf(symptomId);
    if (idx >= 0) {
      if (current.length <= 1) return;
      current.splice(idx, 1);
    } else {
      if (current.length >= 4) return;
      current.push(symptomId);
    }
    await db.settings.update(1, { activeSymptomIds: current });
  }

  async function handleClearData() {
    if (clearText !== "DELETE") return;
    await clearAllLogs();
    await db.settings.update(1, {
      activeSymptomIds: DEFAULT_ACTIVE_IDS,
      lastExportDate: null,
    });
    setShowClearConfirm(false);
    setClearText("");
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex flex-col p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-gray-300 mb-3">
          Home Screen Symptoms
        </h2>
        <p className="text-sm text-gray-400 mb-3">
          Tap to change your {activeIds.length} symptoms (max 4)
        </p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {activeIds.map((id) => {
            const s = SYMPTOM_CATALOG.find((s) => s.id === id);
            if (!s) return null;
            return (
              <div
                key={id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ backgroundColor: s.color }}
              >
                <span>{s.icon}</span>
                <span className="font-medium">{s.shortName}</span>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-full py-3 rounded-lg text-sm font-medium bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
        >
          {showPicker ? "Done" : "Change Symptoms"}
        </button>

        {showPicker && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {SYMPTOM_CATALOG.map((s) => {
              const isActive = activeIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSymptom(s.id)}
                  className="flex items-center gap-2 px-3 py-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-white"
                  style={{
                    backgroundColor: isActive ? s.color : "rgba(255,255,255,0.05)",
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  <span>{s.icon}</span>
                  <span className="text-sm font-medium">{s.shortName}</span>
                  {isActive && <span className="ml-auto">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-gray-300 mb-3">
          Notifications
        </h2>
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
          <div>
            <div className="font-medium">Follow-up Reminders</div>
            <div className="text-sm text-gray-400">
              Get reminded to rate again
            </div>
          </div>
          <button
            onClick={toggleNotifications}
            className={`w-14 h-8 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-white ${
              settings?.notificationsEnabled ? "bg-green-500" : "bg-gray-600"
            }`}
            role="switch"
            aria-checked={settings?.notificationsEnabled ?? false}
            aria-label="Toggle follow-up notifications"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform ${
                settings?.notificationsEnabled
                  ? "translate-x-7"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {settings?.notificationsEnabled && (
          <div className="mt-3 flex gap-2">
            {[30, 60, 120].map((min) => (
              <button
                key={min}
                onClick={() => setFollowUpDelay(min)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white ${
                  settings?.followUpDelayMinutes === min
                    ? "bg-white text-black"
                    : "bg-white/10"
                }`}
              >
                {min < 60 ? `${min} min` : `${min / 60} hr`}
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium text-gray-300 mb-3">Data</h2>
        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-3 rounded-lg text-sm font-medium bg-red-900/30 text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Clear All Data
          </button>
        ) : (
          <div className="p-4 rounded-lg bg-red-900/20 border border-red-800">
            <p className="text-sm text-red-300 mb-3">
              This will permanently delete all your logs. Type DELETE to confirm.
            </p>
            <input
              type="text"
              value={clearText}
              onChange={(e) => setClearText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-red-800 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Type DELETE"
              autoComplete="off"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowClearConfirm(false);
                  setClearText("");
                }}
                className="flex-1 py-2 rounded-lg bg-white/10 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                disabled={clearText !== "DELETE"}
                className="flex-1 py-2 rounded-lg bg-red-700 text-white text-sm disabled:opacity-40"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
