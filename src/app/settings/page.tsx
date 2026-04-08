import type { Metadata } from "next";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Customize your symptoms, notifications, PIN lock, and data export options. Your data, your control.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
