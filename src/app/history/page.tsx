import type { Metadata } from "next";
import HistoryClient from "./HistoryClient";

export const metadata: Metadata = {
  title: "History",
  description:
    "View and filter your symptom log history. Export to PDF to share with your healthcare provider.",
};

export default function HistoryPage() {
  return <HistoryClient />;
}
