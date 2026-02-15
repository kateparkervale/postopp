export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const result = await Notification.requestPermission();
  return result === "granted";
}

export async function scheduleFollowUp(
  logId: number,
  symptomName: string,
  delayMs: number
): Promise<void> {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const reg = await navigator.serviceWorker?.ready;
  if (!reg) return;

  setTimeout(async () => {
    try {
      await reg.showNotification(`How is your ${symptomName}?`, {
        body: "Tap to update your symptom level",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        tag: `followup-${logId}`,
        data: { logId },
        requireInteraction: true,
      });
    } catch (err) {
      console.error("Failed to show notification:", err);
    }
  }, delayMs);
}
