"use client";

import { useState, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/database";
import { SYMPTOM_CATALOG, DEFAULT_ACTIVE_IDS, CUSTOM_COLORS, CUSTOM_ICONS, findSymptom } from "@/db/symptoms";
import { requestNotificationPermission } from "@/lib/notifications";
import { clearAllLogs, exportLogsToJSON, importLogsFromJSON } from "@/db/queries";
import { hashPin } from "@/lib/crypto";
import Link from "next/link";

export default function SettingsPage() {
  const settings = useLiveQuery(() => db.settings.get(1));
  const customSymptoms = useLiveQuery(() => db.customSymptoms.toArray()) ?? [];
  const [showPicker, setShowPicker] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearText, setClearText] = useState("");
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom symptom creation
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customIcon, setCustomIcon] = useState(CUSTOM_ICONS[0]);
  const [customColor, setCustomColor] = useState(CUSTOM_COLORS[0]);

  const activeIds = settings?.activeSymptomIds ?? DEFAULT_ACTIVE_IDS;
  const allSymptoms = [...SYMPTOM_CATALOG, ...customSymptoms.map((c) => ({ ...c, category: "general" as const }))];

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

  async function createCustomSymptom() {
    const name = customName.trim();
    if (!name) return;
    const id = `custom-${Date.now()}`;
    const shortName = name.length > 12 ? name.slice(0, 12) : name;
    await db.customSymptoms.put({ id, name, shortName, icon: customIcon, color: customColor });
    setCustomName("");
    setShowCustomForm(false);
  }

  async function deleteCustomSymptom(id: string) {
    await db.customSymptoms.delete(id);
    // Remove from active if present
    if (activeIds.includes(id)) {
      const updated = activeIds.filter((a) => a !== id);
      if (updated.length === 0) updated.push(DEFAULT_ACTIVE_IDS[0]);
      await db.settings.update(1, { activeSymptomIds: updated });
    }
  }

  async function handleClearData() {
    if (clearText !== "DELETE") return;
    await clearAllLogs();
    await db.customSymptoms.clear();
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
            const s = findSymptom(id, customSymptoms);
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
          <div className="mt-3">
            <div className="grid grid-cols-2 gap-2">
              {allSymptoms.map((s) => {
                const isActive = activeIds.includes(s.id);
                const isCustom = s.id.startsWith("custom-");
                return (
                  <div key={s.id} className="relative">
                    <button
                      onClick={() => toggleSymptom(s.id)}
                      className="w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-white"
                      style={{
                        backgroundColor: isActive ? s.color : "rgba(255,255,255,0.05)",
                        opacity: isActive ? 1 : 0.6,
                      }}
                      aria-pressed={isActive}
                      aria-label={`${s.shortName}${isActive ? ", selected" : ""}`}
                    >
                      <span aria-hidden="true">{s.icon}</span>
                      <span className="text-sm font-medium">{s.shortName}</span>
                      {isActive && <span className="ml-auto" aria-hidden="true">✓</span>}
                    </button>
                    {isCustom && !isActive && (
                      <button
                        onClick={() => deleteCustomSymptom(s.id)}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 text-white text-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label={`Delete ${s.shortName}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full mt-3 py-3 rounded-lg text-sm font-medium bg-white/5 border border-dashed border-gray-600 text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              >
                + Create Custom Symptom
              </button>
            ) : (
              <div className="mt-3 p-4 rounded-lg bg-white/5 border border-gray-600">
                <label htmlFor="custom-symptom-name" className="sr-only">Symptom name</label>
                <input
                  id="custom-symptom-name"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Symptom name"
                  maxLength={30}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-2">Pick an icon:</p>
                  <div className="flex flex-wrap gap-2">
                    {CUSTOM_ICONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setCustomIcon(icon)}
                        className={`w-11 h-11 rounded-lg flex items-center justify-center text-lg ${
                          customIcon === icon ? "bg-white/20 ring-2 ring-white" : "bg-white/5"
                        }`}
                        aria-label={`Icon ${icon}`}
                        aria-pressed={customIcon === icon}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-2">Pick a color:</p>
                  <div className="flex flex-wrap gap-2">
                    {CUSTOM_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setCustomColor(color)}
                        className={`w-11 h-11 rounded-lg ${
                          customColor === color ? "ring-2 ring-white" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${color}`}
                        aria-pressed={customColor === color}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3 p-2 rounded-lg" style={{ backgroundColor: customColor }}>
                  <span className="text-xl">{customIcon}</span>
                  <span className="font-medium">{customName || "Preview"}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowCustomForm(false); setCustomName(""); }}
                    className="flex-1 py-2 rounded-lg bg-white/10 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createCustomSymptom}
                    disabled={!customName.trim()}
                    className="flex-1 py-2 rounded-lg bg-green-700 text-white text-sm disabled:opacity-40"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
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

      <section className="mb-8">
        <h2 className="text-lg font-medium text-gray-300 mb-3">Security</h2>
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 mb-3">
          <div>
            <div className="font-medium">PIN Lock</div>
            <div className="text-sm text-gray-400">
              Require PIN to open app
            </div>
          </div>
          <button
            onClick={async () => {
              if (!settings) return;
              if (settings.pinEnabled) {
                await db.settings.update(1, { pinEnabled: false, pinHash: null });
              } else {
                setShowPinSetup(true);
              }
            }}
            className={`w-14 h-8 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-white ${
              settings?.pinEnabled ? "bg-green-500" : "bg-gray-600"
            }`}
            role="switch"
            aria-checked={settings?.pinEnabled ?? false}
            aria-label="Toggle PIN lock"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform ${
                settings?.pinEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        {showPinSetup && (
          <div className="p-4 rounded-lg bg-white/5 mb-3">
            <label htmlFor="pin-input" className="text-sm text-gray-400 mb-2 block">Enter a 4-digit PIN:</label>
            <input
              id="pin-input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white text-center text-2xl tracking-widest mb-3 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="----"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowPinSetup(false); setNewPin(""); }}
                className="flex-1 py-2 rounded-lg bg-white/10 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (newPin.length !== 4) return;
                  const hash = await hashPin(newPin);
                  await db.settings.update(1, { pinEnabled: true, pinHash: hash });
                  setShowPinSetup(false);
                  setNewPin("");
                }}
                disabled={newPin.length !== 4}
                className="flex-1 py-2 rounded-lg bg-green-700 text-white text-sm disabled:opacity-40"
              >
                Set PIN
              </button>
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500">
          Data is always encrypted with AES-256. PIN adds an extra lock screen.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-gray-300 mb-3">Legal</h2>
        <div className="space-y-2">
          <Link
            href="/privacy"
            className="block p-4 rounded-lg bg-white/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white"
          >
            Privacy Policy →
          </Link>
          <Link
            href="/terms"
            className="block p-4 rounded-lg bg-white/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white"
          >
            Terms of Service →
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium text-gray-300 mb-3">Data</h2>
        <div className="space-y-2 mb-4">
          <button
            onClick={async () => {
              try {
                const json = await exportLogsToJSON();
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `postopp-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              } catch {
                alert("Export failed. Please try again.");
              }
            }}
            className="w-full py-3 rounded-lg text-sm font-medium bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Export Backup (JSON)
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-lg text-sm font-medium bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Import Backup (JSON)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setImportStatus("");
              try {
                const text = await file.text();
                const count = await importLogsFromJSON(text);
                setImportStatus(`Imported ${count} log${count !== 1 ? "s" : ""} successfully.`);
              } catch {
                setImportStatus("Import failed. Make sure this is a valid PostOpp backup file.");
              }
              e.target.value = "";
            }}
          />
          <div aria-live="polite" role="status">
            {importStatus && (
              <p className={`text-sm ${importStatus.startsWith("Import failed") ? "text-red-400" : "text-green-400"}`}>
                {importStatus}
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Backups include all symptom logs with GPS and timestamps. Use this to transfer data between devices.
          </p>
        </div>
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
            <label htmlFor="clear-confirm" className="sr-only">Type DELETE to confirm</label>
            <input
              id="clear-confirm"
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
