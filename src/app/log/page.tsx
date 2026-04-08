import type { Metadata } from "next";
import LogClient from "./LogClient";

export const metadata: Metadata = {
  title: "Log Symptom",
  description:
    "Log a symptom and rate your pain level. Quick one-tap tracking with optional GPS tagging.",
};

export default function LogPage() {
  return <LogClient />;
}
